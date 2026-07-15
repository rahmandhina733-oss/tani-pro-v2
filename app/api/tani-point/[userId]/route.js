import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLevelTaniPoint } from "@/lib/utils";

// GET /api/tani-point/[userId] — get user's points, level, transaction history
export async function GET(request, { params }) {
  try {
    const taniPoint = await prisma.taniPoint.findUnique({
      where: { userId: params.userId },
      include: {
        transaksiPoin: { orderBy: { createdAt: "desc" }, take: 20 },
        user: { select: { nama: true, role: true, avatarUrl: true } },
      },
    });

    if (!taniPoint) {
      return NextResponse.json({
        success: true,
        data: { totalPoin: 0, poinDipakai: 0, level: "Benih", transaksiPoin: [],
          levelInfo: getLevelTaniPoint(0) },
      });
    }

    const levelInfo = getLevelTaniPoint(taniPoint.totalPoin);
    return NextResponse.json({ success: true, data: { ...taniPoint, levelInfo } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil data Tani Point", error: error.message }, { status: 500 });
  }
}
