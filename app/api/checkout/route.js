import { NextResponse } from "next/server";
import { rekomendasiFleet, hitungESG, hitungVolumeKardus } from "@/lib/utils";

// POST /api/checkout — Simulate fleet recommendation & ESG BEFORE ordering
// Body: { items: [{ jumlahKg, beratSatuan?, panjangCm?, lebarCm?, tinggiCm? }], jarakKm }
export async function POST(request) {
  try {
    const body = await request.json();
    const { items, jarakKm } = body;

    if (!items?.length) {
      return NextResponse.json(
        { success: false, pesan: "Minimal 1 item diperlukan" },
        { status: 400 }
      );
    }

    let totalBeratKg = 0;
    let totalVolumeM3 = 0;

    for (const item of items) {
      const berat = parseFloat(item.jumlahKg ?? 0);
      totalBeratKg += berat;

      if (item.panjangCm && item.lebarCm && item.tinggiCm) {
        const volSatuanM3 = hitungVolumeKardus({
          panjangCm: parseFloat(item.panjangCm),
          lebarCm: parseFloat(item.lebarCm),
          tinggiCm: parseFloat(item.tinggiCm),
        });
        const jumlahPaket = item.beratSatuan
          ? Math.ceil(berat / parseFloat(item.beratSatuan))
          : 1;
        totalVolumeM3 += volSatuanM3 * jumlahPaket;
      }
    }

    const fleetResult = rekomendasiFleet(totalBeratKg, totalVolumeM3);

    const esgPerFleet = {};
    if (jarakKm) {
      for (const fleet of fleetResult.semua) {
        esgPerFleet[fleet.tipe] = hitungESG({
          beratKg: totalBeratKg,
          jarakKm: parseFloat(jarakKm),
          fleetTipe: fleet.tipe,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ringkasan: {
          totalBeratKg: parseFloat(totalBeratKg.toFixed(2)),
          totalVolumeM3: parseFloat(totalVolumeM3.toFixed(4)),
          jarakKm: jarakKm ? parseFloat(jarakKm) : null,
        },
        fleet: fleetResult,
        esg: esgPerFleet,
      },
    });
  } catch (error) {
    console.error("[POST /api/checkout]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal memproses simulasi checkout", error: error.message },
      { status: 500 }
    );
  }
}
