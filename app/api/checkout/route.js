import { NextResponse } from "next/server";
import { hitungVolumeKardus } from "@/lib/cargo";
import { calculateEsg, getEsgFleet } from "@/lib/esg";
import { rekomendasiFleet } from "@/lib/fleet";

// POST /api/checkout — Simulate fleet recommendation & ESG BEFORE ordering
// Body: { items: [{ jumlahKg, beratSatuan?, panjangCm?, lebarCm?, tinggiCm? }], jarakKm }
//
// FIX P0 (ESG Engine Conflict): route ini kini memakai SSOT yang sama dengan
// frontend checkout — data armada dari lib/esg.js (TANIPRO_FLEETS) dan
// rumus `calculateEsg` (baseline Pick-up L300 + optimasi rute VMS 30%),
// menggantikan rumus lama `hitungESG` di lib/utils yang hasilnya berbeda.
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

    // Simulasi ESG per armada — rumus identik dengan kalkulator di frontend
    const esgPerFleet = {};
    if (jarakKm) {
      const beratTon = totalBeratKg / 1000;
      for (const fleet of fleetResult.semua) {
        const esg = calculateEsg(beratTon, parseFloat(jarakKm), getEsgFleet(fleet.tipe));
        esgPerFleet[fleet.tipe] = esg.valid
          ? {
              emisiAktualKg: parseFloat(esg.E_tp.toFixed(2)),
              emisiBaselineKg: parseFloat(esg.E_conv.toFixed(2)),
              co2eDisimpanKg: parseFloat(esg.saved.toFixed(2)),
              penghematanPersen: parseFloat(esg.savedPercent.toFixed(1)),
              jarakOptimasiKm: parseFloat(esg.D_opt.toFixed(1)),
              tripsKonvensional: esg.tripsConv,
              tripsTaniPro: esg.tripsTp,
              metodologi: "SSOT lib/esg.js — baseline Pick-up L300, VMS -30% jarak",
            }
          : null;
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
