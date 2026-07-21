"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /pembeli/pesanan/[id] — Live Tracking Pengiriman (Dasbor Pembeli)
 *
 * Konteks: truk Fuso membawa pesanan dari gudang petani (Malang) menuju
 * pabrik pembeli (Kawasan Industri MM2100, Bekasi). Peta live di kiri,
 * panel status logistik + ETA dinamis + info armada + progress bar di kanan.
 *
 * LiveTrackingMap di-import via next/dynamic { ssr:false } karena Leaflet
 * butuh `window`. ETA & progress bar disinkronkan dengan animasi truk lewat
 * callback onProgressChange dari komponen peta (satu sumber progres).
 * Mock data realistis; params.id ditampilkan sebagai nomor order.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  CircleCheck,
  Clock3,
  Gauge,
  Hash,
  MapPin,
  Package,
  Phone,
  Scale,
  Truck,
  User,
} from "lucide-react";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatAngka } from "@/lib/format";

/* Leaflet = client-only. Skeleton glass ditampilkan selama chunk peta dimuat. */
const LiveTrackingMap = dynamic(
  () => import("@/components/features/tracking/LiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
        <p className="text-xs text-slate-600 animate-pulse">Memuat peta live tracking…</p>
      </div>
    ),
  }
);

/* ============================================================
   MOCK DATA — Rute Malang → Bekasi (± jalur Pantura/Trans Jawa)
   ============================================================ */
const ROUTE = {
  origin: { lat: -7.9826, lng: 112.6308, label: "Gudang Koperasi Tani Subur — Malang" },
  destination: { lat: -6.3053, lng: 107.0722, label: "Pabrik PT Pangan Sejahtera — MM2100, Bekasi" },
  waypoints: [
    { lat: -7.8166, lng: 112.0113 }, // Kediri
    { lat: -7.6298, lng: 111.5232 }, // Madiun
    { lat: -7.5661, lng: 110.8286 }, // Solo
    { lat: -6.9932, lng: 110.4229 }, // Semarang
    { lat: -6.7320, lng: 108.5523 }, // Cirebon
  ],
  totalKm: 780,
  speedKmh: 60,
};

const SHIPMENT = {
  status: "IN_TRANSIT",
  produk: "Beras Premium Pandan Wangi",
  beratTon: 8.2,
  armada: {
    jenis: "Truk Fuso (Heavy Truck)",
    kapasitas: "10 Ton / 60 m³",
    plat: "N 9021 UC",
    sopir: "Pak Slamet Riyadi",
    telepon: "0812-3456-7890",
  },
  berangkat: "Hari ini, 04:30 WIB",
};

const MILESTONES = [
  { key: "loaded", label: "Barang Dimuat" },
  { key: "depart", label: "Berangkat" },
  { key: "transit", label: "Dalam Perjalanan" },
  { key: "arrive", label: "Tiba di Pabrik" },
];

/** 0.283 → "Sisa Waktu: 4 Jam 15 Menit" */
function formatEta(remainingHours) {
  if (remainingHours <= 0) return "Tiba di tujuan";
  const jam = Math.floor(remainingHours);
  const menit = Math.round((remainingHours - jam) * 60);
  if (jam === 0) return `${menit} Menit`;
  return `${jam} Jam ${String(menit).padStart(2, "0")} Menit`;
}

export default function PembeliTrackingPage({ params }) {
  const orderId = (params?.id ?? "8471").toUpperCase();

  /* Satu sumber progres: callback dari simulasi VMS di dalam peta. */
  const [progress, setProgress] = useState(0.35); // truk mock sudah 35% jalan

  const totalDurationH = ROUTE.totalKm / ROUTE.speedKmh;
  const remainingHours = totalDurationH * (1 - progress);
  const arrived = progress >= 1;

  const currentLocation = useMemo(() => null, []); // pakai initialProgress

  /* Milestone tercapai berdasarkan progres */
  const milestoneDone = (idx) => {
    if (idx <= 1) return true; // dimuat & berangkat sudah lewat
    if (idx === 2) return true; // sedang transit
    return arrived;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/pembeli"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Marketplace
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-50">
            Lacak Pesanan{" "}
            <span className="font-mono text-emerald-400">#TRP-{orderId}</span>
          </h1>
          <Badge tone={arrived ? "emerald" : "blue"} size="md">
            <Truck className="h-3 w-3" />
            {arrived ? "DELIVERED" : SHIPMENT.status}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">
          {SHIPMENT.produk} · {formatAngka(SHIPMENT.beratTon, 1)} Ton · Berangkat{" "}
          {SHIPMENT.berangkat}
        </p>
      </div>

      {/* Bento grid: peta besar kiri, panel logistik kanan */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Seksi utama: peta live ── */}
        <div className="h-[380px] lg:h-[540px] lg:col-span-2">
          <LiveTrackingMap
            origin={ROUTE.origin}
            destination={ROUTE.destination}
            waypoints={ROUTE.waypoints}
            currentLocation={currentLocation}
            initialProgress={0.35}
            speedKmh={ROUTE.speedKmh}
            simMinutesPerSecond={4}
            onProgressChange={(p) => setProgress(p)}
          />
        </div>

        {/* ── Panel Status Logistik ── */}
        <div className="space-y-4">
          {/* (b) ETA dinamis */}
          <Card variant="emerald" padding="lg">
            <div className="mb-1 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                Estimasi Tiba (ETA)
              </p>
            </div>
            <p className="text-3xl font-extrabold tabular-nums text-emerald-300">
              {arrived ? "Tiba 🎉" : formatEta(remainingHours)}
            </p>
            <p className="mt-1 text-[11px] text-teal-600">
              {arrived
                ? "Armada telah sampai di pabrik Anda. Mohon konfirmasi penerimaan."
                : `Sisa waktu tempuh · dihitung ulang tiap update posisi VMS`}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
              <span className="text-slate-500">Sisa jarak</span>
              <span className="font-semibold tabular-nums text-slate-200">
                ± {formatAngka(ROUTE.totalKm * (1 - progress))} km
              </span>
            </div>
          </Card>

          {/* (d) Progress bar pengambilan → pengantaran */}
          <Card padding="lg">
            <CardTitle className="mb-3 text-sm">
              <Gauge className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              Progres Pengiriman
            </CardTitle>
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Malang
              </span>
              <span className="font-semibold tabular-nums text-emerald-400">
                {Math.round(progress * 100)}%
              </span>
              <span className="flex items-center gap-1">
                Bekasi <MapPin className="h-3 w-3" />
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Milestone */}
            <div className="mt-4 space-y-2.5">
              {MILESTONES.map((m, i) => {
                const done = milestoneDone(i);
                const active = (i === 2 && !arrived) || (i === 3 && arrived);
                return (
                  <div key={m.key} className="flex items-center gap-2.5">
                    <CircleCheck
                      className={`h-4 w-4 flex-shrink-0 ${
                        done ? "text-emerald-400" : "text-slate-700"
                      }`}
                      strokeWidth={2}
                    />
                    <span
                      className={`text-xs ${
                        active
                          ? "font-semibold text-emerald-400"
                          : done
                            ? "text-slate-300"
                            : "text-slate-600"
                      }`}
                    >
                      {m.label}
                      {active && !arrived && " (sekarang)"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* (c) Informasi armada */}
          <Card padding="lg">
            <CardTitle className="mb-3 text-sm">
              <Truck className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              Informasi Armada
            </CardTitle>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Truck className="h-3.5 w-3.5" /> Kendaraan
                </span>
                <span className="font-medium text-slate-200">{SHIPMENT.armada.jenis}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Scale className="h-3.5 w-3.5" /> Kapasitas
                </span>
                <span className="font-medium text-slate-200">{SHIPMENT.armada.kapasitas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Hash className="h-3.5 w-3.5" /> Plat Nomor
                </span>
                <span className="font-mono font-semibold text-emerald-300">
                  {SHIPMENT.armada.plat}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <User className="h-3.5 w-3.5" /> Sopir
                </span>
                <span className="font-medium text-slate-200">{SHIPMENT.armada.sopir}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> Kontak
                </span>
                <a
                  href={`tel:${SHIPMENT.armada.telepon.replaceAll("-", "")}`}
                  className="font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  {SHIPMENT.armada.telepon}
                </a>
              </div>
            </div>
          </Card>

          {/* Muatan */}
          <Card variant="subtle" padding="sm" className="flex items-center gap-3 p-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
              <Package className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 text-xs">
              <p className="font-medium text-slate-200">{SHIPMENT.produk}</p>
              <p className="text-slate-500">
                {formatAngka(SHIPMENT.beratTon, 1)} Ton · Escrow aktif hingga barang
                dikonfirmasi
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
