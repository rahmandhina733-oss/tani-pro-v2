"use client";

import { useEffect, useState } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useCurrentUser — baca cache tampilan pengguna (FASE 3: halaman akun generik)
 *
 * Halaman seperti /profil, /pengaturan, /notifikasi berada DI LUAR folder
 * /admin, /petani, /pembeli sehingga tidak otomatis mendapat DashboardLayout
 * dari layout.jsx milik masing-masing role. Hook ini membaca "tanipro_user"
 * di localStorage — cache tampilan minimal yang di-set saat login (BUKAN
 * sumber otorisasi; sesi asli tetap cookie httpOnly "tanipro_session" yang
 * diverifikasi middleware.js) — untuk menentukan role mana yang aktif agar
 * Sidebar/Navbar yang tepat bisa ditampilkan.
 *
 * Fallback ke akun contoh (role "pembeli") bila belum login, supaya halaman
 * tetap bisa diuji coba langsung sesuai konvensi mock data di proyek ini.
 *
 * @returns {{ user: {id,nama,email,role}, role: string, hydrated: boolean }}
 */
const FALLBACK_USER = {
  id: "usr_demo",
  nama: "PT Pangan Sejahtera",
  email: "procurement@pangansejahtera.co.id",
  role: "pembeli",
};

export default function useCurrentUser() {
  const [user, setUser] = useState(FALLBACK_USER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("tanipro_user");
      if (cached) setUser(JSON.parse(cached));
    } catch {
      // localStorage tidak tersedia / data korup — pakai fallback.
    }
    setHydrated(true);
  }, []);

  return { user, role: user.role, hydrated };
}
