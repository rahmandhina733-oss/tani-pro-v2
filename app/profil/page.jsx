"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /profil — Profil Pengguna
 *
 * Form edit info dasar + seksi Tani Point (gamifikasi) & lencana keanggotaan.
 *
 * CATATAN: field form ("PIC", "Nomor Telepon") memakai state lokal mock
 * sesuai brief — belum wired ke PATCH /api/users/[id] (skema Prisma
 * PembeliProfile hanya punya namaPerusahaan/alamatKantor, tanpa field PIC
 * eksplisit). Bagian Tani Point BUKAN mock murni: memakai getLevelTaniPoint()
 * & TANI_POINT_RULES.LEVEL — engine SSOT yang sudah ada di lib/tani-point.js
 * & lib/constants.js — supaya level/progress konsisten dengan halaman lain.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import {
  BadgeCheck,
  Building2,
  Check,
  Loader2,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import DashboardLayout from "@/components/shared/DashboardLayout";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getLevelTaniPoint } from "@/lib/tani-point";
import { formatAngka } from "@/lib/format";

// Mock total poin — di produksi, ambil dari TaniPoint.totalPoin (Prisma) via userId.
const MOCK_TOTAL_POIN = 4250;

const MEMBERSHIP_BY_ROLE = {
  pembeli: { label: "Premium B2B Buyer", tone: "amber" },
  petani: { label: "Petani Terverifikasi", tone: "emerald" },
  admin: { label: "Internal Staff", tone: "purple" },
};

export default function ProfilPage() {
  const { user, role } = useCurrentUser();

  const [form, setForm] = useState({
    namaPerusahaan: user.nama ?? "",
    pic: "",
    telepon: "",
    alamat: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    // Mock latency — ganti dengan PATCH /api/users/[id] saat backend siap.
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  };

  const { levelSaat, levelBerikut, progressPersen, sisaUntukNaik } =
    getLevelTaniPoint(MOCK_TOTAL_POIN);
  const membership = MEMBERSHIP_BY_ROLE[role] ?? MEMBERSHIP_BY_ROLE.pembeli;

  return (
    <DashboardLayout role={role} user={user}>
      <div className="max-w-2xl space-y-6">
        {/* Header identitas */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-2xl font-bold text-emerald-400 flex-shrink-0">
            {user.nama?.[0] ?? "U"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-50 truncate">{user.nama}</h1>
              <Badge tone={membership.tone} size="sm">
                <BadgeCheck className="w-3 h-3" />
                {membership.label}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Seksi Tani Point (Gamifikasi) — pakai engine SSOT */}
        <Card variant="emerald" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{levelSaat.badge}</span>
              <div>
                <p className="text-sm font-semibold text-slate-100">Level {levelSaat.nama}</p>
                <p className="text-xs text-slate-500">Tani Point Anda</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">
              {formatAngka(MOCK_TOTAL_POIN)}
            </p>
          </div>

          {levelBerikut ? (
            <>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPersen}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                <span className="text-emerald-400 font-medium">{formatAngka(sisaUntukNaik)} poin</span>{" "}
                lagi untuk naik ke level{" "}
                <span className="text-slate-300 font-medium">
                  {levelBerikut.badge} {levelBerikut.nama}
                </span>
              </p>
            </>
          ) : (
            <p className="text-xs text-amber-400 font-medium">
              🏆 Anda telah mencapai level tertinggi — Maestro TaniPro!
            </p>
          )}
        </Card>

        {/* Form edit informasi dasar */}
        <Card padding="lg">
          <CardTitle className="mb-4">
            <User className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
            Informasi Dasar
          </CardTitle>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Nama Perusahaan
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <Input
                  value={form.namaPerusahaan}
                  onChange={updateField("namaPerusahaan")}
                  className="pl-9"
                  placeholder="PT / CV / Koperasi..."
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                PIC (Person in Charge)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <Input
                  value={form.pic}
                  onChange={updateField("pic")}
                  className="pl-9"
                  placeholder="Nama penanggung jawab"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <Input
                  value={form.telepon}
                  onChange={updateField("telepon")}
                  className="pl-9"
                  type="tel"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Alamat</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                <textarea
                  value={form.alamat}
                  onChange={updateField("alamat")}
                  rows={3}
                  placeholder="Alamat kantor / gudang lengkap"
                  className="w-full bg-white/5 border border-white/10 text-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Perubahan
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                Tersimpan
              </span>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
