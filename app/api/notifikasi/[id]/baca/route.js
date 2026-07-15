import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/notifikasi/[id]/baca — mark single notification as read
export async function PATCH(request, { params }) {
  try {
    if (params.id === "semua") {
      const { userId } = await request.json();
      if (!userId) return NextResponse.json({ success: false, pesan: "userId wajib" }, { status: 400 });
      await prisma.notifikasi.updateMany({ where: { userId, dibaca: false }, data: { dibaca: true } });
      return NextResponse.json({ success: true, pesan: "Semua notifikasi ditandai dibaca" });
    }

    const notif = await prisma.notifikasi.update({ where: { id: params.id }, data: { dibaca: true } });
    return NextResponse.json({ success: true, data: notif });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ success: false, pesan: "Notifikasi tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: false, pesan: "Gagal menandai notifikasi", error: error.message }, { status: 500 });
  }
}
