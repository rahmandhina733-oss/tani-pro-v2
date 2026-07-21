"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /petani/pesanan/[id] — Live Tracking Penjemputan (Dasbor Petani)
 *
 * Konteks: truk dari pool armada TaniPro (Surabaya) sedang menuju lahan
 * petani (Malang) untuk MENGAMBIL barang. Memakai kembali komponen
 * <LiveTrackingMap/> yang sama dengan sisi pembeli (import dinamis ssr:false).
 *
 * Alur status (state lokal):
 *   TRUK_MENUJU_LAHAN  →  [tombol "Konfirmasi Barang Dimuat" + window.confirm]
 *                      →  BARANG_DALAM_PERJALANAN (IN_TRANSIT)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Hash,
  MapPin,
  PackageCheck,
  Phone,
  Scale,
  Truck,
  User,
} from "lucide-react";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatAngka } from "@/lib/format";

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
   MOCK DATA — Rute Pool Surabaya → Lahan Petani Malang
   ============================================================ */
const ROUTE = {
  origin: { lat: -7.2892, lng: 112.7345, label: "Pool Armada TaniPro — Surabaya" },
  destination: { lat: -7.9826, lng: 112.6308, label: "Lahan Anda — Koperasi Tani Subur, Malang" },
  waypoints: [
    { lat: -7.5470, lng: 112.6975 }, // Porong/Pandaan
    { lat: -7.8322, lng: 112.7031 }, // Lawang
  ],
  totalKm: 92,
  speedKmh: 50,
};

const PICKUP = {
  produk: "Beras Premium Pandan Wangi",
  jumlahTon: 8.2,
  order: "PT Pangan Sejahtera (Bekasi)",
  armada: {
    jenis: "Truk Fuso (Heavy Truck)",
    kapasitas: "10 Ton / 60 m³",
    plat: "N 9021 UC",
    sopir: "Pak Slamet Riyadi",
    telepon: "0812-3456-7890",
  },
};

const STATUS_CONFIG = {
  TRUK_MENUJU_LAHAN: {
    label: "TRUK_MENUJU_LAHAN",
    tone: "amber",
    desc: "Armada sedang dalam perjalanan menuju lahan Anda untuk mengambil barang.",
  },
  BARANG_DALAM_PERJALANAN: {
    label: "BARANG_DALAM_PERJALANAN",
    tone: "emerald",
    desc: "Barang telah dimuat dan sedang dalam perjalanan menuju pembeli (IN_TRANSIT).",
  },
};

function formatEta(remainingHours) {
  if (remainingHours <= 0) return "Truk telah tiba";
  const jam = Math.floor(remainingHours);
  const menit = Math.round((remainingHours - jam) * 60);
  if (jam === 0) return `${menit} Menit`;
  return `${jam} Jam ${String(menit).padStart(2, "0")} Menit`;
}

export default function PetaniTrackingPage({ params }) {
  const orderId = (params?.id ?? "8471").toUpperCase();

  const [status, setStatus] = useState("TRUK_MENUJU_LAHAN");
  const [progress, setProgress] = useState(0.25);

  const totalDurationH = ROUTE.totalKm / ROUTE.speedKmh;
  const remainingHours = totalDurationH * (1 - progress);
  const truckArrived = progress >= 1;
  const loaded = status === "BARANG_DALAM_PERJALANAN";
  const cfg = STATUS_CONFIG[status];

  /* (d) Tombol aksi: konfirmasi muat → alert konfirmasi → ubah status UI */
  const handleConfirmLoaded = () => {
    const ok = window.confirm(
      `Konfirmasi: ${formatAngka(PICKUP.jumlahTon, 1)} Ton ${PICKUP.produk} telah selesai dimuat ke armada ${PICKUP.armada.plat}?`
    );
    if (!ok) return;
    setStatus("BARANG_DALAM_PERJALANAN");
    window.alert(
      "✅ Konfirmasi diterima. Status kiriman berubah menjadi BARANG_DALAM_PERJALANAN — pembeli kini dapat memantau pengiriman secara live."
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/petani/pesanan"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Pesanan Masuk
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-50">
            Penjemputan{" "}
            <span className="font-mono text-emerald-400">#TRP-{orderId}</span>
          </h1>
          <Badge tone={cfg.tone} size="md">
            <Truck className="h-3 w-3" />
            {cfg.label}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{cfg.desc}</p>
      </div>

      {/* Bento grid — konsisten dengan halaman tracking pembeli */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Seksi utama: peta live (komponen yang SAMA) ── */}
        <div className="h-[380px] lg:h-[540px] lg:col-span-2">
          <LiveTrackingMap
            origin={ROUTE.origin}
            destination={ROUTE.destination}
            waypoints={ROUTE.waypoints}
            initialProgress={0.25}
            speedKmh={ROUTE.speedKmh}
            simMinutesPerSecond={3}
            onProgressChange={(p) => setProgress(p)}
          />
        </div>

        {/* ── Panel Status Penjemputan ── */}
        <div className="space-y-4">
          {/* (b) ETA penjemputan */}
          <Card variant="emerald" padding="lg">
            <div className="mb-1 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                ETA Truk di Lahan Anda
              </p>
            </div>
            <p className="text-3xl font-extrabold tabular-nums text-emerald-300">
              {truckArrived ? "Truk Tiba 🚚" : formatEta(remainingHours)}
            </p>
            <p className="mt-1 text-[11px] text-teal-600">
              {truckArrived
                ? "Silakan mulai proses pemuatan barang bersama sopir."
                : "Mohon siapkan barang di titik muat sebelum armada tiba."}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
              <span className="text-slate-500">Sisa jarak</span>
              <span className="font-semibold tabular-nums text-slate-200">
                ± {formatAngka(ROUTE.totalKm * (1 - progress))} km
              </span>
            </div>
          </Card>

          {/* (d) Tombol aksi penting */}
          <Card padding="lg">
            <CardTitle className="mb-1 text-sm">
              <PackageCheck className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              Aksi Penjemputan
            </CardTitle>
            <p className="mb-4 text-xs text-slate-500">
              Tekan tombol di bawah SETELAH seluruh barang selesai dimuat ke bak armada.
            </p>

            {loaded ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-400">Barang dalam perjalanan</p>
                  <p className="mt-0.5 text-slate-500">
                    Status IN_TRANSIT aktif. Dana escrow akan dilepas setelah pembeli
                    mengonfirmasi penerimaan.
                  </p>
                </div>
              </div>
            ) : (
              <Button fullWidth onClick={handleConfirmLoaded}>
                <PackageCheck className="h-4 w-4" />
                Konfirmasi Barang Dimuat
              </Button>
            )}
          </Card>

          {/* (c) Data kendaraan */}
          <Card padding="lg">
            <CardTitle className="mb-3 text-sm">
              <Truck className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
              Data Kendaraan
            </CardTitle>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Hash className="h-3.5 w-3.5" /> Plat Nomor
                </span>
                <span className="font-mono font-semibold text-emerald-300">
                  {PICKUP.armada.plat}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <User className="h-3.5 w-3.5" /> Sopir
                </span>
                <span className="font-medium text-slate-200">{PICKUP.armada.sopir}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Scale className="h-3.5 w-3.5" /> Kapasitas Muatan
                </span>
                <span className="font-medium text-slate-200">{PICKUP.armada.kapasitas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Truck className="h-3.5 w-3.5" /> Jenis
                </span>
                <span className="font-medium text-slate-200">{PICKUP.armada.jenis}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> Kontak Sopir
                </span>
                <a
                  href={`tel:${PICKUP.armada.telepon.replaceAll("-", "")}`}
                  className="font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  {PICKUP.armada.telepon}
                </a>
              </div>
            </div>
          </Card>

          {/* Ringkasan muatan yang akan dijemput */}
          <Card variant="subtle" padding="sm" className="flex items-center gap-3 p-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
              <MapPin className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 text-xs">
              <p className="font-medium text-slate-200">
                {formatAngka(PICKUP.jumlahTon, 1)} Ton {PICKUP.produk}
              </p>
              <p className="text-slate-500">Tujuan akhir: {PICKUP.order}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
