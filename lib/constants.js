// ─────────────────────────────────────────────────────────────────────────────
// TaniPro — Global Constants
// ─────────────────────────────────────────────────────────────────────────────

// Fleet specifications for 3PL recommendation engine
export const FLEET_SPECS = {
  CDE: {
    nama: "CDE (City Delivery Express)",
    kapasitasKg: 2500,
    kapasitasM3: 14,
    panjangBakM: 4.2,
    lebarBakM: 2.0,
    tinggiInternalM: 1.7,
    co2ePerKm: 0.21, // kg CO2e per km
    ikonWarna: "#34d399", // emerald-400
    cocokUntuk: "Pengiriman dalam kota, < 2.5 ton",
  },
  CDD: {
    nama: "CDD (Cold Distribution Diesel)",
    kapasitasKg: 5000,
    kapasitasM3: 24,
    panjangBakM: 5.5,
    lebarBakM: 2.2,
    tinggiInternalM: 2.0,
    co2ePerKm: 0.38,
    ikonWarna: "#60a5fa", // blue-400
    cocokUntuk: "Pengiriman regional, 2.5–5 ton",
  },
  FUSO: {
    nama: "Fuso (Full Truck Load)",
    kapasitasKg: 15000,
    kapasitasM3: 60,
    panjangBakM: 9.6,
    lebarBakM: 2.4,
    tinggiInternalM: 2.5,
    co2ePerKm: 0.72,
    ikonWarna: "#f59e0b", // amber-400
    cocokUntuk: "Pengiriman antar pulau, > 5 ton",
  },
};

// Tani Point earning rules
export const TANI_POINT_RULES = {
  PEMBELI: {
    pointPerRupiah: 1 / 1000, // 1 point per Rp 1,000 spent
    discountPerPoint: 100,     // Rp 100 discount per point redeemed
    minRedeemPoint: 500,
  },
  PETANI: {
    pointPerKgTerjual: 1 / 100, // 1 point per 100 kg sold
    minPremiumKonsultasiPoint: 200,
    bonusSertifikasiOrganik: 50,
  },
  LEVEL: [
    { nama: "Benih",   minPoin: 0,    warna: "#94a3b8", badge: "🌱" },
    { nama: "Tunas",   minPoin: 500,  warna: "#34d399", badge: "🌿" },
    { nama: "Petani",  minPoin: 2000, warna: "#60a5fa", badge: "🌾" },
    { nama: "Maestro", minPoin: 5000, warna: "#f59e0b", badge: "🏆" },
  ],
};

// ESG emission factors (GHG Protocol Scope 3)
export const ESG_FACTORS = {
  BASELINE_CO2E_PER_KG_KM: 0.00062, // conventional supply chain
  METODOLOGI: "GHG Protocol Scope 3 — Category 4 (Upstream Transportation)",
  UNIT: "kg CO2e",
};

// Escrow configuration
export const ESCROW_CONFIG = {
  holdDays: 3,           // days after delivery before auto-release
  disputeWindowDays: 7,  // days buyer can raise dispute
  bankOptions: ["BCA Virtual Account", "BRI Virtual Account", "Mandiri VA", "BNI VA"],
};

// Kategori produk pertanian
export const KATEGORI_PRODUK = [
  "Padi & Beras",
  "Sayuran",
  "Buah-buahan",
  "Rempah-rempah",
  "Tanaman Pangan",
  "Perkebunan",
  "Hortikultura",
  "Produk Olahan",
];

// Provinsi Indonesia (top agricultural)
export const PROVINSI_UTAMA = [
  "Jawa Timur",
  "Jawa Tengah",
  "Jawa Barat",
  "Sulawesi Selatan",
  "Sumatera Utara",
  "Kalimantan Selatan",
  "Nusa Tenggara Barat",
  "Bali",
  "Lampung",
  "Sumatera Selatan",
];

// Navigation items per role
export const NAV_PETANI = [
  { label: "Dashboard",       href: "/petani",                ikon: "LayoutDashboard" },
  { label: "Toko Saya",       href: "/petani/toko",           ikon: "Store" },
  { label: "Pesanan Masuk",   href: "/petani/pesanan",        ikon: "Package" },
  { label: "Lacak Kiriman",   href: "/petani/kiriman",        ikon: "Truck" },
  { label: "AI Konsultan",    href: "/petani/ai-konsultan",   ikon: "BrainCircuit" },
  { label: "Tani Point",      href: "/petani/tani-point",     ikon: "Star" },
];

// FASE 2 (Pilar 1.1): disinkronkan dengan halaman yang benar-benar ada di
// app/pembeli/* — item "Pesanan Saya" (/pembeli/pesanan) dihapus karena
// route tersebut belum memiliki page. Nav ini kini menjadi SSOT navigasi
// pembeli dan dirender oleh Sidebar via DashboardLayout (bukan lagi
// sidebar custom 189 baris di app/pembeli/layout.jsx).
export const NAV_PEMBELI = [
  { label: "Marketplace",          href: "/pembeli",            ikon: "LayoutDashboard" },
  { label: "Katalog",              href: "/pembeli/katalog",    ikon: "ShoppingBag" },
  { label: "Checkout & Logistik",  href: "/pembeli/checkout",   ikon: "ShoppingCart" },
  { label: "Escrow",               href: "/pembeli/escrow",     ikon: "ShieldCheck" },
  { label: "Laporan ESG",          href: "/pembeli/esg",        ikon: "Leaf" },
  { label: "Tani Point",           href: "/pembeli/tani-point", ikon: "Star" },
];

export const NAV_ADMIN = [
  { label: "Command Center",  href: "/admin",                 ikon: "Monitor" },
  { label: "VMS & GPS",       href: "/admin/vms",             ikon: "MapPin" },
  { label: "Load Optimizer",  href: "/admin/load-optimizer",  ikon: "Box" },
  { label: "Semua Order",     href: "/admin/orders",          ikon: "ClipboardList" },
  { label: "Pengguna",        href: "/admin/users",           ikon: "Users" },
  { label: "Laporan ESG",     href: "/admin/esg",             ikon: "BarChart2" },
  { label: "Escrow Manager",  href: "/admin/escrow",          ikon: "ShieldCheck" },
];
