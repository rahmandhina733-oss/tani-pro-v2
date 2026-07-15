import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth — unified register + login endpoint
// Body for register: { action: "register", nama, email, password, role, ...profileData }
// Body for login:    { action: "login",    email, password }
// ─────────────────────────────────────────────────────────────────────────────
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

      // Return user data (session handled by NextAuth or similar — omit passwordHash)
      const { passwordHash: _, ...safeUser } = user;
      return NextResponse.json({ success: true, pesan: "Login berhasil", data: safeUser });
    }

    return NextResponse.json({ success: false, pesan: "action harus 'register' atau 'login'" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/auth]", error);
    return NextResponse.json({ success: false, pesan: "Terjadi kesalahan autentikasi", error: error.message }, { status: 500 });
  }
}
