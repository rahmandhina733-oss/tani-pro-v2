import { createElement } from "react";
import prisma from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import EsgReportDocument from "@/lib/pdf/EsgReportDocument";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GET /api/orders/[id]/esg-report — FIX TUGAS 3
 *
 * Menghasilkan PDF Laporan ESG untuk SATU transaksi yang statusnya sudah
 * 'selesai' (Escrow DILEPAS). Data direkap dari Order + OrderItem + EsgRecord
 * (Prisma) — semuanya nyata, tidak ada mock, sesuai brief.
 *
 * Tombol pemicu: "Unduh Laporan ESG" di app/pembeli/escrow/page.jsx.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        pembeli: { select: { namaPerusahaan: true, industri: true } },
        items: { include: { produk: { select: { nama: true } } } },
        escrow: true,
        esgRecord: true,
      },
    });

    if (!order) {
      return new Response(JSON.stringify({ success: false, pesan: "Pesanan tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Brief: hanya untuk transaksi yang statusnya sudah 'selesai'.
    // Di skema Escrow, "selesai" = status DILEPAS (dana sudah dilepas ke petani).
    if (order.escrow?.status !== "DILEPAS") {
      return new Response(
        JSON.stringify({
          success: false,
          pesan: "Laporan ESG hanya bisa diunduh untuk transaksi yang sudah selesai (dana escrow dilepas).",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buffer = await renderToBuffer(createElement(EsgReportDocument, { order }));

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Laporan-ESG-${order.id}.pdf"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("[GET /api/orders/[id]/esg-report]", error);
    return new Response(
      JSON.stringify({ success: false, pesan: "Gagal membuat laporan ESG", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
