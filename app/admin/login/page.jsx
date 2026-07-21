"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /admin/login — Gerbang Rahasia Command Center
 *
 * Brief: minimalis, elegan, sangat tertutup/eksklusif — berbeda total dari
 * /login publik. Hanya dua input (Email, Password) + satu tombol.
 *
 * CATATAN ARSITEKTUR (dipertahankan dari implementasi keamanan sebelumnya):
 * - URL ini TIDAK ditautkan dari Navbar, landing page, footer, sitemap,
 *   maupun /login publik — hanya diakses via pengetikan manual.
 * - Tetap terhubung ke /api/auth nyata (bukan dummy) karena endpoint ini
 *   men-set cookie httpOnly "tanipro_session" (JWT) yang diverifikasi
 *   middleware.js untuk proteksi seluruh route /admin/*. Mengganti ini
 *   dengan data dummy akan meniadakan lapisan keamanan yang sudah dibangun.
 * - Hanya role ADMIN yang lolos dari gerbang ini; role lain ditolak halus
 *   tanpa diarahkan ke dasbor mana pun.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Fingerprint, Loader2, TriangleAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.pesan || "Kredensial tidak dikenali.");
        return;
      }

      // Gerbang role: hanya ADMIN yang boleh lewat dari pintu ini.
      if (json.data.role !== "ADMIN") {
        setError("Akun ini tidak memiliki hak akses.");
        return;
      }

      // Otorisasi sesungguhnya via cookie httpOnly (middleware.js).
      // localStorage di sini hanya cache tampilan minimal, bukan sumber sesi.
      if (typeof window !== "undefined") {
        const u = json.data;
        localStorage.setItem(
          "tanipro_user",
          JSON.stringify({ id: u.id, nama: u.nama, email: u.email, role: u.role })
        );
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Backdrop super minim — tanpa grid/glow ramai, kesan sunyi & tertutup */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />

      <div className="relative w-full max-w-[340px]">
        {/* Simbol tunggal, tanpa judul besar — kesan gerbang privat */}
        <div className="flex justify-center mb-8">
          <div className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <input
            className="w-full bg-transparent border-b border-white/10 focus:border-white/30 text-slate-200 text-sm text-center placeholder:text-slate-600 py-3 outline-none transition-colors"
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full bg-transparent border-b border-white/10 focus:border-white/30 text-slate-200 text-sm text-center placeholder:text-slate-600 py-3 outline-none transition-colors"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-red-400/90">
            <TriangleAlert className="w-3.5 h-3.5" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full mt-6 py-3 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-white/20 text-slate-300 text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Akses Command Center"}
        </button>

        <p className="text-center text-[10px] text-slate-700 mt-10 tracking-wide">
          TANIPRO INTERNAL · AKTIVITAS TERCATAT
        </p>
      </div>
    </main>
  );
}
