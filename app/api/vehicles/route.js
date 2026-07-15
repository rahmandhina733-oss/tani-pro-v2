import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/vehicles — list all vehicles, filter by tipe, status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const where = {};
    if (searchParams.get("tipe"))   where.tipe   = searchParams.get("tipe");
    if (searchParams.get("status")) where.status = searchParams.get("status");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          shipments: {
            where: { status: "DALAM_PERJALANAN" },
            select: { id: true, orderId: true, titikAsal: true, titikTujuan: true },
          },
          _count: { select: { shipments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: vehicles,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[GET /api/vehicles]", error);
    return NextResponse.json({ success: false, pesan: "Gagal mengambil data kendaraan", error: error.message }, { status: 500 });
  }
}

// POST /api/vehicles — register a new vehicle
export async function POST(request) {
  try {
    const body = await request.json();
    const { platNomor, tipe, kapasitasKg, kapasitasVolM3, supirNama, supirTelepon } = body;
    if (!platNomor || !tipe || !kapasitasKg || !kapasitasVolM3)
      return NextResponse.json({ success: false, pesan: "Field wajib: platNomor, tipe, kapasitasKg, kapasitasVolM3" }, { status: 400 });

    const vehicle = await prisma.vehicle.create({
      data: {
        platNomor: platNomor.toUpperCase(),
        tipe,
        kapasitasKg: parseFloat(kapasitasKg),
        kapasitasVolM3: parseFloat(kapasitasVolM3),
        supirNama: supirNama ?? null,
        supirTelepon: supirTelepon ?? null,
      },
    });
    return NextResponse.json({ success: true, pesan: "Kendaraan berhasil didaftarkan", data: vehicle }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002")
      return NextResponse.json({ success: false, pesan: "Plat nomor sudah terdaftar" }, { status: 409 });
    console.error("[POST /api/vehicles]", error);
    return NextResponse.json({ success: false, pesan: "Gagal mendaftarkan kendaraan", error: error.message }, { status: 500 });
  }
}
