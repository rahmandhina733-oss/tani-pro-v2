import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/vehicles/[id]
export async function GET(request, { params }) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        shipments: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { order: { select: { id: true, totalBeratKg: true, pembeli: { select: { namaPerusahaan: true } } } } },
        },
        loadPlans: { orderBy: { createdAt: "desc" }, take: 5 },
        _count: { select: { shipments: true } },
      },
    });
    if (!vehicle) return NextResponse.json({ success: false, pesan: "Kendaraan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil detail kendaraan", error: error.message }, { status: 500 });
  }
}

// PATCH /api/vehicles/[id] — update status, GPS, or driver info
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const updateData = {};
    if (body.status)         updateData.status = body.status;
    if (body.supirNama)      updateData.supirNama = body.supirNama;
    if (body.supirTelepon)   updateData.supirTelepon = body.supirTelepon;
    if (body.latitudeSaat !== undefined)  updateData.latitudeSaat = parseFloat(body.latitudeSaat);
    if (body.longitudeSaat !== undefined) updateData.longitudeSaat = parseFloat(body.longitudeSaat);
    if (body.latitudeSaat || body.longitudeSaat) updateData.lastGpsUpdate = new Date();

    const vehicle = await prisma.vehicle.update({ where: { id: params.id }, data: updateData });
    return NextResponse.json({ success: true, pesan: "Kendaraan diperbarui", data: vehicle });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ success: false, pesan: "Kendaraan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: false, pesan: "Gagal memperbarui kendaraan", error: error.message }, { status: 500 });
  }
}
