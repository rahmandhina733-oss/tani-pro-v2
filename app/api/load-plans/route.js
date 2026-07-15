import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FLEET_SPECS } from "@/lib/constants";
import { hitungGravimetrikCheck, hitungVolumetrikCheck, hitungVolumeKardus } from "@/lib/utils";

// GET /api/load-plans — list load plans, filter by vehicleId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const where = vehicleId ? { vehicleId } : {};

    const [plans, total] = await Promise.all([
      prisma.loadPlan.findMany({
        where,
        include: { vehicle: { select: { platNomor: true, tipe: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.loadPlan.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: plans,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil load plan", error: error.message }, { status: 500 });
  }
}

// POST /api/load-plans — calculate & store 3D bin packing result
// Body: { vehicleId, orderId?, items: [{ nama, beratKg, panjangCm, lebarCm, tinggiCm }] }
export async function POST(request) {
  try {
    const { vehicleId, orderId, items } = await request.json();
    if (!vehicleId || !items?.length)
      return NextResponse.json({ success: false, pesan: "vehicleId dan items wajib diisi" }, { status: 400 });

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return NextResponse.json({ success: false, pesan: "Kendaraan tidak ditemukan" }, { status: 404 });

    const spec = FLEET_SPECS[vehicle.tipe];

    let beratTotal = 0;
    let volumeTotal = 0;
    const binPackingItems = [];

    // Simplified greedy bin packing (layer by layer)
    let currentX = 0; let currentY = 0; let currentZ = 0;
    let maxHeightInLayer = 0;
    let maxDepthInRow = 0;

    for (const item of items) {
      const berat = parseFloat(item.beratKg);
      const vol   = hitungVolumeKardus({ panjangCm: parseFloat(item.panjangCm), lebarCm: parseFloat(item.lebarCm), tinggiCm: parseFloat(item.tinggiCm) });
      beratTotal  += berat;
      volumeTotal += vol;

      const pM = parseFloat(item.panjangCm) / 100;
      const lM = parseFloat(item.lebarCm)   / 100;
      const tM = parseFloat(item.tinggiCm)  / 100;

      // Simple placement: left-to-right, front-to-back
      if (currentX + pM > spec.panjangBakM) {
        currentX = 0;
        currentZ += maxDepthInRow;
        maxDepthInRow = 0;
      }
      if (currentZ + lM > spec.lebarBakM) {
        currentX = 0; currentZ = 0;
        currentY += maxHeightInLayer;
        maxHeightInLayer = 0;
      }

      binPackingItems.push({
        nama: item.nama,
        beratKg: berat,
        dimensi: { panjangM: pM, lebarM: lM, tinggiM: tM },
        posisi: { x: parseFloat(currentX.toFixed(3)), y: parseFloat(currentY.toFixed(3)), z: parseFloat(currentZ.toFixed(3)) },
      });

      currentX += pM;
      maxDepthInRow  = Math.max(maxDepthInRow, lM);
      maxHeightInLayer = Math.max(maxHeightInLayer, tM);
    }

    const gravitometrik = hitungGravimetrikCheck({ beratKg: beratTotal, fleetTipe: vehicle.tipe });
    const volumetrik    = hitungVolumetrikCheck({ volumeM3: volumeTotal, fleetTipe: vehicle.tipe });
    const efisiensiVol  = Math.min((volumeTotal / vehicle.kapasitasVolM3) * 100, 100);
    const efisiensiBerat = Math.min((beratTotal / vehicle.kapasitasKg) * 100, 100);

    const loadPlan = await prisma.loadPlan.create({
      data: {
        vehicleId,
        orderId: orderId ?? null,
        beratTotalKg: parseFloat(beratTotal.toFixed(2)),
        volumeTotalM3: parseFloat(volumeTotal.toFixed(4)),
        efisiensiPersen: parseFloat(((efisiensiVol + efisiensiBerat) / 2).toFixed(1)),
        beratMaksKg: vehicle.kapasitasKg,
        volumeMaksM3: vehicle.kapasitasVolM3,
        gravitometrikOk: gravitometrik.aman,
        volumetrikOk: volumetrik.aman,
        binPackingResult: binPackingItems,
      },
    });

    return NextResponse.json({
      success: true,
      pesan: "Load plan berhasil dihitung",
      data: { ...loadPlan, gravitometrik, volumetrik, vehicle: { platNomor: vehicle.platNomor, tipe: vehicle.tipe } },
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/load-plans]", error);
    return NextResponse.json({ success: false, pesan: "Gagal menghitung load plan", error: error.message }, { status: 500 });
  }
}
