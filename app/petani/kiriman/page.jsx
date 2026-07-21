"use client";

import { useState } from "react";
import { Truck, MapPin, PackageCheck, CircleDot } from "lucide-react";
import { formatAngka, formatTanggal } from "@/lib/format";
import { getEsgFleet, findRefDistance, calculateEsg } from "@/lib/esg";
import EsgComparisonPanel from "@/components/shared/EsgComparisonPanel";

const TAHAPAN = ["MENUNGGU_PICKUP", "DALAM_PERJALANAN", "TIBA_DI_HUB", "SEDANG_DIKIRIM", "TERKIRIM"];

const TAHAPAN_LABEL = {
  MENUNGGU_PICKUP: "Menunggu Pickup",
  DALAM_PERJALANAN: "Dalam Perjalanan",
  TIBA_DI_HUB: "Tiba di Hub",
  SEDANG_DIKIRIM: "Sedang Dikirim",
  TERKIRIM: "Terkirim",
};

const KIRIMAN = [
  {
    id: "shp_001",
    resi: "TNP-2607-8841",
    pembeli: "PT Agro Nusantara",
    produk: "Beras Premium Pandan Wangi",
    jumlahKg: 2000,
    fleet: "CDD",
    status: "SEDANG_DIKIRIM",
    tujuan: "Bekasi, Jawa Barat",
    estimasi: "2026-07-16",
    supir: "Budi Santoso",
  },
  {
    id: "shp_002",
    resi: "TNP-2607-7723",
    pembeli: "CV Sumber Pangan",
    produk: "Jagung Hibrida Pipilan",
    jumlahKg: 3500,
    fleet: "FUSO",
    status: "DALAM_PERJALANAN",
    tujuan: "Surabaya, Jawa Timur",
    estimasi: "2026-07-17",
    supir: "Agus Purnomo",
  },
  {
    id: "shp_003",
    resi: "TNP-2607-6612",
    pembeli: "UD Makmur Jaya",
    produk: "Kedelai Lokal Grade A",
    jumlahKg: 800,
    fleet: "CDE",
    status: "TERKIRIM",
    tujuan: "Gresik, Jawa Timur",
    estimasi: "2026-07-13",
    supir: "Rahmat Hidayat",
  },
];

export default function KirimanPage() {
  const [dipilih, setDipilih] = useState(KIRIMAN[0]?.id ?? null);
  const detail = KIRIMAN.find((k) => k.id === dipilih) ?? KIRIMAN[0];
  const indexAktif = detail ? TAHAPAN.indexOf(detail.status) : 0;

  // Estimasi ESG kiriman terpilih (Mesin Kalkulasi terpusat)
  const jarakKiriman = detail ? findRefDistance(detail.tujuan) : null;
  const esgFleetKiriman = detail ? getEsgFleet(detail.fleet) : null;
  const esgKiriman = detail && jarakKiriman
    ? calculateEsg(detail.jumlahKg / 1000, jarakKiriman, esgFleetKiriman)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Lacak Kiriman</h1>
        <p className="mt-1 text-sm text-slate-400">Pantau posisi dan status pengiriman pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment list */}
        <div className="space-y-3">
          {KIRIMAN.map((k) => {
            const aktif = k.id === dipilih;
            return (
              <button
                key={k.id}
                onClick={() => setDipilih(k.id)}
                className={`w-full text-left glass-card p-4 transition-colors ${
                  aktif ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">{k.pembeli}</p>
                  <span className="status-pill border text-blue-400 bg-blue-400/10 border-blue-400/20">
                    {TAHAPAN_LABEL[k.status]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{k.produk} · {formatAngka(k.jumlahKg)} kg</p>
                <p className="text-xs text-slate-600 mt-0.5 font-mono">{k.resi}</p>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="lg:col-span-2 glass-card p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">No. Resi</p>
                <p className="font-mono text-sm text-slate-200">{detail.resi}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300">{detail.fleet}</span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center justify-between">
                {TAHAPAN.map((t, i) => {
                  const selesai = i <= indexAktif;
                  const isLast = i === TAHAPAN.length - 1;
                  return (
                    <div key={t} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          selesai
                            ? "bg-emerald-500 border-emerald-500 text-slate-950"
                            : "bg-transparent border-white/15 text-slate-600"
                        }`}>
                          {selesai ? <PackageCheck className="w-3.5 h-3.5" /> : <CircleDot className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-[10px] text-center max-w-[70px] ${selesai ? "text-slate-300" : "text-slate-600"}`}>
                          {TAHAPAN_LABEL[t]}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`h-0.5 flex-1 mx-1 -mt-5 ${i < indexAktif ? "bg-emerald-500" : "bg-white/10"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
              <div>
                <p className="text-xs text-slate-500 mb-1">Produk</p>
                <p className="text-sm text-slate-200">{detail.produk}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Jumlah</p>
                <p className="text-sm text-slate-200">{formatAngka(detail.jumlahKg)} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Tujuan</p>
                <p className="text-sm text-slate-200">{detail.tujuan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Estimasi Tiba</p>
                <p className="text-sm text-slate-200">{formatTanggal(detail.estimasi)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Supir</p>
                <p className="text-sm text-slate-200">{detail.supir}</p>
              </div>
            </div>

            {/* Jejak karbon kiriman ini */}
            {esgKiriman && esgKiriman.valid && (
              <div className="pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-slate-500 mb-3">
                  Jejak Karbon Kiriman Ini <span className="text-slate-600">· estimasi jarak ±{jarakKiriman} km</span>
                </p>
                <EsgComparisonPanel
                  weightTon={detail.jumlahKg / 1000}
                  distanceKm={jarakKiriman}
                  fleetOverride={esgFleetKiriman}
                  compact
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
