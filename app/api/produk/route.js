import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/produk
// Query params: kategori, petaniId, status, search, minHarga, maxHarga,
//               minStok, sertifikasi, sortBy, order, page, limit
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const kategori    = searchParams.get("kategori");
    const petaniId    = searchParams.get("petaniId");
    const status      = searchParams.get("status") ?? "AKTIF";
    const search      = searchParams.get("search");
    const minHarga    = searchParams.get("minHarga");
    const maxHarga    = searchParams.get("maxHarga");
    const minStok     = searchParams.get("minStok");
    const sertifikasi = searchParams.get("sertifikasi"); // comma-separated
    const sortBy      = searchParams.get("sortBy") ?? "createdAt";
    const sortOrder   = searchParams.get("order") ?? "desc";
    const page        = parseInt(searchParams.get("page") ?? "1");
    const limit       = parseInt(searchParams.get("limit") ?? "20");
    const skip        = (page - 1) * limit;

    const where = {};

    if (status && status !== "SEMUA") where.status = status;
    if (kategori) where.kategori = kategori;
    if (petaniId) where.petaniId = petaniId;
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
        { kategori: { contains: search, mode: "insensitive" } },
      ];
    }
    if (minHarga || maxHarga) {
      where.hargaPerKg = {};
      if (minHarga) where.hargaPerKg.gte = parseFloat(minHarga);
      if (maxHarga) where.hargaPerKg.lte = parseFloat(maxHarga);
    }
    if (minStok) where.stokKg = { gte: parseFloat(minStok) };
    if (sertifikasi) {
      where.sertifikasi = { hasSome: sertifikasi.split(",") };
    }

    const validSortFields = ["createdAt", "hargaPerKg", "stokKg", "nama"];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [produk, total] = await Promise.all([
      prisma.produk.findMany({
        where,
        include: {
          petani: {
            select: {
              id: true,
              namaKebun: true,
              provinsi: true,
              kabupaten: true,
              rating: true,
              sertifikasiOrganik: true,
              user: { select: { nama: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { [orderByField]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.produk.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: produk,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/produk]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal mengambil data produk", error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/produk
// Body: { petaniId, nama, deskripsi, kategori, hargaPerKg, stokKg,
//         beratSatuan, panjangCm, lebarCm, tinggiCm, gambarUrls,
//         status, minPesanan, sertifikasi }
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      petaniId, nama, deskripsi, kategori, hargaPerKg,
      stokKg, beratSatuan, panjangCm, lebarCm, tinggiCm,
      gambarUrls, status, minPesanan, sertifikasi,
    } = body;

    // Validate required fields
    if (!petaniId || !nama || !kategori || !hargaPerKg || !stokKg || !beratSatuan) {
      return NextResponse.json(
        { success: false, pesan: "Field wajib tidak lengkap: petaniId, nama, kategori, hargaPerKg, stokKg, beratSatuan" },
        { status: 400 }
      );
    }

    // Verify petani exists
    const petani = await prisma.petaniProfile.findUnique({ where: { id: petaniId } });
    if (!petani) {
      return NextResponse.json(
        { success: false, pesan: "Profil petani tidak ditemukan" },
        { status: 404 }
      );
    }

    const produkBaru = await prisma.produk.create({
      data: {
        petaniId,
        nama,
        deskripsi: deskripsi ?? null,
        kategori,
        hargaPerKg: parseFloat(hargaPerKg),
        stokKg: parseFloat(stokKg),
        beratSatuan: parseFloat(beratSatuan),
        panjangCm: panjangCm ? parseFloat(panjangCm) : null,
        lebarCm: lebarCm ? parseFloat(lebarCm) : null,
        tinggiCm: tinggiCm ? parseFloat(tinggiCm) : null,
        gambarUrls: gambarUrls ?? [],
        status: status ?? "AKTIF",
        minPesanan: minPesanan ? parseFloat(minPesanan) : 10,
        sertifikasi: sertifikasi ?? [],
      },
      include: {
        petani: { select: { namaKebun: true, provinsi: true } },
      },
    });

    return NextResponse.json(
      { success: true, pesan: "Produk berhasil ditambahkan", data: produkBaru },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/produk]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal menambah produk", error: error.message },
      { status: 500 }
    );
  }
}
