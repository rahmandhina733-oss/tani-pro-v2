"use client";

import { useState, useMemo } from "react";
import { Search, ClipboardList } from "lucide-react";
import { formatRupiah, formatAngka, formatTanggalPendek } from "@/lib/format";
import { STATUS_ORDER_CONFIG } from "@/lib/status";

const SEMUA_ORDER = [
  { id: "ORD-7902", pembeli: "PT Cipta Boga", petani: "Kebun Makmur (Pak Slamet)", produk: "Beras Premium Pandan Wangi", totalKg: 1200, total: 15000000, status: "DIKIRIM", createdAt: "2026-07-14", fleet: "CDD" },
  { id: "ORD-7901", pembeli: "CV Sumber Pangan", petani: "Gapoktan Makmur Sejati", produk: "Jagung Hibrida Pipilan", totalKg: 3500, total: 16800000, status: "DIPROSES", createdAt: "2026-07-13", fleet: "FUSO" },
  { id: "ORD-7899", pembeli: "Koperasi Sejahtera", petani: "UD. Sumber Rejeki", produk: "Kedelai Lokal Grade A", totalKg: 800, total: 7360000, status: "DITERIMA", createdAt: "2026-07-12", fleet: "CDE" },
  { id: "ORD-7895", pembeli: "UD Makmur Jaya", petani: "Kebun Makmur (Pak Slamet)", produk: "Beras Premium Pandan Wangi", totalKg: 2000, total: 25000000, status: "DIBAYAR", createdAt: "2026-07-11", fleet: "CDD" },
  { id: "ORD-7841", pembeli: "PT Agro Nusantara", petani: "Kebun Makmur (Pak Slamet)", produk: "Beras Premium Pandan Wangi", totalKg: 4200, total: 52500000, status: "SENGKETA", createdAt: "2026-07-09", fleet: "FUSO" },
  { id: "ORD-7790", pembeli: "PT Boga Sentosa", petani: "Gapoktan Makmur Sejati", produk: "Jagung Hibrida Pipilan", totalKg: 5000, total: 24000000, status: "DIBATALKAN", createdAt: "2026-07-05", fleet: "FUSO" },
];

export default function AdminOrdersPage() {
  const [cari, setCari] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const tampil = useMemo(() => {
    return SEMUA_ORDER.filter((o) => {
      const cocokCari =
        o.id.toLowerCase().includes(cari.toLowerCase()) ||
        o.pembeli.toLowerCase().includes(cari.toLowerCase()) ||
        o.petani.toLowerCase().includes(cari.toLowerCase());
      const cocokStatus = statusFilter === "Semua" || o.status === statusFilter;
      return cocokCari && cocokStatus;
    });
  }, [cari, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Semua Order</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola seluruh transaksi di platform TaniPro.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari ID order, pembeli, atau petani..."
            className="input-field pl-9"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-56">
          <option>Semua</option>
          {Object.keys(STATUS_ORDER_CONFIG).map((s) => (
            <option key={s} value={s}>{STATUS_ORDER_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-white/[0.06]">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Pembeli</th>
                <th className="px-5 py-3 font-medium">Petani</th>
                <th className="px-5 py-3 font-medium">Fleet</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((o) => {
                const cfg = STATUS_ORDER_CONFIG[o.status];
                return (
                  <tr key={o.id} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-slate-300">{o.id}</p>
                      <p className="text-xs text-slate-600">{formatTanggalPendek(o.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{o.pembeli}</td>
                    <td className="px-5 py-3.5 text-slate-400">{o.petani}</td>
                    <td className="px-5 py-3.5">
                      <span className="badge bg-white/5 text-slate-300 border border-white/10">{o.fleet}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="font-medium text-slate-200 tabular-nums">{formatRupiah(o.total)}</p>
                      <p className="text-xs text-slate-600">{formatAngka(o.totalKg)} kg</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`status-pill border ${cfg.warna}`}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tampil.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2 text-slate-500">
            <ClipboardList className="w-8 h-8" />
            <p className="text-sm">Tidak ada order yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
