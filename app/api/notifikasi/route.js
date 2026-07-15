import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/notifikasi?userId=... — get user's notifications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const dibaca = searchParams.get("dibaca"); // "true" | "false"
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!userId) return NextResponse.json({ success: false, pesan: "userId wajib diisi" }, { status: 400 });

    const where = { userId };
    if (dibaca !== null && dibaca !== undefined) where.dibaca = dibaca === "true";

    const [notifikasi, total, belumDibaca] = await Promise.all([
      prisma.notifikasi.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notifikasi.count({ where }),
      prisma.notifikasi.count({ where: { userId, dibaca: false } }),
    ]);

    return NextResponse.json({ success: true, data: notifikasi, belumDibaca,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil notifikasi", error: error.message }, { status: 500 });
  }
}
