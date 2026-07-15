import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/pre-orders — list pre-orders
// Query: petaniId, produkId, page, limit
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const petaniId = searchParams.get("petaniId");
    const produkId = searchParams.get("produkId");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where = {};
    if (petaniId) where.petaniId = petaniId;
    if (produkId) where.produkId = produkId;
    // Only show future pre-orders by default
    where.estimasiPanen = { gte: new Date() };

    const [preOrders, total] = await Promise.all([
      prisma.preOrder.findMany({
        where,
        include: {
          produk: { select: { nama: true, kategori: true, gambarUrls: true } },
          petani: { select: { namaKebun: true, provinsi: true, rating: true } },
        },
        orderBy: { estimasiPanen: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.preOrder.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: preOrders,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil data pre-order", error: error.message }, { status: 500 });
  }
}

// POST /api/pre-orders — create a new pre-order slot
// Body: { produkId, petaniId, estimasiPanen, jumlahKg, hargaPerKg, deskripsi? }
export async function POST(request) {
  try {
    const { produkId, petaniId, estimasiPanen, jumlahKg, hargaPerKg, deskripsi } = await request.json();

    if (!produkId || !petaniId || !estimasiPanen || !jumlahKg || !hargaPerKg)
      return NextResponse.json({ success: false,
        pesan: "Field wajib: produkId, petaniId, estimasiPanen, jumlahKg, hargaPerKg" }, { status: 400 });

    if (new Date(estimasiPanen) <= new Date())
      return NextResponse.json({ success: false, pesan: "Tanggal estimasi panen harus di masa depan" }, { status: 400 });

    // Mark product as PRE_ORDER if not already
    const preOrder = await prisma.$transaction(async (tx) => {
      const po = await tx.preOrder.create({
        data: {
          produkId, petaniId,
          estimasiPanen: new Date(estimasiPanen),
          jumlahKg: parseFloat(jumlahKg),
          hargaPerKg: parseFloat(hargaPerKg),
          deskripsi: deskripsi ?? null,
        },
        include: {
          produk: { select: { nama: true, status: true } },
        },
      });
      // Optionally update product status to PRE_ORDER
      await tx.produk.update({ where: { id: produkId }, data: { status: "PRE_ORDER" } });
      return po;
    });

    return NextResponse.json({ success: true, pesan: "Pre-order berhasil dibuat", data: preOrder }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/pre-orders]", error);
    return NextResponse.json({ success: false, pesan: "Gagal membuat pre-order", error: error.message }, { status: 500 });
  }
}
