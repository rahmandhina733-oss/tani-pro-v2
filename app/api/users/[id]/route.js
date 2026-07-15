import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users/[id]
export async function GET(request, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true, nama: true, email: true, telepon: true, role: true,
        avatarUrl: true, createdAt: true, updatedAt: true,
        petaniProfile: true, pembeliProfile: true,
        taniPoint: { include: { transaksiPoin: { orderBy: { createdAt: "desc" }, take: 5 } } },
        notifikasi: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!user) return NextResponse.json({ success: false, pesan: "Pengguna tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil data pengguna", error: error.message }, { status: 500 });
  }
}

// PATCH /api/users/[id] — update profile info (no password changes here)
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    delete body.passwordHash; delete body.id; delete body.role;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
      select: { id: true, nama: true, email: true, telepon: true, avatarUrl: true, updatedAt: true },
    });
    return NextResponse.json({ success: true, pesan: "Profil berhasil diperbarui", data: user });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ success: false, pesan: "Pengguna tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: false, pesan: "Gagal memperbarui profil", error: error.message }, { status: 500 });
  }
}
