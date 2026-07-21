// prisma/seed.js — TaniPro Development Seed Data
// Run: npx prisma db seed  OR  node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const HASH = (pw) => bcrypt.hashSync(pw, 10);

async function main() {
  console.log("🌱 Seeding TaniPro database...");

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@tanipro.id" },
    update: {},
    create: {
      nama: "Admin TaniPro",
      email: "admin@tanipro.id",
      passwordHash: HASH("admin123"),
      role: "ADMIN",
      telepon: "081200000000",
    },
  });
  await prisma.taniPoint.upsert({ where: { userId: admin.id }, update: {}, create: { userId: admin.id } });

  // ── PETANI (FARMERS) ───────────────────────────────────────────────────────
  const petani1User = await prisma.user.upsert({
    where: { email: "budi@tanipro.id" },
    update: {},
    create: {
      nama: "Budi Santoso",
      email: "budi@tanipro.id",
      passwordHash: HASH("petani123"),
      role: "PETANI",
      telepon: "08123456789",
    },
  });
  const petani1Profile = await prisma.petaniProfile.upsert({
    where: { userId: petani1User.id },
    update: {},
    create: {
      userId: petani1User.id,
      namaKebun: "Kebun Berkah Jaya",
      alamat: "Jl. Pertanian No. 12, Ds. Sukamaju",
      provinsi: "Jawa Timur",
      kabupaten: "Malang",
      latitude: -7.9797,
      longitude: 112.6304,
      luasLahan: 15.5,
      sertifikasiOrganik: true,
      rating: 4.8,
      totalPenjualan: 12500,
    },
  });
  await prisma.taniPoint.upsert({ where: { userId: petani1User.id }, update: {}, create: { userId: petani1User.id, totalPoin: 125, level: "Tunas" } });

  const petani2User = await prisma.user.upsert({
    where: { email: "sari@tanipro.id" },
    update: {},
    create: {
      nama: "Sari Dewi",
      email: "sari@tanipro.id",
      passwordHash: HASH("petani123"),
      role: "PETANI",
      telepon: "08234567890",
    },
  });
  const petani2Profile = await prisma.petaniProfile.upsert({
    where: { userId: petani2User.id },
    update: {},
    create: {
      userId: petani2User.id,
      namaKebun: "Lahan Organik Sari",
      alamat: "Desa Wonokerto, Kec. Puncu",
      provinsi: "Jawa Timur",
      kabupaten: "Kediri",
      latitude: -7.8067,
      longitude: 111.9918,
      luasLahan: 8.2,
      sertifikasiOrganik: true,
      rating: 4.6,
      totalPenjualan: 7800,
    },
  });
  await prisma.taniPoint.upsert({ where: { userId: petani2User.id }, update: {}, create: { userId: petani2User.id, totalPoin: 78, level: "Benih" } });

  // ── PEMBELI (BUYERS) ───────────────────────────────────────────────────────
  const pembeli1User = await prisma.user.upsert({
    where: { email: "pt.segar@tanipro.id" },
    update: {},
    create: {
      nama: "Rudi Hermawan",
      email: "pt.segar@tanipro.id",
      passwordHash: HASH("pembeli123"),
      role: "PEMBELI",
      telepon: "08765432100",
    },
  });
  const pembeli1Profile = await prisma.pembeliProfile.upsert({
    where: { userId: pembeli1User.id },
    update: {},
    create: {
      userId: pembeli1User.id,
      namaPerusahaan: "PT Segar Nusantara",
      npwp: "12.345.678.9-012.345",
      alamatKantor: "Jl. Raya Industri No. 88, SIER, Surabaya",
      industri: "Pengolahan Makanan",
      limitKredit: 500000000,
      isVerified: true,
    },
  });
  await prisma.taniPoint.upsert({ where: { userId: pembeli1User.id }, update: {}, create: { userId: pembeli1User.id, totalPoin: 2340, level: "Petani" } });

  // ── PRODUK ─────────────────────────────────────────────────────────────────
  const produk1 = await prisma.produk.upsert({
    where: { id: "produk-beras-premium-001" },
    update: {},
    create: {
      id: "produk-beras-premium-001",
      petaniId: petani1Profile.id,
      nama: "Beras Organik Premium Cianjur",
      deskripsi: "Beras organik bersertifikat, dipanen dari lahan bebas pestisida. Cocok untuk restoran dan hotel bintang 5.",
      kategori: "Padi & Beras",
      hargaPerKg: 18500,
      stokKg: 5000,
      beratSatuan: 25,
      panjangCm: 55,
      lebarCm: 35,
      tinggiCm: 20,
      gambarUrls: ["/images/beras-organik.jpg"],
      status: "AKTIF",
      minPesanan: 100,
      sertifikasi: ["Organik Indonesia", "SNI", "HACCP"],
      umurSimpanHari: 365,       // FIX TUGAS 4
      warnaVisual: "Putih Bersih", // FIX TUGAS 4
      gradeKualitas: "A",         // FIX TUGAS 4
    },
  });

  const produk2 = await prisma.produk.upsert({
    where: { id: "produk-cabai-merah-001" },
    update: {},
    create: {
      id: "produk-cabai-merah-001",
      petaniId: petani1Profile.id,
      nama: "Cabai Merah Keriting Grade A",
      deskripsi: "Cabai merah segar sortir grade A, kadar air optimal. Ideal untuk industri sambal dan bumbu.",
      kategori: "Sayuran",
      hargaPerKg: 45000,
      stokKg: 800,
      beratSatuan: 10,
      panjangCm: 40,
      lebarCm: 25,
      tinggiCm: 15,
      gambarUrls: ["/images/cabai-merah.jpg"],
      status: "AKTIF",
      minPesanan: 50,
      sertifikasi: ["Prima 3"],
      umurSimpanHari: 7,          // FIX TUGAS 4
      warnaVisual: "Merah Segar",  // FIX TUGAS 4
      gradeKualitas: "A",          // FIX TUGAS 4
    },
  });

  const produk3 = await prisma.produk.upsert({
    where: { id: "produk-jahe-merah-001" },
    update: {},
    create: {
      id: "produk-jahe-merah-001",
      petaniId: petani2Profile.id,
      nama: "Jahe Merah Organik Kediri",
      deskripsi: "Jahe merah segar, kadar gingerol tinggi, cocok untuk industri farmasi dan minuman herbal.",
      kategori: "Rempah-rempah",
      hargaPerKg: 62000,
      stokKg: 1200,
      beratSatuan: 20,
      panjangCm: 50,
      lebarCm: 30,
      tinggiCm: 25,
      gambarUrls: ["/images/jahe-merah.jpg"],
      status: "AKTIF",
      minPesanan: 50,
      sertifikasi: ["Organik Indonesia", "GMP"],
      umurSimpanHari: 90,          // FIX TUGAS 4
      warnaVisual: "Merah Kecoklatan", // FIX TUGAS 4
      gradeKualitas: "B",           // FIX TUGAS 4
    },
  });

  // ── KENDARAAN (VEHICLES) ───────────────────────────────────────────────────
  const cde1 = await prisma.vehicle.upsert({
    where: { platNomor: "W 1234 AB" },
    update: {},
    create: {
      platNomor: "W 1234 AB",
      tipe: "CDE",
      kapasitasKg: 2500,
      kapasitasVolM3: 14,
      supirNama: "Agus Setiawan",
      supirTelepon: "081311111111",
      status: "TERSEDIA",
      latitudeSaat: -7.2575,
      longitudeSaat: 112.7521,
      lastGpsUpdate: new Date(),
    },
  });

  const cdd1 = await prisma.vehicle.upsert({
    where: { platNomor: "W 5678 CD" },
    update: {},
    create: {
      platNomor: "W 5678 CD",
      tipe: "CDD",
      kapasitasKg: 5000,
      kapasitasVolM3: 24,
      supirNama: "Hendra Wijaya",
      supirTelepon: "081322222222",
      status: "DALAM_PERJALANAN",
      latitudeSaat: -7.5731,
      longitudeSaat: 112.6895,
      lastGpsUpdate: new Date(),
    },
  });

  const fuso1 = await prisma.vehicle.upsert({
    where: { platNomor: "L 9012 EF" },
    update: {},
    create: {
      platNomor: "L 9012 EF",
      tipe: "FUSO",
      kapasitasKg: 15000,
      kapasitasVolM3: 60,
      supirNama: "Bambang Susilo",
      supirTelepon: "081333333333",
      status: "TERSEDIA",
      latitudeSaat: -7.2458,
      longitudeSaat: 112.7378,
      lastGpsUpdate: new Date(),
    },
  });

  // ── SAMPLE ORDER + ESCROW ─────────────────────────────────────────────────
  const order1 = await prisma.order.upsert({
    where: { id: "order-demo-001" },
    update: {},
    create: {
      id: "order-demo-001",
      pembeliId: pembeli1Profile.id,
      status: "DIKIRIM",
      totalHarga: 9250000,
      totalBeratKg: 500,
      alamatPengiriman: "Jl. Raya Industri No. 88, SIER, Surabaya",
      fleetRekomendasi: "CDD",
      estimasiTiba: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { produkId: produk1.id, jumlahKg: 300, hargaUnit: 18500, subtotal: 5550000 },
          { produkId: produk2.id, jumlahKg: 200, hargaUnit: 45000, subtotal: 9000000 },
        ],
      },
    },
  });

  await prisma.escrow.upsert({
    where: { orderId: "order-demo-001" },
    update: {},
    create: {
      orderId: "order-demo-001",
      jumlah: 9250000,
      status: "TERKUNCI",
      virtualAccount: "VA8001234567890",
      bankTujuan: "BCA Virtual Account",
      terkunciPada: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  await prisma.shipment.upsert({
    where: { orderId: "order-demo-001" },
    update: {},
    create: {
      orderId: "order-demo-001",
      vehicleId: cdd1.id,
      status: "DALAM_PERJALANAN",
      titikAsal: "Malang, Jawa Timur",
      titikTujuan: "SIER, Surabaya",
      jarakKm: 95,
      estimasiJamTiba: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      waktuPickup: new Date(Date.now() - 12 * 60 * 60 * 1000),
      trackingHistory: [
        { waktu: new Date(Date.now() - 14 * 3600000).toISOString(), status: "MENUNGGU_PICKUP", lokasi: "Kebun Berkah Jaya, Malang", koordinat: { lat: -7.9797, lng: 112.6304 } },
        { waktu: new Date(Date.now() - 12 * 3600000).toISOString(), status: "DALAM_PERJALANAN", lokasi: "Malang, Jawa Timur", koordinat: { lat: -7.9797, lng: 112.6304 } },
        { waktu: new Date(Date.now() - 6 * 3600000).toISOString(),  status: "TIBA_DI_HUB",     lokasi: "Hub Pandaan, Pasuruan", koordinat: { lat: -7.6309, lng: 112.7001 } },
        { waktu: new Date(Date.now() - 2 * 3600000).toISOString(),  status: "SEDANG_DIKIRIM",  lokasi: "Tol Surabaya-Gempol", koordinat: { lat: -7.3616, lng: 112.7395 } },
      ],
    },
  });

  await prisma.esgRecord.upsert({
    where: { orderId: "order-demo-001" },
    update: {},
    create: {
      orderId: "order-demo-001",
      co2eDisimpanKg: 18.4,
      co2eEmisiKg: 36.1,
      jarakKm: 95,
      fleetTipe: "CDD",
      perbandinganBaseline: 54.5,
      metodologi: "GHG Protocol Scope 3 — Category 4 (Upstream Transportation)",
    },
  });

  console.log("✅ Seed selesai! Data yang dibuat:");
  console.log(`   👤 Admin:   admin@tanipro.id / admin123`);
  console.log(`   🌾 Petani1: budi@tanipro.id / petani123`);
  console.log(`   🌾 Petani2: sari@tanipro.id / petani123`);
  console.log(`   🏢 Pembeli: pt.segar@tanipro.id / pembeli123`);
  console.log(`   📦 ${[produk1, produk2, produk3].length} produk, ${[cde1, cdd1, fuso1].length} kendaraan, 1 order demo`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error("❌ Seed error:", e); prisma.$disconnect(); process.exit(1); });
