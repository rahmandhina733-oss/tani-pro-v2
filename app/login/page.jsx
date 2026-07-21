"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /login — Gerbang Otentikasi Terpusat TaniPro
 *
 * CATATAN ARSITEKTUR (hasil evaluasi UX/UI):
 * - SEMUA CTA publik (Masuk, Daftar Gratis, Mulai sebagai Pembeli,
 *   Daftarkan Toko) diarahkan murni ke halaman ini.
 * - Role PEMBELI / PETANI dipilih saat registrasi; saat login, redirect
 *   ditentukan otomatis dari role akun.
 * - Halaman ini TIDAK melayani admin. Akses admin hanya via URL rahasia
 *   manual: /admin/login (tidak ditautkan di antarmuka publik mana pun).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Leaf, Mail, Lock, User, Phone, Building2, Sprout,
  ArrowRight, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff,
} from "lucide-react";

const ROLE_OPTIONS = [
  {
    value: "PEMBELI",
    label: "Pembeli",
    desc:  "Perusahaan / industri yang membeli hasil tani",
    icon:  <Building2 className="w-5 h-5" />,
    active:"border-blue-400/50 bg-blue-500/10 text-blue-300",
  },
  {
    value: "PETANI",
    label: "Petani",
    desc:  "Petani / koperasi yang menjual hasil panen",
    icon:  <Sprout className="w-5 h-5" />,
    active:"border-emerald-400/50 bg-emerald-500/10 text-emerald-300",
  },
];

const DASHBOARD_BY_ROLE = {
  PEMBELI: "/pembeli",
  PETANI:  "/petani",
  ADMIN:   "/admin", // admin tetap bisa login di sini jika sudah punya kredensial
};

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode]         = useState("login"); // "login" | "register"
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    // umum
    nama: "", email: "", password: "", telepon: "",
    role: "PEMBELI",
    // profil pembeli
    namaPerusahaan: "", alamatKantor: "", industri: "",
    // profil petani
    namaKebun: "", alamat: "", provinsi: "", kabupaten: "",
  });

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload =
        mode === "login"
          ? { action: "login", email: form.email, password: form.password }
          : {
              action: "register",
              nama: form.nama,
              email: form.email,
              password: form.password,
              telepon: form.telepon || undefined,
              role: form.role,
              ...(form.role === "PEMBELI"
                ? {
                    namaPerusahaan: form.namaPerusahaan,
                    alamatKantor:   form.alamatKantor,
                    industri:       form.industri,
                  }
                : {
                    namaKebun: form.namaKebun,
                    alamat:    form.alamat,
                    provinsi:  form.provinsi,
                    kabupaten: form.kabupaten,
                  }),
            };

      const res  = await fetch("/api/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.pesan || "Terjadi kesalahan. Coba lagi.");
        return;
      }

      if (mode === "register") {
        setSuccess("Registrasi berhasil! Silakan masuk dengan akun Anda.");
        setMode("login");
        return;
      }

      // Login sukses. Otorisasi kini via cookie httpOnly "tanipro_session"
      // (di-set server & diverifikasi middleware.js). localStorage HANYA
      // menyimpan data tampilan minimal — bukan sumber kebenaran sesi.
      const user = json.data;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "tanipro_user",
          JSON.stringify({ id: user.id, nama: user.nama, email: user.email, role: user.role })
        );
      }
      router.push(DASHBOARD_BY_ROLE[user.role] ?? "/");
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  }

  const isRegister = mode === "register";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-glow-emerald-sm group-hover:shadow-glow-emerald transition-shadow duration-300">
            <Leaf className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl text-slate-50 tracking-tight">
            Tani<span className="text-emerald-400">Pro</span>
          </span>
        </Link>

        <div className="glass-card p-8 shadow-2xl shadow-black/40">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
            {[
              { key: "login",    label: "Masuk" },
              { key: "register", label: "Daftar Gratis" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setMode(t.key); setError(""); setSuccess(""); }}
                className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === t.key
                    ? "bg-emerald-500 text-slate-950 shadow-glow-emerald-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <h1 className="font-display text-2xl text-slate-50 mb-1">
            {isRegister ? "Buat Akun Baru" : "Selamat Datang Kembali"}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {isRegister
              ? "Bergabung dengan ekosistem agrilogistik B2B Indonesia."
              : "Masuk untuk mengakses dasbor Anda."}
          </p>

          {/* Alert */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 text-sm mb-4">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* ── Role selector (register only) ── */}
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      form.role === r.value
                        ? r.active
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {r.icon}
                      <span className="text-sm font-semibold">{r.label}</span>
                    </div>
                    <p className="text-[11px] leading-snug opacity-70">{r.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* ── Common fields ── */}
            {isRegister && (
              <Field icon={<User className="w-4 h-4" />}>
                <input className="input-field pl-10" placeholder="Nama lengkap"
                  value={form.nama} onChange={set("nama")} />
              </Field>
            )}

            <Field icon={<Mail className="w-4 h-4" />}>
              <input className="input-field pl-10" type="email" placeholder="Email"
                value={form.email} onChange={set("email")} />
            </Field>

            <Field icon={<Lock className="w-4 h-4" />}>
              <input
                className="input-field pl-10 pr-10"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={set("password")}
                onKeyDown={(e) => e.key === "Enter" && !isRegister && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>

            {isRegister && (
              <Field icon={<Phone className="w-4 h-4" />}>
                <input className="input-field pl-10" placeholder="No. telepon (opsional)"
                  value={form.telepon} onChange={set("telepon")} />
              </Field>
            )}

            {/* ── Conditional profile fields ── */}
            {isRegister && form.role === "PEMBELI" && (
              <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
                  Profil Perusahaan
                </p>
                <input className="input-field" placeholder="Nama perusahaan"
                  value={form.namaPerusahaan} onChange={set("namaPerusahaan")} />
                <input className="input-field" placeholder="Alamat kantor"
                  value={form.alamatKantor} onChange={set("alamatKantor")} />
                <input className="input-field" placeholder="Industri (mis. F&B, Ritel, Hotel)"
                  value={form.industri} onChange={set("industri")} />
              </div>
            )}

            {isRegister && form.role === "PETANI" && (
              <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  Profil Kebun / Toko
                </p>
                <input className="input-field" placeholder="Nama kebun / toko"
                  value={form.namaKebun} onChange={set("namaKebun")} />
                <input className="input-field" placeholder="Alamat lengkap"
                  value={form.alamat} onChange={set("alamat")} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Provinsi"
                    value={form.provinsi} onChange={set("provinsi")} />
                  <input className="input-field" placeholder="Kabupaten"
                    value={form.kabupaten} onChange={set("kabupaten")} />
                </div>
              </div>
            )}

            {/* ── Submit ── */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-emerald w-full py-3 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isRegister ? "Buat Akun" : "Masuk ke Dasbor"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Dengan {isRegister ? "mendaftar" : "masuk"}, Anda menyetujui{" "}
          <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
            Syarat &amp; Ketentuan
          </a>{" "}
          TaniPro.
        </p>
      </div>
    </main>
  );
}

/* Input wrapper dengan ikon kiri */
function Field({ icon, children }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
  );
}
