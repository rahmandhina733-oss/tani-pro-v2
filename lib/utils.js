import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FLEET_SPECS, TANI_POINT_RULES, ESG_FACTORS } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind class merger (used by shadcn/ui)
// ─────────────────────────────────────────────────────────────────────────────

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────
// Currency Formatter
// ─────────────────────────────────────────────────────────────────────────────

export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
}

export function formatAngka(angka, desimal = 0) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  }).format(angka);
}

export function formatTanggal(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

export function formatTanggalPendek(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(tanggal));
}

// ─────────────────────────────────────────────────────────────────────────────
// Fleet Recommendation Engine
// Recommends CDE / CDD / FUSO based on total weight and volume
// ─────────────────────────────────────────────────────────────────────────────

export function rekomendasiFleet(totalBeratKg, totalVolumeM3) {
  const hasil = [];

  for (const [tipe, spec] of Object.entries(FLEET_SPECS)) {
    const kapasitasBerat = totalBeratKg <= spec.kapasitasKg;
    const kapasitasVolume = totalVolumeM3 <= spec.kapasitasM3;
    const efisiensiBerat = totalBeratKg > 0
      ? (totalBeratKg / spec.kapasitasKg) * 100
      : 0;
    const efisiensiVolume = totalVolumeM3 > 0
      ? (totalVolumeM3 / spec.kapasitasM3) * 100
      : 0;

    hasil.push({
      tipe,
      spec,
      cocok: kapasitasBerat && kapasitasVolume,
      efisiensiBerat: Math.min(efisiensiBerat, 100),
      efisiensiVolume: Math.min(efisiensiVolume, 100),
      efisiensiRata: (Math.min(efisiensiBerat, 100) + Math.min(efisiensiVolume, 100)) / 2,
    });
  }

  // Filter yang muat, urutkan dari efisiensi tertinggi (paling optimal)
  const yangCocok = hasil
    .filter((f) => f.cocok)
    .sort((a, b) => b.efisiensiRata - a.efisiensiRata);

  return {
    rekomendasi: yangCocok,
    semua: hasil,
    terpilih: yangCocok[0] ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ESG Calculator
// ─────────────────────────────────────────────────────────────────────────────

export function hitungESG({ beratKg, jarakKm, fleetTipe }) {
  const spec = FLEET_SPECS[fleetTipe];
  if (!spec) return null;

  const emisiAktual = spec.co2ePerKm * jarakKm;
  const emisiBaseline = ESG_FACTORS.BASELINE_CO2E_PER_KG_KM * beratKg * jarakKm;
  const co2eDisimpan = Math.max(0, emisiBaseline - emisiAktual);

  return {
    emisiAktualKg: parseFloat(emisiAktual.toFixed(2)),
    emisiBaselineKg: parseFloat(emisiBaseline.toFixed(2)),
    co2eDisimpanKg: parseFloat(co2eDisimpan.toFixed(2)),
    penghematanPersen: emisiBaseline > 0
      ? parseFloat(((co2eDisimpan / emisiBaseline) * 100).toFixed(1))
      : 0,
    metodologi: ESG_FACTORS.METODOLOGI,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tani Point Calculator
// ─────────────────────────────────────────────────────────────────────────────

export function hitungPointPembeli(totalRupiah) {
  const poin = Math.floor(totalRupiah * TANI_POINT_RULES.PEMBELI.pointPerRupiah);
  return poin;
}

export function hitungPointPetani(totalKgTerjual) {
  const poin = Math.floor(totalKgTerjual * TANI_POINT_RULES.PETANI.pointPerKgTerjual);
  return poin;
}

export function getLevelTaniPoint(totalPoin) {
  const levels = TANI_POINT_RULES.LEVEL;
  let levelSaat = levels[0];

  for (const level of levels) {
    if (totalPoin >= level.minPoin) {
      levelSaat = level;
    }
  }

  const indexSaat = levels.indexOf(levelSaat);
  const levelBerikut = levels[indexSaat + 1] ?? null;
  const progressPersen = levelBerikut
    ? Math.min(
        ((totalPoin - levelSaat.minPoin) /
          (levelBerikut.minPoin - levelSaat.minPoin)) *
          100,
        100
      )
    : 100;

  return {
    levelSaat,
    levelBerikut,
    progressPersen: parseFloat(progressPersen.toFixed(1)),
    sisaUntukNaik: levelBerikut ? levelBerikut.minPoin - totalPoin : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D Bin Packing Helpers (simplified volumetric calculation)
// ─────────────────────────────────────────────────────────────────────────────

export function hitungVolumeKardus({ panjangCm, lebarCm, tinggiCm }) {
  return (panjangCm * lebarCm * tinggiCm) / 1_000_000; // convert cm³ → m³
}

export function hitungGravimetrikCheck({ beratKg, fleetTipe }) {
  const spec = FLEET_SPECS[fleetTipe];
  return {
    beratKg,
    kapasitasKg: spec.kapasitasKg,
    aman: beratKg <= spec.kapasitasKg,
    persenTerpakai: Math.min((beratKg / spec.kapasitasKg) * 100, 100),
  };
}

export function hitungVolumetrikCheck({ volumeM3, fleetTipe }) {
  const spec = FLEET_SPECS[fleetTipe];
  return {
    volumeM3,
    kapasitasM3: spec.kapasitasM3,
    aman: volumeM3 <= spec.kapasitasM3,
    persenTerpakai: Math.min((volumeM3 / spec.kapasitasM3) * 100, 100),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Badge helpers
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_ORDER_CONFIG = {
  PENDING:      { label: "Menunggu",     warna: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  DIBAYAR:      { label: "Dibayar",      warna: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  DIPROSES:     { label: "Diproses",     warna: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  DIKIRIM:      { label: "Dikirim",      warna: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  DITERIMA:     { label: "Diterima",     warna: "text-emerald-300 bg-emerald-300/10 border-emerald-300/20" },
  DIBATALKAN:   { label: "Dibatalkan",   warna: "text-red-400 bg-red-400/10 border-red-400/20" },
  SENGKETA:     { label: "Sengketa",     warna: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
};

export const STATUS_ESCROW_CONFIG = {
  MENUNGGU:     { label: "Menunggu",     warna: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  TERKUNCI:     { label: "Dana Terkunci", warna: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  DILEPAS:      { label: "Dana Dilepas", warna: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  DIKEMBALIKAN: { label: "Dikembalikan", warna: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export const STATUS_VEHICLE_CONFIG = {
  TERSEDIA:         { label: "Tersedia",         warna: "text-emerald-400 bg-emerald-400/10" },
  DALAM_PERJALANAN: { label: "Dalam Perjalanan", warna: "text-blue-400 bg-blue-400/10" },
  MAINTENANCE:      { label: "Maintenance",      warna: "text-yellow-400 bg-yellow-400/10" },
  TIDAK_AKTIF:      { label: "Tidak Aktif",      warna: "text-slate-400 bg-slate-400/10" },
};
