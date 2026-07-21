"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useLiveTracking — konsumsi stream posisi armada real-time (FIX TUGAS 1)
 *
 * Pengganti pola `supabase.channel(...).on('postgres_changes', ...)` —
 * di sini memakai `EventSource` native browser terhadap endpoint SSE
 * `/api/orders/[id]/tracking-stream`. Begitu koordinat Vehicle berubah di
 * database, `position` di hook ini ikut berubah TANPA polling manual dari
 * komponen dan TANPA refresh halaman.
 *
 * @param {string|null} orderId
 * @returns {{
 *   position: {lat,lng,updatedAt,shipmentStatus} | null,  // null = belum ada data GPS nyata
 *   connected: boolean,   // status koneksi SSE
 *   done: boolean,        // shipment sudah TERKIRIM, stream ditutup server
 *   error: string|null,
 * }}
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function useLiveTracking(orderId) {
  const [position, setPosition] = useState(null);
  const [connected, setConnected] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const esRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    const es = new EventSource(`/api/orders/${orderId}/tracking-stream`);
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.addEventListener("position", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
          setPosition(data);
          setError(null);
        }
      } catch {
        /* frame korup — abaikan, tunggu frame berikutnya */
      }
    });

    es.addEventListener("error", (e) => {
      try {
        const data = JSON.parse(e.data);
        setError(data.pesan ?? "Gagal memuat posisi armada.");
      } catch {
        /* event 'error' bawaan EventSource (koneksi putus) — sudah ditangani onerror */
      }
    });

    es.addEventListener("done", () => {
      setDone(true);
      es.close();
    });

    return () => es.close();
  }, [orderId]);

  return { position, connected, done, error };
}
