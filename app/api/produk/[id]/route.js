import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/produk/[id]
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const produk = await prisma.produk.findUnique({
      where: { id: params.id },
      include: {
        petani: {
          include: {
            user: { select: { nama: true, avatarUrl: true, telepon: true } },
          },
        },
        preOrders: {
          where: { estimasiPanen: { gte: new Date() } },
          orderBy: { estimasiPanen: "asc" },
        },
      },
    });

    if (!produk) {
      return NextResponse.json(
        { success: false, pesan: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: produk });
  } catch (error) {
    console.error("[GET /api/produk/[id]]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal mengambil detail produk", error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/produk/[id]
// Partial update: only send fields you want to change
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    // Prevent petaniId override (ownership cannot be changed)
    delete body.petaniId;
    delete body.createdAt;
    delete body.id;

    // Coerce numeric strings
    const numericFields = ["hargaPerKg", "stokKg", "beratSatuan", "panjangCm", "lebarCm", "tinggiCm", "minPesanan"];
    for (const field of numericFields) {
      if (body[field] !== undefined && body[field] !== null) {
        body[field] = parseFloat(body[field]);
      }
    }

    const produkUpdate = await prisma.produk.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      pesan: "Produk berhasil diperbarui",
      data: produkUpdate,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, pesan: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    console.error("[PATCH /api/produk/[id]]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal memperbarui produk", error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/produk/[id]  (soft delete → status = DIARSIPKAN)
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const produk = await prisma.produk.update({
      where: { id: params.id },
      data: { status: "DIARSIPKAN" },
    });

    return NextResponse.json({
      success: true,
      pesan: "Produk diarsipkan",
      data: { id: produk.id, status: produk.status },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, pesan: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/produk/[id]]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal mengarsipkan produk", error: error.message },
      { status: 500 }
    );
  }
}
