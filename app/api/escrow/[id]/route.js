import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/escrow/[id]
export async function GET(request, { params }) {
  try {
    const escrow = await prisma.escrow.findUnique({
      where: { id: params.id },
      include: { order: { include: { pembeli: true, items: { include: { produk: true } } } } },
    });
    if (!escrow) return NextResponse.json({ success: false, pesan: "Escrow tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: escrow });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil detail escrow", error: error.message }, { status: 500 });
  }
}
