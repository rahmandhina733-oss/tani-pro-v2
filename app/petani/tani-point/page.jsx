"use client";

import { Star, TrendingUp, TrendingDown, Sprout, Leaf, Trophy } from "lucide-react";
import { formatAngka, formatTanggal, getLevelTaniPoint } from "@/lib/utils";
import { TANI_POINT_RULES } from "@/lib/constants";

const TOTAL_POIN = 1240;

const RIWAYAT_TRANSAKSI = [
  { id: "tx1", jumlah: 42, keterangan: "Penjualan 4.200 kg Beras Premium ke PT Agro Nusantara", createdAt: "2026-07-14" },
  { id: "tx2", jumlah: 50, keterangan: "Bonus sertifikasi organik — Beras Premium Pandan Wangi", createdAt: "2026-07-10" },
  { id: "tx3", jumlah: 35, keterangan: "Penjualan 3.500 kg Jagung Hibrida ke CV Sumber Pangan", createdAt: "2026-07-08" },
  { id: "tx4", jumlah: -200, keterangan: "Ditukar dengan sesi Konsultasi Premium AI", createdAt: "2026-07-02" },
  { id: "tx5", jumlah: 8, keterangan: "Penjualan 800 kg Kedelai Lokal ke UD Makmur Jaya", createdAt: "2026-06-28" },
];

export default function TaniPointPage() {
  const levelInfo = getLevelTaniPoint(TOTAL_POIN);
  const { levelSaat, levelBerikut, progressPersen, sisaUntukNaik } = levelInfo;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Tani Point</h1>
        <p className="mt-1 text-sm text-slate-400">
          Kumpulkan poin dari setiap penjualan dan tukarkan dengan konsultasi premium.
        </p>
      </div>

      {/* Level card */}
      <div className="glass-card-accent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)]">
              {levelSaat.badge}
            </div>
            <div>
              <p className="text-xs text-slate-500">Level Anda saat ini</p>
              <p className="text-xl font-bold text-slate-50">{levelSaat.nama}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Poin</p>
            <p className="text-3xl font-bold text-amber-300 tabular-nums">{formatAngka(TOTAL_POIN)}</p>
          </div>
        </div>

        {levelBerikut && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Menuju {levelBerikut.badge} {levelBerikut.nama}</span>
              <span>{formatAngka(sisaUntukNaik)} poin lagi</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPersen}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* How to earn */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit mb-3">
            <Sprout className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-100">1 Poin / 100 kg</p>
          <p className="text-xs text-slate-500 mt-1">Setiap penjualan produk yang berhasil terkirim.</p>
        </div>
        <div className="glass-card p-5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit mb-3">
            <Leaf className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-100">+{TANI_POINT_RULES.PETANI.bonusSertifikasiOrganik} Poin Bonus</p>
          <p className="text-xs text-slate-500 mt-1">Untuk produk bersertifikasi organik.</p>
        </div>
        <div className="glass-card p-5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit mb-3">
            <Trophy className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-100">Min. {formatAngka(TANI_POINT_RULES.PETANI.minPremiumKonsultasiPoint)} Poin</p>
          <p className="text-xs text-slate-500 mt-1">Untuk menukar sesi Konsultasi AI Premium.</p>
        </div>
      </div>

      {/* Transaction history */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/[0.06] flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          <h2 className="text-base font-semibold text-slate-50">Riwayat Transaksi Poin</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {RIWAYAT_TRANSAKSI.map((tx) => {
            const positif = tx.jumlah > 0;
            return (
              <div key={tx.id} className="px-5 py-3.5 flex items-center gap-4 table-row-hover">
                <div className={`p-2 rounded-lg flex-shrink-0 ${positif ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                  {positif ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{tx.keterangan}</p>
                  <p className="text-xs text-slate-600">{formatTanggal(tx.createdAt)}</p>
                </div>
                <p className={`text-sm font-semibold tabular-nums flex-shrink-0 ${positif ? "text-emerald-400" : "text-red-400"}`}>
                  {positif ? "+" : ""}{formatAngka(tx.jumlah)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
