"use client";

import { useState } from "react";
import { MapPin, Truck, Phone, Navigation, Radio } from "lucide-react";
import { formatAngka, formatTanggal } from "@/lib/format";
import { STATUS_VEHICLE_CONFIG } from "@/lib/status";
import { FLEET_SPECS } from "@/lib/constants";
import { getEsgFleet, findRefDistance, ORIGIN_LOCATION } from "@/lib/esg";
import EsgComparisonPanel from "@/components/shared/EsgComparisonPanel";

// Posisi dinormalisasi 0-100 (persen) untuk ditempatkan di atas peta abstrak
const ARMADA = [
  { id: "v1", plat: "B 1234 CDE", tipe: "CDE", status: "DALAM_PERJALANAN", supir: "Budi Santoso", telepon: "0812-3456-7890", x: 32, y: 44, tujuan: "Bekasi, Jawa Barat", eta: "45 menit", totalPerjalanan: 128, muatanKg: 2400 },
  { id: "v2", plat: "B 9021 FUS", tipe: "FUSO", status: "DALAM_PERJALANAN", supir: "Agus Purnomo", telepon: "0813-2233-4455", x: 68, y: 30, tujuan: "Surabaya, Jawa Timur", eta: "3 jam 20 menit", totalPerjalanan: 302, muatanKg: 8500 },
  { id: "v3", plat: "B 4521 CDD", tipe: "CDD", status: "TERSEDIA", supir: "Rahmat Hidayat", telepon: "0821-9988-7766", x: 50, y: 62, tujuan: "-", eta: "-", totalPerjalanan: 87 },
  { id: "v4", plat: "B 7788 CDE", tipe: "CDE", status: "MAINTENANCE", supir: "Dedi Kurniawan", telepon: "0856-1122-3344", x: 22, y: 70, tujuan: "-", eta: "-", totalPerjalanan: 214 },
  { id: "v5", plat: "B 3390 FUS", tipe: "FUSO", status: "TERSEDIA", supir: "Wawan Setiadi", telepon: "0877-5566-7788", x: 78, y: 55, tujuan: "-", eta: "-", totalPerjalanan: 176 },
  { id: "v6", plat: "B 6612 CDD", tipe: "CDD", status: "TIDAK_AKTIF", supir: "-", telepon: "-", x: 40, y: 20, tujuan: "-", eta: "-", totalPerjalanan: 401 },
];

const TIPE_WARNA = { CDE: "#34d399", CDD: "#60a5fa", FUSO: "#f59e0b" };

export default function VmsPage() {
  const [dipilih, setDipilih] = useState(ARMADA[0].id);
  const kendaraan = ARMADA.find((v) => v.id === dipilih) ?? ARMADA[0];
  const spec = FLEET_SPECS[kendaraan.tipe];
  const esgFleet = getEsgFleet(kendaraan.tipe);
  const jarakRute = kendaraan.tujuan !== "-" ? findRefDistance(kendaraan.tujuan) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">VMS &amp; GPS Tracking</h1>
          <p className="mt-1 text-sm text-slate-400">Pantau posisi dan status seluruh armada secara real-time.</p>
        </div>
        <div className="flex items-center gap-1.5 status-pill border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
          <Radio className="w-3 h-3 animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Abstract map */}
        <div className="lg:col-span-2 glass-card p-4 relative overflow-hidden" style={{ minHeight: 420 }}>
          <div className="absolute inset-0 bg-grid-slate bg-grid opacity-40" />
          <div className="absolute inset-4 rounded-xl border border-white/[0.06]" />

          {ARMADA.map((v) => {
            const aktif = v.id === dipilih;
            const warna = TIPE_WARNA[v.tipe];
            return (
              <button
                key={v.id}
                onClick={() => setDipilih(v.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${v.x}%`, top: `${v.y}%` }}
                title={v.plat}
              >
                {v.status === "DALAM_PERJALANAN" && (
                  <span
                    className="absolute inset-0 rounded-full animate-gps-ping"
                    style={{ backgroundColor: warna }}
                  />
                )}
                <span
                  className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-transform ${
                    aktif ? "scale-125 border-white" : "border-slate-950"
                  }`}
                  style={{ backgroundColor: warna }}
                >
                  <Truck className="w-3 h-3 text-slate-950" />
                </span>
                <span className={`absolute top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded-md bg-slate-950/90 border border-white/10 transition-opacity ${
                  aktif ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  {v.plat}
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[11px] text-slate-400 bg-slate-950/70 backdrop-blur px-3 py-2 rounded-lg border border-white/[0.06]">
            {Object.entries(TIPE_WARNA).map(([tipe, warna]) => (
              <div key={tipe} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: warna }} />
                {tipe}
              </div>
            ))}
          </div>
        </div>

        {/* Fleet list */}
        <div className="glass-card p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 420 }}>
          {ARMADA.map((v) => {
            const cfg = STATUS_VEHICLE_CONFIG[v.status];
            const aktif = v.id === dipilih;
            return (
              <button
                key={v.id}
                onClick={() => setDipilih(v.id)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  aktif ? "bg-emerald-500/[0.06] border border-emerald-500/20" : "hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-medium text-slate-200">{v.plat}</span>
                  <span className={`badge ${cfg.warna}`}>{cfg.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{v.tipe} · {v.supir}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Route dispatcher / detail panel */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-slate-50 mb-4 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          Detail &amp; Route Dispatcher — {kendaraan.plat}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-xs text-slate-500 mb-1">Tipe Armada</p>
            <p className="text-sm text-slate-200">{spec.nama}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Kapasitas</p>
            <p className="text-sm text-slate-200">{formatAngka(spec.kapasitasKg)} kg / {spec.kapasitasM3} m³</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Supir</p>
            <p className="text-sm text-slate-200">{kendaraan.supir}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Kontak</p>
            <p className="text-sm text-slate-200">{kendaraan.telepon}</p>
          </div>
        </div>

        {kendaraan.status === "DALAM_PERJALANAN" ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-200">
                    <span className="text-slate-500">{ORIGIN_LOCATION} → </span>
                    Menuju <span className="font-medium">{kendaraan.tujuan}</span>
                    {jarakRute && <span className="text-slate-500"> · ±{jarakRute} km</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    Total {formatAngka(kendaraan.totalPerjalanan)} perjalanan selesai
                    {kendaraan.muatanKg ? ` · muatan ${formatAngka(kendaraan.muatanKg)} kg` : ""}
                  </p>
                </div>
              </div>
              <span className="status-pill border text-blue-400 bg-blue-400/10 border-blue-400/20">ETA {kendaraan.eta}</span>
            </div>

            {/* Estimasi emisi rute aktif — Mesin Kalkulasi ESG */}
            {jarakRute && kendaraan.muatanKg && (
              <EsgComparisonPanel
                weightTon={kendaraan.muatanKg / 1000}
                distanceKm={jarakRute}
                fleetOverride={esgFleet}
              />
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-sm text-slate-500">
            Kendaraan ini tidak sedang dalam perjalanan. Pilih order untuk menugaskan rute baru.
          </div>
        )}
      </div>
    </div>
  );
}
