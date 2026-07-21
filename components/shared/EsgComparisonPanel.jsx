"use client";

import { useMemo } from "react";
import { Leaf } from "lucide-react";
import { calculateEsg, co2ToTrees, PICKUP_L300, ORIGIN_LOCATION } from "@/lib/esg";

/**
 * EsgComparisonPanel — panel perbandingan emisi Konvensional (L300) vs TaniPro.
 * Reusable di seluruh halaman (load optimizer, VMS, kiriman, laporan ESG, dll).
 *
 * Props:
 * - weightTon   {number}  total muatan (Ton)
 * - distanceKm  {number}  jarak tempuh D (km)
 * - fleetOverride {object|null} paksa armada tertentu dari TANIPRO_FLEETS (opsional)
 * - compact     {boolean} tampilan ringkas (untuk sidebar/kartu kecil)
 * - showOrigin  {boolean} tampilkan label origin terkunci
 */
export default function EsgComparisonPanel({
  weightTon,
  distanceKm,
  fleetOverride = null,
  compact = false,
  showOrigin = false,
}) {
  const esg = useMemo(
    () => calculateEsg(weightTon, distanceKm, fleetOverride),
    [weightTon, distanceKm, fleetOverride]
  );

  if (!esg.valid) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
        <p className="text-xs text-slate-500">
          Masukkan berat muatan &amp; jarak tempuh untuk melihat simulasi emisi CO₂e.
        </p>
      </div>
    );
  }

  const maxEmission = Math.max(esg.E_conv, esg.E_tp, 0.0001);
  const convW = (esg.E_conv / maxEmission) * 100;
  const tpW = (esg.E_tp / maxEmission) * 100;

  if (compact) {
    return (
      <div className="rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 backdrop-blur-md p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Leaf className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-xs font-semibold text-teal-400">Estimasi Emisi (ESG)</span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Konvensional ({PICKUP_L300.name})</span>
            <span className="text-rose-400 font-semibold tabular-nums">{esg.E_conv.toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TaniPro ({esg.fleet.name})</span>
            <span className="text-emerald-400 font-semibold tabular-nums">{esg.E_tp.toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-1 mt-1">
            <span className="text-teal-500 font-medium">CO₂e Dihemat</span>
            <span className="text-teal-300 font-bold tabular-nums">
              {esg.saved.toFixed(2)} kg (↓{esg.savedPercent.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white/[0.02] to-teal-500/5 backdrop-blur-xl p-5">
      <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Perbandingan Emisi CO₂e</h3>
          </div>
          {showOrigin && (
            <span className="text-[10px] text-slate-500">
              Origin: <span className="text-emerald-500 font-medium">{ORIGIN_LOCATION}</span> 🔒
            </span>
          )}
        </div>

        {/* Konvensional */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">
              {PICKUP_L300.icon} Konvensional — {PICKUP_L300.name}
              <span className="text-slate-600 ml-1.5">
                {esg.tripsConv}× trip · {esg.D.toFixed(0)} km · EF {PICKUP_L300.emissionFactor}
              </span>
            </span>
            <span className="text-xs font-bold text-rose-400 tabular-nums">{esg.E_conv.toFixed(2)} kg</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500"
              style={{ width: `${convW}%` }}
            />
          </div>
        </div>

        {/* TaniPro */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">
              {esg.fleet.icon} TaniPro — {esg.fleet.name}
              <span className="text-slate-600 ml-1.5">
                {esg.tripsTp}× trip · {esg.D_opt.toFixed(1)} km (VMS) · EF {esg.fleet.emissionFactor}
              </span>
            </span>
            <span className="text-xs font-bold text-emerald-400 tabular-nums">{esg.E_tp.toFixed(2)} kg</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${tpW}%` }}
            />
          </div>
        </div>

        {/* Penghematan */}
        <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">Total Penghematan Karbon</p>
          <p className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {esg.saved.toFixed(2)} <span className="text-sm font-semibold text-emerald-500/80">kg CO₂e</span>
          </p>
          <p className="text-[11px] text-teal-500 mt-0.5">
            ↓ {esg.savedPercent.toFixed(1)}% vs konvensional · setara {co2ToTrees(esg.saved)} pohon/tahun 🌱
          </p>
        </div>
      </div>
    </div>
  );
}
