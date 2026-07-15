import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TANI_POINT_RULES } from "@/lib/constants";

// POST /api/tani-point/[userId]/redeem — redeem points for discount
// Body: { jumlahPoin, referensiId? }
export async function POST(request, { params }) {
  try {
    const { jumlahPoin, referensiId } = await request.json();
    const poin = parseInt(jumlahPoin);

    if (!poin || poin < TANI_POINT_RULES.PEMBELI.minRedeemPoint)
      return NextResponse.json({
        success: false,
        pesan: `Minimum penukaran adalah ${TANI_POINT_RULES.PEMBELI.minRedeemPoint} poin`,
      }, { status: 400 });

    const taniPoint = await prisma.taniPoint.findUnique({ where: { userId: params.userId } });
    if (!taniPoint || taniPoint.totalPoin - taniPoint.poinDipakai < poin)
      return NextResponse.json({ success: false, pesan: "Poin tidak mencukupi" }, { status: 400 });

    const nilaiDiskon = poin * TANI_POINT_RULES.PEMBELI.discountPerPoint;

    const updated = await prisma.$transaction(async (tx) => {
      const tp = await tx.taniPoint.update({
        where: { userId: params.userId },
        data: { poinDipakai: { increment: poin } },
      });
      await tx.taniPointTx.create({
        data: { taniPointId: tp.id, jumlah: -poin,
          keterangan: `Penukaran ${poin} poin → diskon Rp ${nilaiDiskon.toLocaleString("id-ID")}`,
          referensiId: referensiId ?? null },
      });
      return tp;
    });

    return NextResponse.json({ success: true,
      pesan: `${poin} poin berhasil ditukar`,
      data: { poinDitukar: poin, nilaiDiskonRupiah: nilaiDiskon, sisaPoin: updated.totalPoin - updated.poinDipakai },
    });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal menukar poin", error: error.message }, { status: 500 });
  }
}
