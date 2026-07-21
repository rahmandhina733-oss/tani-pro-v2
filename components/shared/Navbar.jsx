"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Leaf,
  Menu,
  X,
} from "lucide-react";

const ROLE_LABELS = {
  pembeli: { label: "Pembeli", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  petani:  { label: "Petani",  color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  admin:   { label: "Admin",   color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
};

// Derive active role from pathname
function useActiveRole(pathname) {
  if (pathname.startsWith("/pembeli")) return "pembeli";
  if (pathname.startsWith("/petani"))  return "petani";
  if (pathname.startsWith("/admin"))   return "admin";
  return null;
}

export default function Navbar({ user = null, notifCount = 0 }) {
  const pathname  = usePathname();
  const role      = useActiveRole(pathname);
  const roleInfo  = role ? ROLE_LABELS[role] : null;

  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = !role;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-shadow duration-300">
              <Leaf className="w-4.5 h-4.5 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl text-slate-50 tracking-tight">
              Tani<span className="text-emerald-400">Pro</span>
            </span>
          </Link>

          {/* ── Center: Public Nav (desktop) ──
              CATATAN ARSITEKTUR: Tautan dasbor role (Pembeli/Petani/Admin)
              sengaja DIHAPUS dari antarmuka publik. Akses dasbor hanya
              melalui otentikasi di /login. Akses Admin hanya via URL
              rahasia manual: /admin/login (tidak ditautkan di mana pun). */}
          {isLanding ? (
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/tentang-fitur",      label: "Fitur" },
                { href: "/tentang-fitur#esg",  label: "ESG" },
                { href: "/tentang-fitur#vms",  label: "Logistik VMS" },
                { href: "/tentang-fitur#ai",   label: "AI Konsultan" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all duration-150"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              {roleInfo && (
                <span className={`status-pill ${roleInfo.bg} ${roleInfo.color} border`}>
                  {roleInfo.label} Dashboard
                </span>
              )}
            </div>
          )}

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-2">

            {/* Notification Bell */}
            {role && (
              <Link
                href="/notifikasi"
                className="relative p-2 rounded-xl text-slate-400 hover:text-slate-50 hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                )}
              </Link>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-semibold text-emerald-400">
                    {user.nama?.[0] ?? "U"}
                  </div>
                  <span className="hidden sm:block text-sm text-slate-300 max-w-[100px] truncate">
                    {user.nama ?? "Pengguna"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-card py-1.5 shadow-xl shadow-black/40 z-50">
                    <div className="px-3 py-2 border-b border-white/[0.06]">
                      <p className="text-xs font-medium text-slate-50 truncate">{user.nama}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-slate-50 hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profil Saya
                    </Link>
                    <Link
                      href="/pengaturan"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-slate-50 hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </Link>
                    <hr className="border-white/[0.06] my-1" />
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-xs px-4 py-2">
                  Masuk
                </Link>
                {/* CATATAN: Sesuai evaluasi UX, semua CTA otentikasi
                    diarahkan murni ke /login (registrasi via tab di sana). */}
                <Link href="/login" className="btn-emerald text-xs px-4 py-2">
                  Daftar Gratis
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-50 hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-3 space-y-1 bg-slate-950/95">
          {[
            { href: "/tentang-fitur",      label: "Tentang Fitur" },
            { href: "/tentang-fitur#esg",  label: "ESG Reporting" },
            { href: "/tentang-fitur#vms",  label: "Logistik VMS" },
            { href: "/tentang-fitur#ai",   label: "AI Konsultan" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-slate-50 hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="btn-ghost flex-1 text-center text-xs py-2">Masuk</Link>
              <Link href="/login" className="btn-emerald flex-1 text-center text-xs py-2">Daftar</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
