"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /pengaturan — Pengaturan Aplikasi
 *
 * Toggle fungsional (useState) untuk Notifikasi Email, Notifikasi SMS, dan
 * Autentikasi Dua Langkah (2FA). Dikelompokkan menjadi 2 seksi logis:
 * Notifikasi & Keamanan. Memakai <Switch/> — UI primitive baru di
 * components/ui/Switch.jsx.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { Bell, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import DashboardLayout from "@/components/shared/DashboardLayout";
import Card, { CardTitle } from "@/components/ui/Card";
import Switch from "@/components/ui/Switch";

function SettingRow({ icon: Icon, iconBox, title, desc, checked, onCheckedChange, children }) {
  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`p-2 rounded-lg border flex-shrink-0 ${iconBox}`}>
            <Icon className="w-4 h-4" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} className="mt-1 flex-shrink-0" />
      </div>
      {children}
    </div>
  );
}

export default function PengaturanPage() {
  const { user, role } = useCurrentUser();

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <DashboardLayout role={role} user={user}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Pengaturan Aplikasi</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Kelola preferensi notifikasi dan keamanan akun Anda.
          </p>
        </div>

        {/* Seksi: Notifikasi */}
        <Card padding="lg">
          <CardTitle className="mb-2">
            <Bell className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
            Notifikasi
          </CardTitle>

          <SettingRow
            icon={Mail}
            iconBox="bg-blue-500/10 text-blue-400 border-blue-500/20"
            title="Notifikasi Email"
            desc="Terima ringkasan transaksi, escrow, dan update pengiriman lewat email."
            checked={emailNotif}
            onCheckedChange={setEmailNotif}
          />
          <SettingRow
            icon={MessageSquare}
            iconBox="bg-purple-500/10 text-purple-400 border-purple-500/20"
            title="Notifikasi SMS"
            desc="Terima peringatan penting (mis. status escrow) via SMS ke nomor terdaftar."
            checked={smsNotif}
            onCheckedChange={setSmsNotif}
          />
        </Card>

        {/* Seksi: Keamanan */}
        <Card padding="lg">
          <CardTitle className="mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
            Keamanan
          </CardTitle>

          <SettingRow
            icon={ShieldCheck}
            iconBox="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            title="Autentikasi Dua Langkah (2FA)"
            desc="Tambahkan lapisan keamanan ekstra saat masuk ke akun Anda."
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          >
            {twoFactor && (
              <div className="mt-3 ml-11 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-xs text-emerald-400">
                  2FA aktif — kode verifikasi akan dikirim ke email terdaftar setiap kali masuk
                  dari perangkat baru.
                </p>
              </div>
            )}
          </SettingRow>
        </Card>
      </div>
    </DashboardLayout>
  );
}
