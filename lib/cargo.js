import { getEsgFleet } from "./esg";

// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Cargo / Kubikasi Helpers
// (dipindah dari lib/utils.js — FASE 2, Pilar 2.5)
//
// CATATAN SSOT: sebelumnya helper ini membaca `FLEET_SPECS` di constants.js —
// database armada duplikat yang sudah dipensiunkan pada FIX P0 #3.
// Kini kapasitas dibaca dari TANIPRO_FLEETS (lib/esg.js) via getEsgFleet(),
// sehingga seluruh aplikasi konsisten pada satu sumber data armada.
// ─────────────────────────────────────────────────────────────────────────────

/** Volume kardus (cm) → m³. */
export function hitungVolumeKardus({ panjangCm, lebarCm, tinggiCm }) {
  return (panjangCm * lebarCm * tinggiCm) / 1_000_000;
}

/** Cek muatan terhadap kapasitas BERAT armada (gravimetrik). */
export function hitungGravimetrikCheck({ beratKg, fleetTipe }) {
  const spec = getEsgFleet(fleetTipe);
  if (!spec) return null;
  return {
    beratKg,
    kapasitasKg: spec.capacityKg,
    aman: beratKg <= spec.capacityKg,
    persenTerpakai: Math.min((beratKg / spec.capacityKg) * 100, 100),
  };
}

/** Cek muatan terhadap kapasitas VOLUME armada (volumetrik). */
export function hitungVolumetrikCheck({ volumeM3, fleetTipe }) {
  const spec = getEsgFleet(fleetTipe);
  if (!spec) return null;
  return {
    volumeM3,
    kapasitasM3: spec.capacityM3,
    aman: volumeM3 <= spec.capacityM3,
    persenTerpakai: Math.min((volumeM3 / spec.capacityM3) * 100, 100),
  };
}
