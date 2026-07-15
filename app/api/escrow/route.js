import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/escrow — list escrow records
// Query: status, pembeliId, page, limit
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status    = searchParams.get("status");
    const pembeliId = searchParams.get("pembeliId");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where = {};
    if (status) where.status = status;
    if (pembeliId) where.order = { pembeliId };

    const [records, total] = await Promise.all([
      prisma.escrow.findMany({
        where,
        include: {
          order: {
            select: {
              id: true, totalHarga: true, status: true, createdAt: true,
              pembeli: { select: { namaPerusahaan: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.escrow.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: records,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil data escrow", error: error.message }, { status: 500 });
  }
}
