"use client";

import Link from "next/link";
import {
  Package, Truck, Wallet, Leaf, ArrowRight, AlertTriangle,
  MapPin, Box, Users, ShieldCheck, CircleAlert,
} from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatRupiah, formatAngka, STATUS_ORDER_CONFIG } from "@/lib/utils";

const RINGKASAN = {
  totalOrderAktif: 284,
  armadaBeroperasi: 42,
  pendapatanPlatform: 1_284_500_000,
  co2eDisimpanTon: 18.6,
};

const PERINGATAN = [
  { id: "a1", tipe: "Sengketa", pesan: "Order #ORD-7841 masuk status sengketa — pembeli melaporkan kekurangan berat.", tingkat: "tinggi" },
  { id: "a2", tipe: "Armada", pesan: "Kendaraan B 9021 XYZ (FUSO) memasuki jadwal maintenance dalam 2 hari.", tingkat: "sedang" },
  { id: "a3", tipe: "Escrow", pesan: "3 dana escrow menunggu pelepasan otomatis > 24 jam.", tingkat: "sedang" },
];

const TINGKAT_WARNA = {
  tinggi: "text-red-400 bg-red-400/10 border-red-400/20",
  sedang: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const AKTIVITAS_TERBARU = [
  { id: "o1", label: "Order #ORD-7902 — PT Cipta Boga", status: "DIKIRIM", waktu: "5 menit lalu" },
  { id: "o2", label: "Order #ORD-7901 — CV Sumber Pangan", status: "DIPROSES", waktu: "18 menit lalu" },
  { id: "o3", label: "Order #ORD-7899 — Koperasi Sejahtera", status: "DITERIMA", waktu: "42 menit lalu" },
  { id: "o4", label: "Order #ORD-7895 — UD Makmur Jaya", status: "DIBAYAR", waktu: "1 jam lalu" },
];

const MODUL_CEPAT = [
  { href: "/admin/vms", label: "VMS & GPS", desc: "Pantau posisi armada real-time", icon: MapPin, warna: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { href: "/admin/load-optimizer", label: "Load Optimizer", desc: "Kalkulasi 3D bin packing", icon: Box, warna: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { href: "/admin/orders", label: "Semua Order", desc: "Kelola pesanan seluruh platform", icon: Package, warna: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { href: "/admin/escrow", label: "Escrow Manager", desc: "Kontrol dana tertahan", icon: ShieldCheck, warna: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

export default function AdminCommandCenterPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-heading">Command Center</h1>
        <p className="mt-1 text-sm text-slate-400">Ringkasan operasional platform TaniPro — real-time.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Order Aktif" value={formatAngka(RINGKASAN.totalOrderAktif)} icon={<Package />} accentColor="emerald" delta={6.4} />
        <StatCard label="Armada Beroperasi" value={RINGKASAN.armadaBeroperasi} suffix="unit" icon={<Truck />} accentColor="blue" delta={2.1} />
        <StatCard label="Pendapatan Platform" value={formatRupiah(RINGKASAN.pendapatanPlatform)} icon={<Wallet />} accentColor="amber" delta={11.3} />
        <StatCard label="CO2e Disimpan" value={RINGKASAN.co2eDisimpanTon} suffix="ton / bulan" icon={<Leaf />} accentColor="purple" delta={4.8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-50 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Peringatan Aktif
            </h2>
            <span className="status-pill border text-red-400 bg-red-400/10 border-red-400/20">{PERINGATAN.length} baru</span>
          </div>
          <div className="space-y-2.5">
            {PERINGATAN.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <CircleAlert className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.tingkat === "tinggi" ? "text-red-400" : "text-amber-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`status-pill border ${TINGKAT_WARNA[p.tingkat]}`}>{p.tipe}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1.5">{p.pesan}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Aktivitas Terbaru</h3>
            <div className="space-y-2">
              {AKTIVITAS_TERBARU.map((a) => {
                const cfg = STATUS_ORDER_CONFIG[a.status];
                return (
                  <div key={a.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 truncate">{a.label}</span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className={`status-pill border ${cfg.warna}`}>{cfg.label}</span>
                      <span className="text-xs text-slate-600 w-20 text-right">{a.waktu}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick modules */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-50 mb-1">Modul Cepat</h2>
          {MODUL_CEPAT.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="glass-card p-4 flex items-center gap-3.5 hover:bg-white/[0.05] transition-colors group">
                <div className={`p-2.5 rounded-xl border flex-shrink-0 ${m.warna}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{m.label}</p>
                  <p className="text-xs text-slate-500 truncate">{m.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </Link>
            );
          })}

          <Link href="/admin/users" className="glass-card p-4 flex items-center gap-3.5 hover:bg-white/[0.05] transition-colors group">
            <div className="p-2.5 rounded-xl border flex-shrink-0 text-slate-300 bg-white/5 border-white/10">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">Pengguna</p>
              <p className="text-xs text-slate-500 truncate">Kelola petani, pembeli & admin</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
