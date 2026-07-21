// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Fleet Module (turunan dari SSOT lib/esg.js)
//
// PENTING: File ini TIDAK menyimpan data armada sendiri.
// Semua spec armada dibaca dari `TANIPRO_FLEETS` di lib/esg.js (SSOT),
// sehingga frontend (checkout) dan backend (/api/orders) selalu konsisten.
// ─────────────────────────────────────────────────────────────────────────────

import { TANIPRO_FLEETS, selectTaniProFleet } from "./esg";

/**
 * FLEET_OPTIONS — bentuk siap-pakai untuk UI pemilihan armada (Step 2 Checkout).
 * Murni proyeksi dari SSOT; ubah spec cukup di lib/esg.js.
 */
export const FLEET_OPTIONS = TANIPRO_FLEETS.map((f) => ({
  id: f.id,
  type: f.type,
  name: f.fullName,
  shortName: f.name,
  capacity: `${f.capacity} ton`,
  capacityTon: f.capacity,
  maxWeightKg: f.capacityKg,
  maxVolumeM3: f.capacityM3,
  bestFor: f.bestFor,
  price: f.price,
  priceLabel: f.priceLabel,
  time: f.estimatedTime,
  icon: f.icon,
  color: f.colorKey,
  emissionFactor: f.emissionFactor,
}));

/**
 * rekomendasiFleet — Mesin rekomendasi armada (Smart Load).
 * Memilih armada TaniPro paling efisien berdasarkan berat total (kg)
 * dan volume total (m³). Kompatibel dengan pemanggilan lama di
 * /api/orders: `const { terpilih } = rekomendasiFleet(totalBeratKg, 0)`.
 *
 * @param {number} totalBeratKg   Total berat muatan (kg)
 * @param {number} totalVolumeM3  Total volume muatan (m³); 0 jika tidak diketahui
 * @returns {{ rekomendasi: Array, semua: Array, terpilih: object|null }}
 */
export function rekomendasiFleet(totalBeratKg = 0, totalVolumeM3 = 0) {
  const beratKg = Number(totalBeratKg) || 0;
  const volumeM3 = Number(totalVolumeM3) || 0;

  const semua = TANIPRO_FLEETS.map((fleet) => {
    const muatBerat = beratKg <= fleet.capacityKg;
    const muatVolume = volumeM3 <= fleet.capacityM3;

    const efisiensiBerat = beratKg > 0 ? Math.min((beratKg / fleet.capacityKg) * 100, 100) : 0;
    const efisiensiVolume = volumeM3 > 0 ? Math.min((volumeM3 / fleet.capacityM3) * 100, 100) : 0;
    const pembagi = (beratKg > 0 ? 1 : 0) + (volumeM3 > 0 ? 1 : 0);
    const efisiensiRata = pembagi > 0 ? (efisiensiBerat + efisiensiVolume) / pembagi : 0;

    return {
      tipe: fleet.type,
      spec: fleet,
      cocok: muatBerat && muatVolume,
      efisiensiBerat,
      efisiensiVolume,
      efisiensiRata,
      trips: Math.max(1, Math.ceil((beratKg / 1000) / fleet.capacity)),
    };
  });

  // Armada yang muat dalam 1 trip, diurutkan dari efisiensi tertinggi
  const rekomendasi = semua
    .filter((f) => f.cocok)
    .sort((a, b) => b.efisiensiRata - a.efisiensiRata);

  // Fallback: jika tidak ada yang muat 1 trip, pakai Smart Load ESG
  // (armada terbesar/optimal dengan multi-trip) agar `terpilih` tidak null.
  let terpilih = rekomendasi[0] ?? null;
  if (!terpilih && beratKg > 0) {
    const smart = selectTaniProFleet(beratKg / 1000);
    terpilih = semua.find((f) => f.tipe === smart.type) ?? null;
  }

  return { rekomendasi, semua, terpilih };
}

/** Cari opsi UI armada berdasarkan id ("cde" | "cdd" | "fuso") atau tipe. */
export function getFleetOption(idOrType) {
  const key = String(idOrType).toLowerCase();
  return FLEET_OPTIONS.find((f) => f.id === key || f.type.toLowerCase() === key) ?? null;
}
