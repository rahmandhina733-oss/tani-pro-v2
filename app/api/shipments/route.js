import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/shipments  — list with filters: orderId, vehicleId, status, page, limit
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const where = {};
    if (searchParams.get("orderId"))   where.orderId   = searchParams.get("orderId");
    if (searchParams.get("vehicleId")) where.vehicleId = searchParams.get("vehicleId");
    if (searchParams.get("status"))    where.status    = searchParams.get("status");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          order: { select: { id: true, totalHarga: true, totalBeratKg: true,
            pembeli: { select: { namaPerusahaan: true } } } },
          vehicle: { select: { id: true, platNomor: true, tipe: true, supirNama: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shipment.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: shipments,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[GET /api/shipments]", error);
    return NextResponse.json({ success: false, pesan: "Gagal mengambil shipment", error: error.message }, { status: 500 });
  }
}

// POST /api/shipments — create shipment for an order
// Body: { orderId, vehicleId?, titikAsal, titikTujuan, jarakKm?, estimasiJamTiba? }
export async function POST(request) {
  try {
    const { orderId, vehicleId, titikAsal, titikTujuan, jarakKm, estimasiJamTiba } = await request.json();
    if (!orderId || !titikAsal || !titikTujuan)
      return NextResponse.json({ success: false, pesan: "Field wajib: orderId, titikAsal, titikTujuan" }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { shipment: true } });
    if (!order) return NextResponse.json({ success: false, pesan: "Order tidak ditemukan" }, { status: 404 });
    if (order.shipment) return NextResponse.json({ success: false, pesan: "Order sudah memiliki shipment" }, { status: 409 });

    const shipment = await prisma.$transaction(async (tx) => {
      const s = await tx.shipment.create({
        data: {
          orderId, vehicleId: vehicleId ?? null, titikAsal, titikTujuan,
          jarakKm: jarakKm ? parseFloat(jarakKm) : null,
          estimasiJamTiba: estimasiJamTiba ? new Date(estimasiJamTiba) : null,
          trackingHistory: [
            { waktu: new Date().toISOString(), status: "MENUNGGU_PICKUP", lokasi: titikAsal, koordinat: null },
          ],
        },
        include: { vehicle: true },
      });
      await tx.order.update({ where: { id: orderId }, data: { status: "DIPROSES" } });
      if (vehicleId) await tx.vehicle.update({ where: { id: vehicleId }, data: { status: "DALAM_PERJALANAN" } });
      return s;
    });
    return NextResponse.json({ success: true, pesan: "Shipment berhasil dibuat", data: shipment }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/shipments]", error);
    return NextResponse.json({ success: false, pesan: "Gagal membuat shipment", error: error.message }, { status: 500 });
  }
}
