import prisma from "@/lib/prisma";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GET /api/orders/[id]/tracking-stream — Server-Sent Events (SSE)
 *
 * FIX TUGAS 1: brief meminta "Supabase Realtime channel" untuk mendengarkan
 * perubahan currentLat/currentLng armada. Proyek ini TIDAK memakai Supabase
 * (100% Prisma + PostgreSQL — dicek langsung di schema.prisma). SSE native
 * Next.js ini adalah penggantinya: setiap ~4 detik, server membaca ulang
 * `Vehicle.latitudeSaat/longitudeSaat` (field yang sudah ada di skema) untuk
 * armada pada Shipment milik Order ini, dan mem-push ke client tanpa client
 * perlu polling/refresh — hasil akhirnya sama seperti channel Supabase:
 * UI ter-update otomatis begitu koordinat berubah di database.
 *
 * Sumber update koordinat: PATCH /api/vehicles/[id] (endpoint yang sudah ada)
 * — dipanggil oleh app sopir / simulator GPS setiap kali posisi bergerak.
 *
 * Event yang dikirim:
 *   event: position → { lat, lng, updatedAt, vehicleId, shipmentStatus }
 *   event: ping      → heartbeat setiap 15s (menjaga koneksi/proxy)
 *   event: done       → dikirim sekali saat shipment sudah TERKIRIM, lalu stream ditutup
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 4000;
const HEARTBEAT_INTERVAL_MS = 15000;

export async function GET(request, { params }) {
  const orderId = params.id;
  const encoder = new TextEncoder();

  let pollTimer = null;
  let heartbeatTimer = null;
  let lastSentKey = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // controller sudah ditutup (client disconnect) — abaikan.
        }
      };

      const closeAll = () => {
        if (pollTimer) clearInterval(pollTimer);
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        try {
          controller.close();
        } catch {
          /* sudah tertutup */
        }
      };

      async function pollPosition() {
        try {
          const shipment = await prisma.shipment.findUnique({
            where: { orderId },
            include: { vehicle: true },
          });

          if (!shipment || !shipment.vehicle) {
            send("error", { pesan: "Belum ada armada terpasang untuk pesanan ini." });
            return;
          }

          const v = shipment.vehicle;
          if (Number.isFinite(v.latitudeSaat) && Number.isFinite(v.longitudeSaat)) {
            const key = `${v.latitudeSaat},${v.longitudeSaat},${v.lastGpsUpdate?.toISOString() ?? ""}`;
            // Hanya kirim frame baru jika koordinat benar-benar berubah
            // (hemat bandwidth — mirip semantik "on change" Supabase Realtime).
            if (key !== lastSentKey) {
              lastSentKey = key;
              send("position", {
                lat: v.latitudeSaat,
                lng: v.longitudeSaat,
                updatedAt: v.lastGpsUpdate,
                vehicleId: v.id,
                shipmentStatus: shipment.status,
              });
            }
          }

          if (shipment.status === "TERKIRIM") {
            send("done", { pesan: "Pengiriman selesai." });
            closeAll();
          }
        } catch (error) {
          send("error", { pesan: "Gagal membaca posisi armada", detail: error.message });
        }
      }

      // Kirim posisi awal segera, lalu polling berkala.
      await pollPosition();
      pollTimer = setInterval(pollPosition, POLL_INTERVAL_MS);
      heartbeatTimer = setInterval(() => send("ping", { t: Date.now() }), HEARTBEAT_INTERVAL_MS);

      // Bersihkan timer begitu client memutus koneksi (tutup tab, navigasi keluar, dst).
      request.signal.addEventListener("abort", closeAll);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // matikan buffering proxy (mis. Nginx) untuk SSE
    },
  });
}
