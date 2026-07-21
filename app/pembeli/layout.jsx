"use client";

import DashboardLayout from "@/components/shared/DashboardLayout";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 (Pilar 1.1): 189 baris sidebar custom pembeli DIHAPUS.
// Layout pembeli kini memakai DashboardLayout bersama (Navbar + Sidebar) —
// identik dengan pola layout petani & admin. Item navigasi dibaca Sidebar
// dari NAV_PEMBELI di lib/constants.js (SSOT navigasi).
//
// TODO: ganti mock dengan sesi asli (payload JWT dari cookie tanipro_session)
// begitu endpoint /api/auth/me tersedia — sama seperti layout petani.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_USER = {
  nama: "PT Pangan Sejahtera",
  email: "procurement@pangansejahtera.co.id",
  role: "pembeli",
};

const MOCK_TANI_POINT = 860;
const MOCK_NOTIF_COUNT = 2;

export default function PembeliRootLayout({ children }) {
  return (
    <DashboardLayout
      role="pembeli"
      user={MOCK_USER}
      taniPoint={MOCK_TANI_POINT}
      notifCount={MOCK_NOTIF_COUNT}
    >
      {children}
    </DashboardLayout>
  );
}
