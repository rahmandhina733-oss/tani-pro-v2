// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Mesin Kalkulasi ESG (Jejak Karbon) Terpusat
// Digunakan oleh: checkout pembeli, laporan ESG, load optimizer, VMS,
// lacak kiriman petani, dan dashboard admin.
//
// Formula:
//   D_opt  = D × 0.7                                   (optimasi rute VMS)
//   E_conv = ceil(W / C_pickup)  × D     × EF_pickup   (baseline L300)
//   E_tp   = ceil(W / C_armada)  × D_opt × EF_armada   (TaniPro Smart Load)
//   Saved  = E_conv − E_tp
// ─────────────────────────────────────────────────────────────────────────────

// Titik awal DIKUNCI (hardcode)
export const ORIGIN_LOCATION = "Kampus C UNAIR, Surabaya";

// Faktor optimasi rute VMS TaniPro (penghematan jarak 30%)
export const VMS_OPTIMIZATION_FACTOR = 0.7;

// Baseline Konvensional: Pick-up L300
export const PICKUP_L300 = {
  name: "Pick-up L300",
  capacity: 2, // Ton
  emissionFactor: 0.268, // kg CO2e / km
  icon: "🛻",
};

// ─────────────────────────────────────────────────────────────────────────────
// Armada TaniPro (Smart Load) — SINGLE SOURCE OF TRUTH (SSOT)
// Semua modul (checkout, API orders, VMS, load optimizer, laporan ESG)
// WAJIB membaca data armada dari array ini. Jangan duplikasi di file lain.
// Dipilih otomatis berdasarkan W_total (Ton).
// ─────────────────────────────────────────────────────────────────────────────
export const TANIPRO_FLEETS = [
  {
    // ─────────────────────────────────────────────────────────────────────
    // FIX TUGAS 5 (Load Matching): tier armada TERKECIL yang sebelumnya
    // TIDAK ADA di SSOT — sebelum ini, muatan < 1 Ton tetap dipaksa naik
    // truk CDE (3 Ton, EF 0.382), padahal baseline konvensionalnya cuma
    // pick-up L300 (EF 0.268). Selisih EF yang lebih tinggi itu nyaris
    // menghabisi seluruh penghematan dari optimasi rute VMS (30%), dan
    // pada faktor optimasi yang sedikit lebih rendah bisa membuat Emisi
    // TaniPro > Emisi Konvensional (persis bug yang dilaporkan).
    //
    // "pickup" di sini SENGAJA memakai kelas kendaraan & EF yang SAMA
    // dengan PICKUP_L300 (baseline) — bedanya HANYA D_opt (rute VMS
    // dioptimasi 30%). Ini menggaransi E_tp ≤ E_conv untuk muatan kecil,
    // apa pun nilai VMS_OPTIMIZATION_FACTOR-nya nanti.
    // ─────────────────────────────────────────────────────────────────────
    id: "pickup",
    type: "PICKUP",
    name: "Pick-up TaniPro",
    fullName: "Pick-up (Smart Load — Muatan Kecil)",
    capacity: 1,             // Ton — ambang batas Tugas 5: berat ≤ 1000 kg
    capacityKg: 1000,
    capacityM3: 5,
    dimensions: { panjangBakM: 2.1, lebarBakM: 1.6, tinggiInternalM: 1.0 },
    emissionFactor: 0.268,   // = PICKUP_L300.emissionFactor (kelas kendaraan sama)
    price: 350000,
    priceLabel: "Rp 350.000",
    estimatedTime: "Same-day / 1 hari",
    bestFor: "Muatan kecil < 1 Ton, pengiriman cepat dalam kota",
    icon: "🛻",
    color: "#94a3b8",
    colorKey: "slate",
  },
  {
    id: "cde",
    type: "CDE",
    name: "Truk CDE",
    fullName: "CDE (Cold Diesel Engine)",
    capacity: 3,            // Ton — dipakai rumus ESG (C_armada)
    capacityKg: 3000,       // kg
    capacityM3: 14,         // m³ — batas volumetrik
    dimensions: { panjangBakM: 4.2, lebarBakM: 2.0, tinggiInternalM: 1.7 },
    emissionFactor: 0.382,  // kg CO2e / km (EF_armada)
    price: 850000,
    priceLabel: "Rp 850.000",
    estimatedTime: "1–2 hari",
    bestFor: "Pengiriman kota dalam radius 100km",
    icon: "🚐",
    color: "#34d399",
    colorKey: "blue",       // key colorMap Tailwind di UI checkout
  },
  {
    id: "cdd",
    type: "CDD",
    name: "Truk CDD",
    fullName: "CDD (Cold Double Diesel)",
    capacity: 5,
    capacityKg: 5000,
    capacityM3: 24,
    dimensions: { panjangBakM: 5.5, lebarBakM: 2.2, tinggiInternalM: 2.0 },
    emissionFactor: 0.536,
    price: 1400000,
    priceLabel: "Rp 1.400.000",
    estimatedTime: "2–3 hari",
    bestFor: "Antar kota Pulau Jawa (opsi manual)",
    icon: "🚛",
    color: "#60a5fa",
    colorKey: "emerald",
  },
  {
    id: "fuso",
    type: "FUSO",
    name: "Truk Fuso",
    fullName: "Fuso (Heavy Truck / Besar)",
    capacity: 10,
    capacityKg: 10000,
    capacityM3: 60,
    dimensions: { panjangBakM: 9.6, lebarBakM: 2.4, tinggiInternalM: 2.5 },
    emissionFactor: 0.893,
    price: 2800000,
    priceLabel: "Rp 2.800.000",
    estimatedTime: "3–5 hari",
    bestFor: "Pengiriman massal antar pulau, muatan > 3 Ton",
    icon: "🚚",
    color: "#f59e0b",
    colorKey: "amber",
  },
];

// Kota tujuan simulasi — jarak referensi (km) dari Kampus C UNAIR, Surabaya
export const DESTINATION_CITIES = [
  { name: "Surabaya (Dalam Kota)", refDistance: 15 },
  { name: "Sidoarjo", refDistance: 30 },
  { name: "Gresik", refDistance: 25 },
  { name: "Mojokerto", refDistance: 55 },
  { name: "Malang", refDistance: 95 },
  { name: "Kediri", refDistance: 125 },
  { name: "Madiun", refDistance: 170 },
  { name: "Jember", refDistance: 200 },
  { name: "Banyuwangi", refDistance: 290 },
  { name: "Semarang", refDistance: 350 },
  { name: "Yogyakarta", refDistance: 330 },
  { name: "Solo (Surakarta)", refDistance: 265 },
  { name: "Jakarta", refDistance: 780 },
  { name: "Bekasi", refDistance: 760 },
  { name: "Bandung", refDistance: 720 },
  { name: "Denpasar", refDistance: 430 },
];

/** Cari jarak referensi (km) berdasarkan nama tujuan (pencocokan longgar). */
export function findRefDistance(destinationName = "") {
  const lower = destinationName.toLowerCase();
  const found = DESTINATION_CITIES.find(
    (c) => lower.includes(c.name.toLowerCase().split(" ")[0]) || c.name.toLowerCase().includes(lower)
  );
  return found ? found.refDistance : null;
}

/**
 * FIX TUGAS 5 (Load Matching) — Smart Load: pilih armada TaniPro secara
 * PRESISI berdasarkan berat muatan, SEBELUM emisi dihitung. Menggantikan
 * logika lama yang "naik kapasitas" (≤3 Ton→CDE, ≤5 Ton→CDD, sisanya→Fuso)
 * — logika lama itu tidak punya tier kecil, sehingga muatan mini (mis. 50kg)
 * ikut dipaksa naik truk CDE 3 Ton dan berisiko Emisi TaniPro > Konvensional
 * (truk kebesaran / oversized vehicle untuk muatan kecil).
 *
 * Aturan presisi (persis brief):
 *   1) berat ≤ 1.000 kg           → Pickup
 *   2) 1.000 kg < berat ≤ 3.000 kg → Truk Engkel (CDE)
 *   3) berat > 3.000 kg            → Truk Fuso/Besar
 *
 * @param {number} totalWeightTon  W_total (Ton) — tetap terima satuan Ton
 *   agar kompatibel dengan seluruh pemanggil lama (checkout, /api/orders,
 *   load optimizer), dikonversi ke kg secara internal untuk pencocokan.
 */
export function selectTaniProFleet(totalWeightTon) {
  // Guard NaN/kosong: Number(x) || 0 menjamin nilai non-numerik jadi 0,
  // sehingga tidak pernah lolos ke perbandingan dengan NaN.
  const weightKg = (Number(totalWeightTon) || 0) * 1000;

  if (weightKg <= 1000) return getEsgFleet("pickup");   // Aturan 1
  if (weightKg <= 3000) return getEsgFleet("cde");       // Aturan 2 — Truk Engkel
  return getEsgFleet("fuso");                            // Aturan 3 — Fuso/Besar
}

/** Ambil armada ESG berdasarkan tipe ("CDE" | "CDD" | "FUSO") atau id ("cde" | ...). */
export function getEsgFleet(typeOrId) {
  const key = String(typeOrId).toLowerCase();
  return TANIPRO_FLEETS.find((f) => f.id === key || f.type.toLowerCase() === key) ?? null;
}

/**
 * Kalkulasi ESG inti.
 * @param {number} weightTon   W_total (Ton)
 * @param {number} distanceKm  D (km)
 * @param {object} [fleetOverride] paksa armada tertentu (dari TANIPRO_FLEETS); default: Smart Load otomatis
 * @returns hasil kalkulasi { valid, D, D_opt, tripsConv, tripsTp, E_conv, E_tp, saved, savedPercent, fleet }
 */
export function calculateEsg(weightTon, distanceKm, fleetOverride = null) {
  // FIX TUGAS 5: guard eksplisit terhadap NaN/variabel kosong. `Number(x) || 0`
  // sudah mengubah NaN menjadi 0 (NaN bersifat falsy di JS), tapi kita
  // periksa ulang dengan Number.isFinite agar niat "anti-NaN" ini terbaca
  // jelas di kode dan tahan terhadap perubahan logika di masa depan.
  const W_total = Number.isFinite(Number(weightTon)) ? Number(weightTon) || 0 : 0;
  const D = Number.isFinite(Number(distanceKm)) ? Number(distanceKm) || 0 : 0;
  const fleet = fleetOverride ?? selectTaniProFleet(W_total);

  if (W_total <= 0 || D <= 0) {
    return {
      valid: false, W_total, D, D_opt: 0,
      tripsConv: 0, tripsTp: 0, E_conv: 0, E_tp: 0,
      saved: 0, savedPercent: 0, fleet,
    };
  }

  const D_opt = D * VMS_OPTIMIZATION_FACTOR;

  const tripsConv = Math.ceil(W_total / PICKUP_L300.capacity);
  const E_conv = tripsConv * D * PICKUP_L300.emissionFactor;

  const tripsTp = Math.ceil(W_total / fleet.capacity);
  const E_tp = tripsTp * D_opt * fleet.emissionFactor;

  const saved = E_conv - E_tp;
  const savedPercent = E_conv > 0 ? (saved / E_conv) * 100 : 0;

  return { valid: true, W_total, D, D_opt, tripsConv, tripsTp, E_conv, E_tp, saved, savedPercent, fleet };
}

/** Konversi penghematan CO2e (kg) → estimasi pohon/tahun (1 pohon ≈ 21 kg CO2e/tahun). */
export function co2ToTrees(savedKg) {
  if (savedKg <= 0) return 0;
  return Math.max(1, Math.round(savedKg / 21));
}
