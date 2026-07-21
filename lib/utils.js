import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 (Pilar 2.5): lib/utils.js kini HANYA berisi `cn()`.
// Fungsi lain telah dipindahkan ke modul terfokus:
//   - Format Rupiah/Angka/Tanggal   → lib/format.js
//   - Tani Point (poin & level)     → lib/tani-point.js
//   - Kubikasi & kapasitas armada   → lib/cargo.js
//   - Konfigurasi badge status      → lib/status.js
//   - Rumus ESG & data armada       → lib/esg.js  (SSOT, sejak Fase 1)
//   - Rekomendasi armada            → lib/fleet.js (SSOT, sejak Fase 1)
// ─────────────────────────────────────────────────────────────────────────────

/** Gabungkan class Tailwind dengan aman (clsx + tailwind-merge). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
