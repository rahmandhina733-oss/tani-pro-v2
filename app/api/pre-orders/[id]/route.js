import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const po = await prisma.preOrder.findUnique({
      where: { id: params.id },
      include: {
        produk: true,
        petani: { include: { user: { select: { nama: true, telepon: true } } } },
      },
    });
    if (!po) return NextResponse.json({ success: false, pesan: "Pre-order tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: po });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil pre-order", error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    delete body.id; delete body.produkId; delete body.petaniId;
    if (body.estimasiPanen) body.estimasiPanen = new Date(body.estimasiPanen);
    if (body.jumlahKg) body.jumlahKg = parseFloat(body.jumlahKg);
    if (body.hargaPerKg) body.hargaPerKg = parseFloat(body.hargaPerKg);

    const po = await prisma.preOrder.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, pesan: "Pre-order diperbarui", data: po });
  } catch (error) {
    if (error.code === "P2025") return NextResponse.json({ success: false, pesan: "Pre-order tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: false, pesan: "Gagal memperbarui pre-order", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.preOrder.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, pesan: "Pre-order dihapus" });
  } catch (error) {
    if (error.code === "P2025") return NextResponse.json({ success: false, pesan: "Pre-order tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: false, pesan: "Gagal menghapus pre-order", error: error.message }, { status: 500 });
  }
}
