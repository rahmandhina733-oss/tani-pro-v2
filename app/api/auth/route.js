import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth — unified register + login endpoint
// Body for register: { action: "register", nama, email, password, role, ...profileData }
// Body for login:    { action: "login",    email, password }
// Body for logout:   { action: "logout" }
//
// FIX P0 (Keamanan Sesi):
// - Login sukses kini meng-generate JWT (library `jose`) berisi { sub, role }
//   dan menyimpannya di cookie httpOnly "tanipro_session".
// - Cookie httpOnly TIDAK bisa dibaca JavaScript klien → aman dari XSS,
//   dan diverifikasi middleware.js di setiap request ke route terproteksi.
// - Data user yang dikembalikan ke klien hanya untuk kebutuhan TAMPILAN,
//   BUKAN sumber kebenaran otorisasi.
//
// Wajib set di .env: JWT_SECRET="string-acak-min-32-karakter"
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_COOKIE = "tanipro_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

function getSecretKey() {
  const secret = process.env.JWT_SECRET ?? "tanipro-dev-only-secret-change-me-in-production!!";
  return new TextEncoder().encode(secret);
}

/** Buat JWT sesi berisi identitas minimal (id + role). */
async function createSessionToken(user) {
  return new SignJWT({ role: user.role, nama: user.nama, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer("tanipro")
    .setAudience("tanipro-web")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/** Pasang cookie sesi httpOnly pada response. */
function setSessionCookie(response, token) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,                                // tidak terbaca JS klien
    secure: process.env.NODE_ENV === "production", // HTTPS only di production
    sameSite: "lax",                               // mitigasi CSRF
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ── REGISTER ─────────────────────────────────────────────────────────────
    if (action === "register") {
      const { nama, email, password, role, telepon, ...profileData } = body;

      if (!nama || !email || !password || !role)
        return NextResponse.json({ success: false, pesan: "nama, email, password, dan role wajib diisi" }, { status: 400 });

      const VALID_ROLES = ["PETANI", "PEMBELI"];
      if (!VALID_ROLES.includes(role))
        return NextResponse.json({ success: false, pesan: "Role harus PETANI atau PEMBELI" }, { status: 400 });

      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists)
        return NextResponse.json({ success: false, pesan: "Email sudah terdaftar" }, { status: 409 });

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: { nama, email, telepon: telepon ?? null, passwordHash, role },
          select: { id: true, nama: true, email: true, role: true, createdAt: true },
        });

        if (role === "PETANI") {
          const { namaKebun, alamat, provinsi, kabupaten } = profileData;
          if (!namaKebun || !alamat || !provinsi || !kabupaten)
            throw new Error("Profil petani wajib: namaKebun, alamat, provinsi, kabupaten");
          await tx.petaniProfile.create({
            data: { userId: newUser.id, namaKebun, alamat, provinsi, kabupaten },
          });
        }

        if (role === "PEMBELI") {
          const { namaPerusahaan, alamatKantor, industri } = profileData;
          if (!namaPerusahaan || !alamatKantor || !industri)
            throw new Error("Profil pembeli wajib: namaPerusahaan, alamatKantor, industri");
          await tx.pembeliProfile.create({
            data: { userId: newUser.id, namaPerusahaan, alamatKantor, industri },
          });
        }

        await tx.taniPoint.create({ data: { userId: newUser.id } });
        await tx.notifikasi.create({
          data: { userId: newUser.id, judul: "Selamat Bergabung di TaniPro! 🌾",
            pesan: "Akun Anda telah berhasil dibuat. Mulai jelajahi platform TaniPro sekarang.", tipe: "SYSTEM" },
        });

        return newUser;
      });

      return NextResponse.json({ success: true, pesan: "Registrasi berhasil", data: user }, { status: 201 });
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    if (action === "login") {
      const { email, password } = body;
      if (!email || !password)
        return NextResponse.json({ success: false, pesan: "Email dan password wajib diisi" }, { status: 400 });

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          petaniProfile: { select: { id: true, namaKebun: true, provinsi: true } },
          pembeliProfile: { select: { id: true, namaPerusahaan: true, isVerified: true } },
          taniPoint: { select: { totalPoin: true, level: true } },
        },
      });

      if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        return NextResponse.json({ success: false, pesan: "Email atau password salah" }, { status: 401 });

      // Generate JWT sesi & set cookie httpOnly (sumber kebenaran otorisasi)
      const token = await createSessionToken(user);

      const { passwordHash: _, ...safeUser } = user;
      const response = NextResponse.json({
        success: true,
        pesan: "Login berhasil",
        data: safeUser, // hanya untuk tampilan UI — otorisasi via cookie JWT
      });
      return setSessionCookie(response, token);
    }

    // ── LOGOUT ────────────────────────────────────────────────────────────────
    if (action === "logout") {
      const response = NextResponse.json({ success: true, pesan: "Logout berhasil" });
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    return NextResponse.json({ success: false, pesan: "action harus 'register', 'login', atau 'logout'" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/auth]", error);
    return NextResponse.json({ success: false, pesan: "Terjadi kesalahan autentikasi", error: error.message }, { status: 500 });
  }
}

// DELETE /api/auth — alternatif endpoint logout (hapus cookie sesi)
export async function DELETE() {
  const response = NextResponse.json({ success: true, pesan: "Logout berhasil" });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
