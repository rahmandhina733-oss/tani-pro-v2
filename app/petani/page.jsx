"use client";

import Link from "next/link";
import {
  Package, Wallet, Star, TrendingUp, ArrowRight, Sprout,
  Truck, BrainCircuit, Plus,
} from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatRupiah, formatAngka, formatTanggalPendek } from "@/lib/format";
import { STATUS_ORDER_CONFIG } from "@/lib/status";

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — replace with server-fetched data (Prisma) once API routes exist
// ─────────────────────────────────────────────────────────────────────────────

const RINGKASAN = {
  totalStokKg: 8420,
  pesananMasuk: 12,
  pendapatanBulanIni: 48250000,
  ratingKebun: 4.8,
};

const PESANAN_TERBARU = [
  { id: "ord_001", pembeli: "PT Agro Nusantara",  produk: "Beras Premium Pandan Wangi", jumlahKg: 2000, total: 25000000, status: "DIBAYAR",  createdAt: "2026-07-14" },
  { id: "ord_002", pembeli: "CV Sumber Pangan",    produk: "Jagung Hibrida Pipilan",     jumlahKg: 3500, total: 16800000, status: "DIPROSES", createdAt: "2026-07-13" },
  { id: "ord_003", pembeli: "UD Makmur Jaya",      produk: "Kedelai Lokal Grade A",      jumlahKg: 800,  total: 7360000,  status: "DIKIRIM",  createdAt: "2026-07-12" },
  { id: "ord_004", pembeli: "PT Cipta Boga",       produk: "Beras Premium Pandan Wangi", jumlahKg: 1200, total: 15000000, status: "PENDING",  createdAt: "2026-07-11" },
];

// FIX TUGAS 4: fitur Pre-Order dihapus di seluruh aplikasi. Widget sidebar
// digantikan "Stok Menipis" — lebih relevan untuk aksi harian petani.
const STOK_MENIPIS = [
  { id: "sm_001", produk: "Kedelai Lokal Grade A", stokKg: 180, minPesanan: 300 },
  { id: "sm_002", produk: "Cabai Merah Keriting", stokKg: 45, minPesanan: 100 },
];

export default function PetaniDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="section-heading">Dashboard Petani</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ringkasan performa Kebun Makmur — hari ini, 15 Juli 2026.
          </p>
        </div>
        <Link href="/petani/toko" className="btn-emerald">
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Stok Aktif"
          value={formatAngka(RINGKASAN.totalStokKg)}
          suffix="kg"
          icon={<Sprout />}
          accentColor="emerald"
          delta={4.2}
        />
        <StatCard
          label="Pesanan Masuk"
          value={RINGKASAN.pesananMasuk}
          suffix="pesanan"
          icon={<Package />}
          accentColor="blue"
          delta={12.5}
        />
        <StatCard
          label="Pendapatan Bulan Ini"
          value={formatRupiah(RINGKASAN.pendapatanBulanIni)}
          icon={<Wallet />}
          accentColor="amber"
          delta={8.1}
        />
        <StatCard
          label="Rating Kebun"
          value={RINGKASAN.ratingKebun}
          suffix="/ 5.0"
          icon={<Star />}
          accentColor="purple"
          delta={0}
          deltaLabel="stabil"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pesanan terbaru */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-50">Pesanan Masuk Terbaru</h2>
            <Link href="/petani/pesanan" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-white/[0.06]">
                  <th className="pb-2.5 font-medium">Pembeli</th>
                  <th className="pb-2.5 font-medium">Produk</th>
                  <th className="pb-2.5 font-medium text-right">Total</th>
                  <th className="pb-2.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {PESANAN_TERBARU.map((p) => {
                  const cfg = STATUS_ORDER_CONFIG[p.status];
                  return (
                    <tr key={p.id} className="border-b border-white/[0.04] table-row-hover">
                      <td className="py-3 pr-2">
                        <p className="font-medium text-slate-200">{p.pembeli}</p>
                        <p className="text-xs text-slate-500">{formatTanggalPendek(p.createdAt)}</p>
                      </td>
                      <td className="py-3 pr-2 text-slate-300">
                        {p.produk}
                        <p className="text-xs text-slate-500">{formatAngka(p.jumlahKg)} kg</p>
                      </td>
                      <td className="py-3 text-right font-medium text-slate-200 tabular-nums">
                        {formatRupiah(p.total)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`status-pill border ${cfg.warna}`}>{cfg.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Stok menipis + quick actions */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-50">Stok Menipis</h2>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            {STOK_MENIPIS.length === 0 ? (
              <p className="text-xs text-slate-500">Semua stok produk Anda dalam kondisi baik.</p>
            ) : (
              <div className="space-y-3">
                {STOK_MENIPIS.map((s) => (
                  <div key={s.id} className="glass-card-accent p-3">
                    <p className="text-sm font-medium text-slate-200">{s.produk}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-amber-400">Sisa {formatAngka(s.stokKg)} kg</span>
                      <span className="text-xs text-slate-500">Min. pesan {formatAngka(s.minPesanan)} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/petani/toko" className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300">
              Kelola Stok di Toko <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card p-5 space-y-2.5">
            <h2 className="text-base font-semibold text-slate-50 mb-2">Aksi Cepat</h2>
            <Link href="/petani/kiriman" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Lacak Kiriman Aktif</span>
            </Link>
            <Link href="/petani/ai-konsultan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">Tanya AI Konsultan</span>
            </Link>
            <Link href="/petani/tani-point" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300">Riwayat Tani Point</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
