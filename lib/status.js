// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Status Badge Config (dipindah dari lib/utils.js — FASE 2, Pilar 2.5)
// Peta status → label + class warna Tailwind LITERAL (aman dari JIT purge).
// Dipakai halaman admin (orders, escrow, vms) & petani (pesanan).
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
  MENUNGGU:     { label: "Menunggu",      warna: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  TERKUNCI:     { label: "Dana Terkunci", warna: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  DILEPAS:      { label: "Dana Dilepas",  warna: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  DIKEMBALIKAN: { label: "Dikembalikan",  warna: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export const STATUS_VEHICLE_CONFIG = {
  TERSEDIA:         { label: "Tersedia",         warna: "text-emerald-400 bg-emerald-400/10" },
  DALAM_PERJALANAN: { label: "Dalam Perjalanan", warna: "text-blue-400 bg-blue-400/10" },
  MAINTENANCE:      { label: "Maintenance",      warna: "text-yellow-400 bg-yellow-400/10" },
  TIDAK_AKTIF:      { label: "Tidak Aktif",      warna: "text-slate-400 bg-slate-400/10" },
};
