"use client";

import { Leaf, TrendingUp, Truck } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";
import StatCard from "@/components/shared/StatCard";
import { formatAngka } from "@/lib/utils";
import { FLEET_SPECS } from "@/lib/constants";

const TREN_BULANAN = [
  { bulan: "Feb", co2eDisimpan: 9.4 },
  { bulan: "Mar", co2eDisimpan: 11.2 },
  { bulan: "Apr", co2eDisimpan: 12.8 },
  { bulan: "Mei", co2eDisimpan: 14.1 },
  { bulan: "Jun", co2eDisimpan: 16.9 },
  { bulan: "Jul", co2eDisimpan: 18.6 },
];

const PER_FLEET = [
  { tipe: "CDE", co2eDisimpan: 4.8 },
  { tipe: "CDD", co2eDisimpan: 7.3 },
  { tipe: "FUSO", co2eDisimpan: 6.5 },
];

const FLEET_WARNA = { CDE: "#34d399", CDD: "#60a5fa", FUSO: "#f59e0b" };

export default function AdminEsgPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Laporan ESG</h1>
        <p className="mt-1 text-sm text-slate-400">
          Ringkasan emisi CO2e platform berdasarkan GHG Protocol Scope 3 — Category 4.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="CO2e Disimpan Bulan Ini" value="18,6" suffix="ton" icon={<Leaf />} accentColor="emerald" delta={10.1} />
        <StatCard label="Total CO2e Disimpan (YTD)" value="83,0" suffix="ton" icon={<TrendingUp />} accentColor="blue" delta={22.4} />
        <StatCard label="Total Perjalanan Terukur" value={formatAngka(1284)} icon={<Truck />} accentColor="purple" delta={6.7} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="text-base font-semibold text-slate-50 mb-4">Tren CO2e Disimpan (ton / bulan)</h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={TREN_BULANAN} margin={{ left: -20, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="co2eGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="bulan" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="co2eDisimpan" stroke="#34d399" strokeWidth={2} fill="url(#co2eGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet breakdown */}
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-slate-50 mb-4">Kontribusi per Tipe Armada</h2>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={PER_FLEET} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="tipe" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="co2eDisimpan" radius={[6, 6, 0, 0]}>
                  {PER_FLEET.map((f) => (
                    <Cell key={f.tipe} fill={FLEET_WARNA[f.tipe]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {PER_FLEET.map((f) => (
              <div key={f.tipe} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: FLEET_WARNA[f.tipe] }} />
                  {FLEET_SPECS[f.tipe].nama}
                </div>
                <span className="text-slate-300 tabular-nums">{f.co2eDisimpan} ton</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5 text-xs text-slate-500">
        Metodologi: GHG Protocol Scope 3 — Category 4 (Upstream Transportation and Distribution). Baseline emisi dihitung dari rantai pasok konvensional non-platform.
      </div>
    </div>
  );
}
