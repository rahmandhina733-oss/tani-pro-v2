// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Format Helpers (dipindah dari lib/utils.js — FASE 2, Pilar 2.5)
// Semua formatter lokal Indonesia ("id-ID") terpusat di sini.
// ─────────────────────────────────────────────────────────────────────────────

/** Format angka menjadi Rupiah tanpa desimal: 1250000 → "Rp 1.250.000". */
export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
}

/** Format angka dengan pemisah ribuan lokal: 12345.6 → "12.345,6". */
export function formatAngka(angka, desimal = 0) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  }).format(angka);
}

/** Format tanggal panjang: "17 Agustus 2026". */
export function formatTanggal(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

/** Format tanggal pendek: "17 Agu 2026". */
export function formatTanggalPendek(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(tanggal));
}
