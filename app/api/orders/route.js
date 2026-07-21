import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hitungPointPembeli } from "@/lib/tani-point";
import { calculateEsg, getEsgFleet } from "@/lib/esg";
import { rekomendasiFleet } from "@/lib/fleet";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders
// Query: pembeliId, status, petaniId, page, limit
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pembeliId = searchParams.get("pembeliId");
    const status    = searchParams.get("status");
    const petaniId  = searchParams.get("petaniId"); // filter by items inside order
    const page      = parseInt(searchParams.get("page") ?? "1");
    const limit     = parseInt(searchParams.get("limit") ?? "10");
    const skip      = (page - 1) * limit;

    const where = {};
    if (pembeliId) where.pembeliId = pembeliId;
    if (status && status !== "SEMUA") where.status = status;
    if (petaniId) {
      where.items = { some: { produk: { petaniId } } };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          pembeli: {
            select: { namaPerusahaan: true, user: { select: { nama: true, email: true } } },
          },
          items: {
            include: {
              produk: {
                select: {
                  id: true,
                  nama: true,
                  kategori: true,
                  gambarUrls: true,
                  petani: { select: { namaKebun: true, provinsi: true } },
                },
              },
            },
          },
          shipment: { select: { id: true, status: true, resiNumber: true } },
          escrow: { select: { id: true, status: true, jumlah: true } },
          esgRecord: { select: { co2eDisimpanKg: true, co2eEmisiKg: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal mengambil data order", error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/orders  — Create order + Escrow + ESG record + Tani Point
// Body: {
//   pembeliId, alamatPengiriman, catatanKhusus?,
//   items: [{ produkId, jumlahKg }],
//   jarakKm? (for ESG calc)
// }
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { pembeliId, alamatPengiriman, catatanKhusus, items, jarakKm } = body;

    if (!pembeliId || !alamatPengiriman || !items?.length) {
      return NextResponse.json(
        { success: false, pesan: "Field wajib: pembeliId, alamatPengiriman, items" },
        { status: 400 }
      );
    }

    // Fetch product details & validate stock
    const produkIds = items.map((i) => i.produkId);
    const produkList = await prisma.produk.findMany({
      where: { id: { in: produkIds }, status: { in: ["AKTIF", "PRE_ORDER"] } },
    });

    if (produkList.length !== produkIds.length) {
      return NextResponse.json(
        { success: false, pesan: "Satu atau lebih produk tidak ditemukan atau tidak aktif" },
        { status: 400 }
      );
    }

    // Calculate totals
    let totalHarga = 0;
    let totalBeratKg = 0;
    const orderItems = [];

    for (const item of items) {
      const produk = produkList.find((p) => p.id === item.produkId);

      if (item.jumlahKg < produk.minPesanan) {
        return NextResponse.json({
          success: false,
          pesan: `Pesanan minimum untuk "${produk.nama}" adalah ${produk.minPesanan} kg`,
        }, { status: 400 });
      }

      if (produk.status === "AKTIF" && item.jumlahKg > produk.stokKg) {
        return NextResponse.json({
          success: false,
          pesan: `Stok tidak cukup untuk "${produk.nama}". Tersedia: ${produk.stokKg} kg`,
        }, { status: 400 });
      }

      const subtotal = parseFloat(item.jumlahKg) * produk.hargaPerKg;
      totalHarga += subtotal;
      totalBeratKg += parseFloat(item.jumlahKg);

      orderItems.push({
        produkId: produk.id,
        jumlahKg: parseFloat(item.jumlahKg),
        hargaUnit: produk.hargaPerKg,
        subtotal,
      });
    }

    // Fleet recommendation
    const { terpilih: fleetTerpilih } = rekomendasiFleet(totalBeratKg, 0);

    // Execute everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          pembeliId,
          alamatPengiriman,
          catatanKhusus: catatanKhusus ?? null,
          totalHarga,
          totalBeratKg,
          fleetRekomendasi: fleetTerpilih?.tipe ?? null,
          status: "PENDING",
          items: { create: orderItems },
        },
        include: { items: true },
      });

      // 2. Decrement stock for AKTIF products
      for (const item of items) {
        const produk = produkList.find((p) => p.id === item.produkId);
        if (produk.status === "AKTIF") {
          await tx.produk.update({
            where: { id: produk.id },
            data: { stokKg: { decrement: parseFloat(item.jumlahKg) } },
          });
        }
      }

      // 3. Create Escrow record
      const virtualAccount = `VA${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const escrow = await tx.escrow.create({
        data: {
          orderId: order.id,
          jumlah: totalHarga,
          status: "MENUNGGU",
          virtualAccount,
          bankTujuan: "BCA Virtual Account",
        },
      });

      // 4. Create ESG record if distance provided
      //    SSOT: rumus & data armada dari lib/esg.js — identik dengan
      //    kalkulator ESG di halaman checkout (frontend).
      //    E_conv = ceil(W/C_pickup) × D × EF_pickup   (baseline L300)
      //    E_tp   = ceil(W/C_armada) × (D×0.7) × EF_armada
      let esgRecord = null;
      if (jarakKm && fleetTerpilih) {
        const beratTon = totalBeratKg / 1000; // rumus ESG memakai satuan Ton
        const fleetEsg = getEsgFleet(fleetTerpilih.tipe);
        const esg = calculateEsg(beratTon, parseFloat(jarakKm), fleetEsg);
        if (esg.valid) {
          esgRecord = await tx.esgRecord.create({
            data: {
              orderId: order.id,
              co2eDisimpanKg: parseFloat(esg.saved.toFixed(2)),
              co2eEmisiKg: parseFloat(esg.E_tp.toFixed(2)),
              jarakKm: parseFloat(jarakKm),
              fleetTipe: fleetTerpilih.tipe,
              perbandinganBaseline: parseFloat(esg.E_conv.toFixed(2)),
            },
          });
        }
      }

      // 5. Award Tani Point to buyer
      const poinDidapat = hitungPointPembeli(totalHarga);
      if (poinDidapat > 0) {
        const taniPoint = await tx.taniPoint.upsert({
          where: { userId: (await tx.pembeliProfile.findUnique({ where: { id: pembeliId }, select: { userId: true } })).userId },
          update: { totalPoin: { increment: poinDidapat } },
          create: {
            userId: (await tx.pembeliProfile.findUnique({ where: { id: pembeliId }, select: { userId: true } })).userId,
            totalPoin: poinDidapat,
          },
        });

        await tx.taniPointTx.create({
          data: {
            taniPointId: taniPoint.id,
            jumlah: poinDidapat,
            keterangan: `Pembelian Order #${order.id.slice(-6).toUpperCase()}`,
            referensiId: order.id,
          },
        });
      }

      // 6. Create notification for buyer
      const pembeliUser = await tx.pembeliProfile.findUnique({
        where: { id: pembeliId },
        select: { userId: true },
      });
      await tx.notifikasi.create({
        data: {
          userId: pembeliUser.userId,
          judul: "Order Berhasil Dibuat",
          pesan: `Order senilai Rp ${totalHarga.toLocaleString("id-ID")} sedang menunggu pembayaran escrow.`,
          tipe: "ORDER",
          refId: order.id,
        },
      });

      return { order, escrow, esgRecord, poinDidapat };
    });

    return NextResponse.json(
      {
        success: true,
        pesan: "Order berhasil dibuat",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal membuat order", error: error.message },
      { status: 500 }
    );
  }
}
