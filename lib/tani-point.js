import { TANI_POINT_RULES } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Tani Point Engine (dipindah dari lib/utils.js — FASE 2, Pilar 2.5)
// Aturan poin & level dibaca dari lib/constants.js (TANI_POINT_RULES).
// ─────────────────────────────────────────────────────────────────────────────

/** Poin pembeli: 1 poin per Rp 1.000 belanja. */
export function hitungPointPembeli(totalRupiah) {
  return Math.floor(totalRupiah * TANI_POINT_RULES.PEMBELI.pointPerRupiah);
}

/** Poin petani: 1 poin per 100 kg terjual. */
export function hitungPointPetani(totalKgTerjual) {
  return Math.floor(totalKgTerjual * TANI_POINT_RULES.PETANI.pointPerKgTerjual);
}

/**
 * Hitung level Tani Point saat ini beserta progres menuju level berikutnya.
 * @returns {{ levelSaat, levelBerikut, progressPersen, sisaUntukNaik }}
 */
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
