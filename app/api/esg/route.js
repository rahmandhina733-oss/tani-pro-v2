import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/esg — aggregated ESG report
// Query: pembeliId, petaniId, fleetTipe, startDate, endDate
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pembeliId  = searchParams.get("pembeliId");
    const fleetTipe  = searchParams.get("fleetTipe");
    const startDate  = searchParams.get("startDate");
    const endDate    = searchParams.get("endDate");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where = {};
    if (pembeliId) where.order = { pembeliId };
    if (fleetTipe) where.fleetTipe = fleetTipe;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate)   where.createdAt.lte = new Date(endDate);
    }

    const [records, total] = await Promise.all([
      prisma.esgRecord.findMany({
        where,
        include: {
          order: {
            select: { id: true, totalBeratKg: true, createdAt: true,
              pembeli: { select: { namaPerusahaan: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.esgRecord.count({ where }),
    ]);

    // Aggregate totals
    const aggregate = await prisma.esgRecord.aggregate({
      where,
      _sum: { co2eDisimpanKg: true, co2eEmisiKg: true, jarakKm: true },
      _avg: { co2eDisimpanKg: true },
      _count: true,
    });

    return NextResponse.json({
      success: true, data: records,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
      agregat: {
        totalCO2eDisimpanKg: aggregate._sum.co2eDisimpanKg ?? 0,
        totalCO2eEmisiKg:    aggregate._sum.co2eEmisiKg    ?? 0,
        totalJarakKm:        aggregate._sum.jarakKm        ?? 0,
        rataDisimpanPerOrder: aggregate._avg.co2eDisimpanKg ?? 0,
        jumlahOrder:         aggregate._count,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil laporan ESG", error: error.message }, { status: 500 });
  }
}
