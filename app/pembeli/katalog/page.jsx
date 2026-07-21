import prisma from "@/lib/prisma";
import { hitungVolumeKardus } from "@/lib/cargo";
import KatalogClient from "@/components/features/katalog/KatalogClient";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 (Pilar 3.2): Katalog kini SERVER COMPONENT.
// - Tidak ada lagi 'use client' & mock data sisi klien.
// - Data produk di-fetch langsung via Prisma di server (tanpa round-trip
//   /api/produk), lalu diproyeksikan menjadi view-model ringan yang aman
//   dikirim ke klien (tanpa field sensitif petani).
// - Seluruh interaktivitas (filter, sort, qty, add-to-cart Zustand) hidup di
//   <KatalogClient/> yang menerima data ini sebagai props.
//
// force-dynamic: stok & harga berubah sering + butuh DB saat request,
// sehingga halaman tidak boleh di-prerender statis saat build.
// ─────────────────────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

/** Turunkan badge tampilan dari data asli produk (deterministik, tanpa mock). */
function deriveBadge(produk) {
  if (produk.status === "PRE_ORDER") return { label: "Pre-Order", tone: "purple" };
  if (produk.petani?.sertifikasiOrganik) return { label: "Organik", tone: "emerald" };
  if (produk.stokKg >= 50000) return { label: "Stok Besar", tone: "blue" };
  if (produk.sertifikasi?.length > 0) return { label: produk.sertifikasi[0], tone: "teal" };
  return { label: "Langsung Petani", tone: "amber" };
}

/** Proyeksi row Prisma → view-model KatalogClient (kontrak keranjang tetap). */
function toViewModel(produk) {
  const dims =
    produk.panjangCm && produk.lebarCm && produk.tinggiCm
      ? { panjangCm: produk.panjangCm, lebarCm: produk.lebarCm, tinggiCm: produk.tinggiCm }
      : null;

  // Volume per unit: dari dimensi packaging jika ada,
  // fallback estimasi komoditas curah ±0.0015 m³/kg.
  const unitVolume = dims
    ? hitungVolumeKardus(dims)
    : produk.beratSatuan * 0.0015;

  return {
    id: produk.id,
    name: produk.nama,
    description: produk.deskripsi ?? "",
    category: produk.kategori,
    price: produk.hargaPerKg,
    unit: "kg",
    minOrder: produk.minPesanan,
    stock: produk.stokKg,
    unitWeight: produk.beratSatuan, // kg per unit — dipakai store: weight = qty × unitWeight
    unitVolume: parseFloat(unitVolume.toFixed(5)),
    isPreOrder: produk.status === "PRE_ORDER",
    certified: (produk.petani?.sertifikasiOrganik ?? false) || (produk.sertifikasi?.length ?? 0) > 0,
    tags: produk.sertifikasi ?? [],
    badge: deriveBadge(produk),
    farmer: produk.petani?.namaKebun ?? "Petani TaniPro",
    origin: produk.petani
      ? `${produk.petani.kabupaten}, ${produk.petani.provinsi}`
      : "Indonesia",
    rating: produk.petani?.rating ?? 0,
    sold: produk.petani?.totalPenjualan ?? 0,
  };
}

async function getProducts() {
  try {
    const rows = await prisma.produk.findMany({
      where: { status: { in: ["AKTIF", "PRE_ORDER"] } },
      include: {
        petani: {
          select: {
            namaKebun: true,
            kabupaten: true,
            provinsi: true,
            rating: true,
            totalPenjualan: true,
            sertifikasiOrganik: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { products: rows.map(toViewModel), dbError: false };
  } catch (error) {
    console.error("[katalog] Gagal memuat produk dari database:", error);
    return { products: [], dbError: true };
  }
}

export const metadata = {
  title: "Katalog Komoditas — TaniPro",
  description: "Sumber langsung dari petani terverifikasi di seluruh Indonesia",
};

export default async function KatalogPage() {
  const { products, dbError } = await getProducts();
  return <KatalogClient products={products} dbError={dbError} />;
}
