"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /admin/dashboard — Pusat Komando Tunggal (Single-Page Command Center)
 *
 * Brief: satu halaman, tata letak bento/grid glassmorphism, tiga seksi:
 *   a. Widget Statistik Cepat (Total Transaksi, Pengguna Aktif, Total Escrow)
 *   b. Panel Notifikasi Sistem (real-time-style, bisa di-dismiss)
 *   c. Tabel Manajemen Transaksi/Escrow (PENDING / ESCROW_HELD / COMPLETED)
 *
 * CATATAN: seluruh data di bawah adalah MOCK (sesuai brief) agar UI bisa
 * langsung diuji coba. Status transaksi (PENDING/ESCROW_HELD/COMPLETED)
 * sengaja memakai enum baru yang beda dari STATUS_ESCROW_CONFIG lama di
 * lib/status.js (MENUNGGU/TERKUNCI/DILEPAS) — begitu API admin sungguhan
 * dibuat, samakan dulu enum-nya dengan skema Prisma sebelum wiring.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Radar,
  Receipt,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { formatAngka, formatRupiah, formatTanggalPendek } from "@/lib/format";

/* ============================================================
   MOCK DATA
   ============================================================ */
const MOCK_STATS = {
  totalTransaksi: { value: 1842, delta: 12.4 },
  penggunaAktif: { value: 396, delta: 6.1 },
  totalEscrow: { value: 2_650_000_000, delta: -3.2 },
};

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    level: "critical",
    title: "Anomali server terdeteksi",
    detail: "Latensi API /api/orders naik 4x di region ap-southeast — investigasi otomatis berjalan.",
    time: "2 menit lalu",
  },
  {
    id: "n2",
    level: "warning",
    title: "Lonjakan traffic 340%",
    detail: "Trafik katalog melonjak sejak 09:40 WIB, kemungkinan imbas promo musim panen.",
    time: "14 menit lalu",
  },
  {
    id: "n3",
    level: "info",
    title: "Pendaftaran petani baru",
    detail: "Koperasi Tani Makmur Lestari (Kediri) menyelesaikan verifikasi KYC.",
    time: "31 menit lalu",
  },
  {
    id: "n4",
    level: "warning",
    title: "3 dana escrow tertahan > 48 jam",
    detail: "Menunggu konfirmasi penerimaan barang dari pembeli sebelum bisa dilepas otomatis.",
    time: "1 jam lalu",
  },
  {
    id: "n5",
    level: "info",
    title: "Rilis rute VMS baru",
    detail: "Optimasi rute Surabaya–Malang aktif, estimasi hemat 8% jarak tempuh.",
    time: "3 jam lalu",
  },
];

const MOCK_TRANSACTIONS = [
  { id: "TRP-8471", pihak: "PT Cipta Boga Nusantara", produk: "Beras Premium · 4.2 Ton", nilai: 52_400_000, status: "ESCROW_HELD", tanggal: "2026-07-20" },
  { id: "TRP-8470", pihak: "CV Sumber Pangan Abadi", produk: "Jagung Hibrida · 6 Ton", nilai: 28_800_000, status: "PENDING", tanggal: "2026-07-20" },
  { id: "TRP-8468", pihak: "Koperasi Sejahtera Tani", produk: "Kedelai Grade A · 1.8 Ton", nilai: 16_560_000, status: "COMPLETED", tanggal: "2026-07-19" },
  { id: "TRP-8465", pihak: "UD Makmur Jaya", produk: "Bawang Merah Brebes · 0.9 Ton", nilai: 16_650_000, status: "COMPLETED", tanggal: "2026-07-19" },
  { id: "TRP-8461", pihak: "PT Pangan Sejahtera", produk: "Cabai Rawit · 1.1 Ton", nilai: 38_500_000, status: "ESCROW_HELD", tanggal: "2026-07-18" },
  { id: "TRP-8459", pihak: "Gapoktan Rukun Tani", produk: "Singkong Gajah · 8 Ton", nilai: 22_400_000, status: "PENDING", tanggal: "2026-07-18" },
  { id: "TRP-8455", pihak: "CV Agro Mitra Sejati", produk: "Beras Organik · 2.5 Ton", nilai: 41_250_000, status: "COMPLETED", tanggal: "2026-07-17" },
];

/* ============================================================
   CONFIG TAMPILAN (lokal — khusus command center ini)
   ============================================================ */
const NOTIF_LEVEL = {
  critical: { icon: AlertTriangle, tone: "rose", ring: "border-rose-500/20 bg-rose-500/[0.04]", iconColor: "text-rose-400" },
  warning: { icon: Radar, tone: "amber", ring: "border-amber-500/20 bg-amber-500/[0.04]", iconColor: "text-amber-400" },
  info: { icon: Bell, tone: "blue", ring: "border-blue-500/20 bg-blue-500/[0.04]", iconColor: "text-blue-400" },
};

const TX_STATUS = {
  PENDING: { label: "Pending", tone: "amber", icon: Clock },
  ESCROW_HELD: { label: "Escrow Ditahan", tone: "blue", icon: ShieldCheck },
  COMPLETED: { label: "Selesai", tone: "emerald", icon: CheckCircle2 },
};

const STAT_WIDGETS = [
  {
    key: "totalTransaksi",
    label: "Total Transaksi",
    icon: Receipt,
    tone: "emerald",
    format: (v) => formatAngka(v),
  },
  {
    key: "penggunaAktif",
    label: "Pengguna Aktif",
    icon: Users,
    tone: "blue",
    format: (v) => formatAngka(v),
  },
  {
    key: "totalEscrow",
    label: "Total Dana Escrow",
    icon: Wallet,
    tone: "amber",
    format: (v) => formatRupiah(v),
  },
];

const TONE_CLASS = {
  emerald: { icon: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", value: "text-emerald-300" },
  blue: { icon: "bg-blue-500/10 text-blue-400 border-blue-500/20", value: "text-blue-300" },
  amber: { icon: "bg-amber-500/10 text-amber-400 border-amber-500/20", value: "text-amber-300" },
  rose: { icon: "bg-rose-500/10 text-rose-400 border-rose-500/20", value: "text-rose-300" },
};

const STATUS_FILTERS = ["Semua", "PENDING", "ESCROW_HELD", "COMPLETED"];

export default function AdminDashboardPage() {
  /* ---------- Notifikasi: dismissable via state lokal ---------- */
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dismissNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  /* ---------- Tabel transaksi: filter status + pencarian ---------- */
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [query, setQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchStatus = statusFilter === "Semua" || tx.status === statusFilter;
      const matchQuery =
        query.trim() === "" ||
        tx.id.toLowerCase().includes(query.toLowerCase()) ||
        tx.pihak.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [statusFilter, query]);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 tracking-wide">SISTEM AKTIF</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Pusat Komando</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Satu layar untuk seluruh sinyal operasional TaniPro, real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity className="w-3.5 h-3.5 text-slate-600" />
          Diperbarui otomatis setiap 30 detik
        </div>
      </div>

      {/* ============================================================
          (a) WIDGET STATISTIK CEPAT
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_WIDGETS.map((w) => {
          const stat = MOCK_STATS[w.key];
          const c = TONE_CLASS[w.tone];
          const Icon = w.icon;
          const up = stat.delta >= 0;
          return (
            <Card key={w.key} variant="default" padding="lg" hoverable>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${c.icon}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                    up ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 ${!up && "rotate-180"}`} />
                  {up ? "+" : ""}
                  {stat.delta}%
                </div>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${c.value}`}>{w.format(stat.value)}</p>
              <p className="text-sm text-slate-400 mt-0.5">{w.label}</p>
              <p className="text-xs text-slate-600 mt-2">vs periode lalu</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ============================================================
            (b) PANEL NOTIFIKASI SISTEM
            ============================================================ */}
        <Card padding="lg" className="lg:col-span-1 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
              Notifikasi Sistem
            </h2>
            <Badge tone="slate" size="xs">
              {notifications.length} aktif
            </Badge>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-600">Semua notifikasi sudah ditinjau.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {notifications.map((n) => {
                const cfg = NOTIF_LEVEL[n.level];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`relative rounded-xl border p-3 pr-8 ${cfg.ring}`}
                  >
                    <button
                      onClick={() => dismissNotification(n.id)}
                      aria-label="Tutup notifikasi"
                      className="absolute top-2.5 right-2.5 text-slate-600 hover:text-slate-300 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-start gap-2.5">
                      <Icon
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.iconColor}`}
                        strokeWidth={1.8}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.detail}</p>
                        <p className="text-[11px] text-slate-600 mt-1.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ============================================================
            (c) TABEL MANAJEMEN TRANSAKSI / ESCROW
            ============================================================ */}
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
              Manajemen Transaksi &amp; Escrow
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari ID / pihak..."
                  fieldSize="sm"
                  className="pl-8 w-48"
                />
              </div>
            </div>
          </div>

          {/* Tab filter status */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10"
                }`}
              >
                {s === "Semua" ? s : TX_STATUS[s].label}
              </button>
            ))}
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-white/10">
                  <th className="font-medium px-2 py-2">ID</th>
                  <th className="font-medium px-2 py-2">Pihak</th>
                  <th className="font-medium px-2 py-2">Nilai</th>
                  <th className="font-medium px-2 py-2">Status</th>
                  <th className="font-medium px-2 py-2">Tanggal</th>
                  <th className="font-medium px-2 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-xs text-slate-600 py-8">
                      Tidak ada transaksi yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const cfg = TX_STATUS[tx.status];
                    const Icon = cfg.icon;
                    return (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-2 py-3 font-mono text-xs text-slate-400">{tx.id}</td>
                        <td className="px-2 py-3">
                          <p className="text-slate-200 font-medium">{tx.pihak}</p>
                          <p className="text-xs text-slate-600">{tx.produk}</p>
                        </td>
                        <td className="px-2 py-3 text-slate-200 font-medium tabular-nums">
                          {formatRupiah(tx.nilai)}
                        </td>
                        <td className="px-2 py-3">
                          <Badge tone={cfg.tone} size="sm">
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="px-2 py-3 text-xs text-slate-500">
                          {formatTanggalPendek(tx.tanggal)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          <button className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition">
                            Detail
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
