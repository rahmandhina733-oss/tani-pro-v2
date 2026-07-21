"use client";

import { useState, useMemo } from "react";
import { Search, ShieldCheck, Lock, Unlock, RotateCcw } from "lucide-react";
import { formatRupiah, formatTanggalPendek } from "@/lib/format";
import { STATUS_ESCROW_CONFIG } from "@/lib/status";
import { ESCROW_CONFIG } from "@/lib/constants";

const ESCROW_AWAL = [
  { id: "esc_001", orderId: "ORD-7902", pihak: "PT Cipta Boga → Kebun Makmur", jumlah: 15000000, status: "TERKUNCI", va: "8807 1234 5678", bank: "BCA Virtual Account", createdAt: "2026-07-14" },
  { id: "esc_002", orderId: "ORD-7901", pihak: "CV Sumber Pangan → Gapoktan Makmur", jumlah: 16800000, status: "TERKUNCI", va: "8807 9988 1122", bank: "Mandiri VA", createdAt: "2026-07-13" },
  { id: "esc_003", orderId: "ORD-7899", pihak: "Koperasi Sejahtera → UD. Sumber Rejeki", jumlah: 7360000, status: "DILEPAS", va: "8807 4455 6677", bank: "BRI Virtual Account", createdAt: "2026-07-12" },
  { id: "esc_004", orderId: "ORD-7841", pihak: "PT Agro Nusantara → Kebun Makmur", jumlah: 52500000, status: "MENUNGGU", va: "8807 2233 4499", bank: "BNI VA", createdAt: "2026-07-09" },
  { id: "esc_005", orderId: "ORD-7790", pihak: "PT Boga Sentosa → Gapoktan Makmur Sejati", jumlah: 24000000, status: "DIKEMBALIKAN", va: "8807 7766 8899", bank: "BCA Virtual Account", createdAt: "2026-07-05" },
];

const AKSI_PER_STATUS = {
  MENUNGGU: { label: "Kunci Dana", next: "TERKUNCI", icon: Lock },
  TERKUNCI: { label: "Lepaskan Dana", next: "DILEPAS", icon: Unlock },
};

export default function EscrowManagerPage() {
  const [daftar, setDaftar] = useState(ESCROW_AWAL);
  const [cari, setCari] = useState("");

  const tampil = useMemo(
    () => daftar.filter((e) => e.orderId.toLowerCase().includes(cari.toLowerCase()) || e.pihak.toLowerCase().includes(cari.toLowerCase())),
    [daftar, cari]
  );

  const totalTerkunci = daftar.filter((e) => e.status === "TERKUNCI").reduce((sum, e) => sum + e.jumlah, 0);

  function ubahStatus(id, statusBaru) {
    setDaftar((prev) => prev.map((e) => (e.id === id ? { ...e, status: statusBaru } : e)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Escrow Manager</h1>
        <p className="mt-1 text-sm text-slate-400">
          Kontrol dana pembeli yang tertahan hingga barang diterima. Auto-release {ESCROW_CONFIG.holdDays} hari setelah terkirim, jendela sengketa {ESCROW_CONFIG.disputeWindowDays} hari.
        </p>
      </div>

      <div className="glass-card-accent p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Dana Terkunci Saat Ini</p>
            <p className="text-xl font-bold text-slate-50">{formatRupiah(totalTerkunci)}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari ID order atau pihak transaksi..."
          className="input-field pl-9 sm:max-w-md"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-white/[0.06]">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Pihak</th>
                <th className="px-5 py-3 font-medium">Virtual Account</th>
                <th className="px-5 py-3 font-medium text-right">Jumlah</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((e) => {
                const cfg = STATUS_ESCROW_CONFIG[e.status];
                const aksi = AKSI_PER_STATUS[e.status];
                const Icon = aksi?.icon;
                return (
                  <tr key={e.id} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-slate-300">{e.orderId}</p>
                      <p className="text-xs text-slate-600">{formatTanggalPendek(e.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{e.pihak}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-slate-400 font-mono">{e.va}</p>
                      <p className="text-xs text-slate-600">{e.bank}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-200 tabular-nums">{formatRupiah(e.jumlah)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`status-pill border ${cfg.warna}`}>{cfg.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {aksi ? (
                        <button
                          onClick={() => ubahStatus(e.id, aksi.next)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {aksi.label}
                        </button>
                      ) : e.status === "DILEPAS" || e.status === "DIKEMBALIKAN" ? (
                        <span className="text-xs text-slate-600">Selesai</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tampil.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2 text-slate-500">
            <RotateCcw className="w-8 h-8" />
            <p className="text-sm">Tidak ada data escrow yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
