"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /notifikasi — Pusat Notifikasi
 *
 * Halaman akun generik (di luar /admin, /petani, /pembeli) — dapat diakses
 * lintas role. Role aktif (untuk Sidebar/Navbar) dibaca via useCurrentUser().
 *
 * CATATAN: data di bawah MOCK sesuai brief. Bentuknya dibuat selaras dengan
 * model Prisma `Notifikasi` yang sudah ada (field tipe: ORDER, SHIPMENT,
 * PAYMENT, SYSTEM, POINT) — tab "Transaksi" mengelompokkan ORDER/SHIPMENT/
 * PAYMENT/POINT, tab "Sistem" khusus SYSTEM. Begitu API sungguhan dipakai,
 * cukup ganti MOCK_NOTIFICATIONS dengan hasil fetch /api/notifikasi.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  CircleDot,
  Megaphone,
  Package,
  ShieldAlert,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import DashboardLayout from "@/components/shared/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const MOCK_NOTIFICATIONS = [
  { id: "nt1", tipe: "SHIPMENT", judul: "Truk Fuso tiba di lokasi", pesan: "Armada B 9021 XYZ telah tiba di gudang tujuan untuk Order #ORD-7902. Mohon konfirmasi penerimaan barang.", waktu: "5 menit lalu", dibaca: false },
  { id: "nt2", tipe: "PAYMENT", judul: "Pembayaran Escrow dilepaskan", pesan: "Dana escrow senilai Rp 25.000.000 untuk Order #ORD-7899 telah dilepas ke rekening Koperasi Sejahtera Tani.", waktu: "18 menit lalu", dibaca: false },
  { id: "nt3", tipe: "SYSTEM", judul: "Pemeliharaan sistem terjadwal", pesan: "TaniPro akan menjalani pemeliharaan pada Minggu, 26 Jul 2026 pukul 02:00–04:00 WIB. Layanan mungkin terputus sesaat.", waktu: "1 jam lalu", dibaca: false },
  { id: "nt4", tipe: "ORDER", judul: "Order baru diterima", pesan: "PT Cipta Boga Nusantara memesan Beras Premium Pandan Wangi 2 Ton senilai Rp 25.000.000.", waktu: "2 jam lalu", dibaca: true },
  { id: "nt5", tipe: "POINT", judul: "Tani Point bertambah", pesan: "Anda memperoleh 250 Tani Point dari transaksi Order #ORD-7895. Total poin sekarang 4.250.", waktu: "3 jam lalu", dibaca: true },
  { id: "nt6", tipe: "SYSTEM", judul: "Fitur AI Konsultan diperbarui", pesan: "Modul AI Konsultan kini dapat menganalisis foto hama & penyakit tanaman secara langsung.", waktu: "6 jam lalu", dibaca: true },
  { id: "nt7", tipe: "SHIPMENT", judul: "Rute pengiriman dioptimasi VMS", pesan: "Rute Surabaya–Malang untuk Order #ORD-7888 dioptimasi, estimasi hemat 8% jarak tempuh & CO₂e.", waktu: "Kemarin", dibaca: true },
  { id: "nt8", tipe: "PAYMENT", judul: "Faktur baru tersedia", pesan: "Faktur #INV-2026-0741 untuk Order #ORD-7871 sudah bisa diunduh di halaman Escrow.", waktu: "Kemarin", dibaca: true },
  { id: "nt9", tipe: "SYSTEM", judul: "Kebijakan privasi diperbarui", pesan: "Kami memperbarui Syarat & Ketentuan terkait pengolahan data ESG. Silakan tinjau perubahannya.", waktu: "2 hari lalu", dibaca: true },
];

const TIPE_CONFIG = {
  ORDER: { icon: Package, tone: "emerald", label: "Pesanan", iconBox: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  SHIPMENT: { icon: Truck, tone: "blue", label: "Pengiriman", iconBox: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  PAYMENT: { icon: Wallet, tone: "amber", label: "Pembayaran", iconBox: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  POINT: { icon: Star, tone: "purple", label: "Tani Point", iconBox: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  SYSTEM: { icon: Megaphone, tone: "slate", label: "Sistem", iconBox: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
};

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "transaksi", label: "Transaksi" },
  { key: "sistem", label: "Sistem" },
];

/** Kelompokkan tipe notifikasi Prisma ke tab UI yang lebih sederhana. */
function tabOf(tipe) {
  return tipe === "SYSTEM" ? "sistem" : "transaksi";
}

export default function NotifikasiPage() {
  const { user, role } = useCurrentUser();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("semua");

  const unreadCount = notifications.filter((n) => !n.dibaca).length;

  const visible = useMemo(() => {
    if (activeTab === "semua") return notifications;
    return notifications.filter((n) => tabOf(n.tipe) === activeTab);
  }, [notifications, activeTab]);

  const markAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)));

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, dibaca: true })));

  return (
    <DashboardLayout role={role} user={user} notifCount={unreadCount}>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-emerald-400" strokeWidth={1.8} />
              Pusat Notifikasi
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} notifikasi belum dibaca`
                : "Semua notifikasi sudah dibaca"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition whitespace-nowrap"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar notifikasi */}
        {visible.length === 0 ? (
          <Card padding="lg" className="text-center py-14">
            <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Tidak ada notifikasi di kategori ini.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {visible.map((n) => {
              const cfg = TIPE_CONFIG[n.tipe];
              const Icon = cfg.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-colors ${
                    n.dibaca
                      ? "border-white/5 bg-white/[0.015] hover:bg-white/[0.03]"
                      : "border-emerald-500/15 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]"
                  }`}
                >
                  <div className={`p-2 rounded-lg border flex-shrink-0 mt-0.5 ${cfg.iconBox}`}>
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${n.dibaca ? "text-slate-300" : "text-slate-50"}`}>
                        {n.judul}
                      </p>
                      {!n.dibaca && <CircleDot className="w-2 h-2 text-emerald-400 fill-emerald-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.pesan}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge tone={cfg.tone} size="xs">
                        {cfg.label}
                      </Badge>
                      <span className="text-[11px] text-slate-600">{n.waktu}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
