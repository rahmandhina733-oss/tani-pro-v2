import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Middleware Keamanan (Edge Runtime)
//
// FIX P0: Sebelumnya route /admin, /petani, /pembeli terbuka bebas dan sesi
// hanya "dipercaya" dari localStorage (bisa dipalsukan siapa pun via DevTools).
//
// Sekarang:
// - Sesi = JWT (library `jose`, kompatibel Edge) di cookie httpOnly
//   bernama "tanipro_session" — tidak bisa dibaca/dipalsukan JavaScript klien.
// - Middleware memverifikasi tanda tangan token & mencocokkan ROLE
//   terhadap prefix path sebelum request mencapai halaman.
//
// PENTING: set JWT_SECRET di .env (min. 32 karakter acak):
//   JWT_SECRET="ganti-dengan-string-acak-yang-sangat-panjang-dan-rahasia"
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_COOKIE = "tanipro_session";

function getSecretKey() {
  const secret = process.env.JWT_SECRET ?? "tanipro-dev-only-secret-change-me-in-production!!";
  return new TextEncoder().encode(secret);
}

// Aturan proteksi: prefix path → role yang diizinkan + halaman login tujuan
const PROTECTION_RULES = [
  { prefix: "/admin",   roles: ["ADMIN"],   loginPath: "/admin/login" },
  { prefix: "/petani",  roles: ["PETANI"],  loginPath: "/login" },
  { prefix: "/pembeli", roles: ["PEMBELI"], loginPath: "/login" },
];

// Dashboard default per role (untuk redirect saat role tidak cocok)
const DASHBOARD_BY_ROLE = {
  ADMIN:   "/admin",
  PETANI:  "/petani",
  PEMBELI: "/pembeli",
};

// Path publik yang dikecualikan meski berada di bawah prefix terproteksi
const PUBLIC_PATHS = ["/admin/login"];

function redirectToLogin(request, loginPath) {
  const url = request.nextUrl.clone();
  url.pathname = loginPath;
  url.search = "";
  url.searchParams.set("next", request.nextUrl.pathname);
  const response = NextResponse.redirect(url);
  // Bersihkan cookie sesi yang tidak valid/kedaluwarsa
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Lewatkan path publik (halaman login admin, dll.)
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // 2. Cari aturan proteksi yang cocok dengan path
  const rule = PROTECTION_RULES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );
  if (!rule) return NextResponse.next();

  // 3. Ambil token sesi dari cookie httpOnly
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return redirectToLogin(request, rule.loginPath);

  // 4. Verifikasi tanda tangan & masa berlaku JWT
  let payload;
  try {
    ({ payload } = await jwtVerify(token, getSecretKey(), {
      issuer: "tanipro",
      audience: "tanipro-web",
    }));
  } catch {
    // Token palsu / kedaluwarsa / secret berubah → paksa login ulang
    return redirectToLogin(request, rule.loginPath);
  }

  // 5. Gerbang role: token valid tapi role salah → lempar ke dashboard rolenya
  if (!rule.roles.includes(payload.role)) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_BY_ROLE[payload.role] ?? rule.loginPath;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // 6. Lolos — teruskan identitas ke server components / API via header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", String(payload.sub ?? ""));
  requestHeaders.set("x-user-role", String(payload.role ?? ""));
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*", "/petani/:path*", "/pembeli/:path*"],
};
