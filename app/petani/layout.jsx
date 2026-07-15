"use client";

import DashboardLayout from "@/components/shared/DashboardLayout";

// TODO: replace with real session (NextAuth / server session) once auth is wired.
const MOCK_USER = {
  nama: "Pak Slamet Wijaya",
  email: "slamet.wijaya@kebunmakmur.id",
  role: "petani",
};

const MOCK_TANI_POINT = 1240;
const MOCK_NOTIF_COUNT = 3;

export default function PetaniRootLayout({ children }) {
  return (
    <DashboardLayout
      role="petani"
      user={MOCK_USER}
      taniPoint={MOCK_TANI_POINT}
      notifCount={MOCK_NOTIF_COUNT}
    >
      {children}
    </DashboardLayout>
  );
}
