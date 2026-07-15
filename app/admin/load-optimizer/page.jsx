"use client";

import { useState, useMemo } from "react";
import { Box, PackageCheck, AlertTriangle, Scale, Ruler } from "lucide-react";
import { formatAngka, hitungVolumeKardus, hitungGravimetrikCheck, hitungVolumetrikCheck } from "@/lib/utils";
import { FLEET_SPECS } from "@/lib/constants";

const MUATAN = [
  { id: "i1", nama: "Beras Premium (karung 25kg)", jumlah: 80, beratSatuanKg: 25, p: 60, l: 40, t: 20, warna: "#34d399" },
  { id: "i2", nama: "Jagung Pipilan (karung 50kg)", jumlah: 40, beratSatuanKg: 50, p: 70, l: 45, t: 25, warna: "#f59e0b" },
  { id: "i3", nama: "Kedelai Lokal (karung 25kg)",  jumlah: 30, beratSatuanKg: 25, p: 55, l: 35, t: 20, warna: "#60a5fa" },
];

// Posisi & ukuran mock untuk representasi visual 2D dari hasil 3D bin packing
const BLOK_VISUAL = [
  { warna: "#34d399", x: 2,  y: 8,  w: 30, h: 78 },
  { warna: "#34d399", x: 33, y: 8,  w: 30, h: 78 },
  { warna: "#f59e0b", x: 64, y: 8,  w: 34, h: 46 },
  { warna: "#60a5fa", x: 64, y: 56, w: 34, h: 30 },
];

export default function LoadOptimizerPage() {
  const [fleetTipe, setFleetTipe] = useState("FUSO");
  const spec = FLEET_SPECS[fleetTipe];

  const kalkulasi = useMemo(() => {
    let beratTotal = 0;
    let volumeTotal = 0;

    for (const item of MUATAN) {
      beratTotal += item.beratSatuanKg * item.jumlah;
      const volumeSatuan = hitungVolumeKardus({ panjangCm: item.p, lebarCm: item.l, tinggiCm: item.t });
      volumeTotal += volumeSatuan * item.jumlah;
    }

    const gravimetrik = hitungGravimetrikCheck({ beratKg: beratTotal, fleetTipe });
    const volumetrik = hitungVolumetrikCheck({ volumeM3: volumeTotal, fleetTipe });
    const efisiensi = ((gravimetrik.persenTerpakai + volumetrik.persenTerpakai) / 2).toFixed(1);

    return { beratTotal, volumeTotal, gravimetrik, volumetrik, efisiensi };
  }, [fleetTipe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="section-heading">Smart Load Optimizer</h1>
          <p className="mt-1 text-sm text-slate-400">
            Simulasi 3D bin packing — cek batas gravimetrik &amp; volumetrik sebelum muat.
          </p>
        </div>
        <select
          value={fleetTipe}
          onChange={(e) => setFleetTipe(e.target.value)}
          className="input-field sm:w-56"
        >
          {Object.keys(FLEET_SPECS).map((t) => (
            <option key={t} value={t}>{FLEET_SPECS[t].nama}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual bin packing */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-50 flex items-center gap-2">
              <Box className="w-4 h-4 text-purple-400" />
              Visualisasi Muatan — {spec.nama}
            </h2>
            <span className="status-pill border text-purple-400 bg-purple-400/10 border-purple-400/20">
              Efisiensi {kalkulasi.efisiensi}%
            </span>
          </div>

          {/* Truck bed representation */}
          <div className="relative rounded-2xl border-2 border-white/10 bg-white/[0.02]" style={{ paddingTop: "45%" }}>
            <div className="absolute inset-3">
              {BLOK_VISUAL.map((b, i) => (
                <div
                  key={i}
                  className="absolute rounded-md border border-white/20 flex items-center justify-center text-[10px] font-medium text-slate-950/80"
                  style={{
                    left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
                    backgroundColor: b.warna, opacity: 0.85,
                  }}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                </div>
              ))}
            </div>
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-600 font-mono">
              {spec.panjangBakM}m × {spec.lebarBakM}m × {spec.tinggiInternalM}m
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
            {MUATAN.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.warna }} />
                {m.nama} ({m.jumlah}x)
              </div>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-200">Cek Gravimetrik</h3>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{formatAngka(kalkulasi.beratTotal)} kg</span>
              <span>maks {formatAngka(spec.kapasitasKg)} kg</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${kalkulasi.gravimetrik.aman ? "bg-emerald-400" : "bg-red-400"}`}
                style={{ width: `${kalkulasi.gravimetrik.persenTerpakai}%` }}
              />
            </div>
            <p className={`text-xs mt-2 flex items-center gap-1.5 ${kalkulasi.gravimetrik.aman ? "text-emerald-400" : "text-red-400"}`}>
              {kalkulasi.gravimetrik.aman ? <PackageCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {kalkulasi.gravimetrik.aman ? "Dalam batas aman" : "Melebihi kapasitas berat"}
            </p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-200">Cek Volumetrik</h3>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{kalkulasi.volumeTotal.toFixed(1)} m³</span>
              <span>maks {spec.kapasitasM3} m³</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${kalkulasi.volumetrik.aman ? "bg-emerald-400" : "bg-red-400"}`}
                style={{ width: `${kalkulasi.volumetrik.persenTerpakai}%` }}
              />
            </div>
            <p className={`text-xs mt-2 flex items-center gap-1.5 ${kalkulasi.volumetrik.aman ? "text-emerald-400" : "text-red-400"}`}>
              {kalkulasi.volumetrik.aman ? <PackageCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {kalkulasi.volumetrik.aman ? "Dalam batas aman" : "Melebihi kapasitas volume"}
            </p>
          </div>

          {(!kalkulasi.gravimetrik.aman || !kalkulasi.volumetrik.aman) && (
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3.5 text-xs text-red-300">
              Muatan tidak muat pada armada ini. Pertimbangkan mengganti ke armada dengan kapasitas lebih besar atau membagi ke 2 kendaraan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
