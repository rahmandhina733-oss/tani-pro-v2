import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders/[id]
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        pembeli: {
          include: {
            user: { select: { nama: true, email: true, telepon: true, avatarUrl: true } },
          },
        },
        items: {
          include: {
            produk: {
              include: {
                petani: {
                  select: {
                    namaKebun: true,
                    provinsi: true,
                    kabupaten: true,
                    user: { select: { nama: true, telepon: true } },
                  },
                },
              },
            },
          },
        },
        shipment: {
          include: { vehicle: true },
        },
        escrow: true,
        esgRecord: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, pesan: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("[GET /api/orders/[id]]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal mengambil detail order", error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/orders/[id]
// Body: { status, catatanKhusus, estimasiTiba, fleetRekomendasi }
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const { status, catatanKhusus, estimasiTiba, fleetRekomendasi } = body;

    const VALID_STATUSES = ["PENDING","DIBAYAR","DIPROSES","DIKIRIM","DITERIMA","DIBATALKAN","SENGKETA"];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, pesan: `Status tidak valid. Pilihan: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (catatanKhusus !== undefined) updateData.catatanKhusus = catatanKhusus;
    if (estimasiTiba) updateData.estimasiTiba = new Date(estimasiTiba);
    if (fleetRekomendasi) updateData.fleetRekomendasi = fleetRekomendasi;

    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: params.id },
        data: updateData,
      });

      // Auto-update escrow when order is DIBAYAR
      if (status === "DIBAYAR") {
        await tx.escrow.updateMany({
          where: { orderId: params.id, status: "MENUNGGU" },
          data: { status: "TERKUNCI", terkunciPada: new Date() },
        });
      }

      // Auto-release escrow when DITERIMA
      if (status === "DITERIMA") {
        await tx.escrow.updateMany({
          where: { orderId: params.id, status: "TERKUNCI" },
          data: { status: "DILEPAS", dilepaskanPada: new Date() },
        });
      }

      // Refund escrow when DIBATALKAN
      if (status === "DIBATALKAN") {
        await tx.escrow.updateMany({
          where: { orderId: params.id, status: { in: ["MENUNGGU","TERKUNCI"] } },
          data: { status: "DIKEMBALIKAN", dikembalikanPada: new Date() },
        });

        // Restore stock
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: params.id },
          include: { produk: true },
        });
        for (const item of orderItems) {
          if (item.produk.status === "AKTIF") {
            await tx.produk.update({
              where: { id: item.produkId },
              data: { stokKg: { increment: item.jumlahKg } },
            });
          }
        }
      }

      // Notify buyer on status change
      const orderFull = await tx.order.findUnique({
        where: { id: params.id },
        select: { pembeli: { select: { userId: true } } },
      });
      if (orderFull?.pembeli?.userId && status) {
        const notifMap = {
          DIBAYAR:     { judul: "Pembayaran Dikonfirmasi", pesan: "Dana escrow Anda berhasil dikunci. Pesanan sedang diproses." },
          DIKIRIM:     { judul: "Pesanan Dikirim", pesan: "Pesanan Anda sedang dalam perjalanan. Cek tracking untuk update." },
          DITERIMA:    { judul: "Pesanan Diterima", pesan: "Terima kasih! Dana escrow telah dilepaskan ke petani." },
          DIBATALKAN:  { judul: "Pesanan Dibatalkan", pesan: "Pesanan Anda telah dibatalkan. Dana escrow akan dikembalikan." },
          SENGKETA:    { judul: "Sengketa Dibuka", pesan: "Sengketa pesanan Anda sedang ditinjau oleh admin TaniPro." },
        };
        if (notifMap[status]) {
          await tx.notifikasi.create({
            data: {
              userId: orderFull.pembeli.userId,
              ...notifMap[status],
              tipe: "ORDER",
              refId: params.id,
            },
          });
        }
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      pesan: `Status order diperbarui ke ${status ?? "sesuai perubahan"}`,
      data: order,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, pesan: "Order tidak ditemukan" },
        { status: 404 }
      );
    }
    console.error("[PATCH /api/orders/[id]]", error);
    return NextResponse.json(
      { success: false, pesan: "Gagal memperbarui order", error: error.message },
      { status: 500 }
    );
  }
}
