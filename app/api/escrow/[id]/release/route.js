import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hitungPointPetani } from "@/lib/utils";

// POST /api/escrow/[id]/release — Admin manually releases escrow funds
// Body: { alasan? }
export async function POST(request, { params }) {
  try {
    const { alasan } = await request.json().catch(() => ({}));

    const escrow = await prisma.escrow.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            items: {
              include: { produk: { include: { petani: { include: { user: true } } } } },
            },
          },
        },
      },
    });

    if (!escrow) return NextResponse.json({ success: false, pesan: "Escrow tidak ditemukan" }, { status: 404 });
    if (escrow.status !== "TERKUNCI")
      return NextResponse.json({ success: false, pesan: `Escrow hanya bisa dilepas jika TERKUNCI. Status saat ini: ${escrow.status}` }, { status: 400 });

    await prisma.$transaction(async (tx) => {
      await tx.escrow.update({ where: { id: params.id }, data: { status: "DILEPAS", dilepaskanPada: new Date() } });
      await tx.order.update({ where: { id: escrow.orderId }, data: { status: "DITERIMA" } });

      // Award Tani Point to each farmer
      for (const item of escrow.order.items) {
        const petani = item.produk.petani;
        const poin = hitungPointPetani(item.jumlahKg);
        if (poin > 0) {
          const tp = await tx.taniPoint.upsert({
            where: { userId: petani.userId },
            update: { totalPoin: { increment: poin } },
            create: { userId: petani.userId, totalPoin: poin },
          });
          await tx.taniPointTx.create({
            data: { taniPointId: tp.id, jumlah: poin,
              keterangan: `Penjualan ${item.jumlahKg} kg — Order #${escrow.orderId.slice(-6).toUpperCase()}`,
              referensiId: escrow.orderId },
          });
          // Update petani total sales
          await tx.petaniProfile.update({ where: { id: petani.id }, data: { totalPenjualan: { increment: item.jumlahKg } } });
        }

        // Notify petani
        await tx.notifikasi.create({
          data: { userId: petani.userId,
            judul: "Dana Diterima",
            pesan: `Dana Rp ${escrow.jumlah.toLocaleString("id-ID")} dari Order #${escrow.orderId.slice(-6).toUpperCase()} telah dikirim ke akun Anda.`,
            tipe: "PAYMENT", refId: escrow.orderId },
        });
      }
    });

    return NextResponse.json({ success: true, pesan: "Dana escrow berhasil dilepaskan ke petani", data: { escrowId: params.id, status: "DILEPAS" } });
  } catch (error) {
    console.error("[POST /api/escrow/[id]/release]", error);
    return NextResponse.json({ success: false, pesan: "Gagal melepas dana escrow", error: error.message }, { status: 500 });
  }
}
