"use client";

import DashboardLayout from "@/components/shared/DashboardLayout";

// TODO: replace with real session (NextAuth / server session) once auth is wired.
const MOCK_USER = {
  nama: "Rina Kartika",
  email: "rina.kartika@tanipro.id",
  role: "admin",
};

const MOCK_NOTIF_COUNT = 7;

export default function AdminRootLayout({ children }) {
  return (
    <DashboardLayout role="admin" user={MOCK_USER} notifCount={MOCK_NOTIF_COUNT}>
      {children}
    </DashboardLayout>
  );
}
