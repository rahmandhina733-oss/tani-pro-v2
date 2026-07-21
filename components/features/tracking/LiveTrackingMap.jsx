"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LiveTrackingMap — Komponen Peta Universal (react-leaflet)
 *
 * Dipakai oleh: /pembeli/pesanan/[id] (truk → pabrik pembeli) dan
 * /petani/pesanan/[id] (truk pool → lahan petani).
 *
 * PENTING — CARA IMPORT DI HALAMAN:
 * Leaflet mengakses `window` saat module load, sehingga komponen ini WAJIB
 * di-import secara dinamis tanpa SSR:
 *
 *   const LiveTrackingMap = dynamic(
 *     () => import("@/components/features/tracking/LiveTrackingMap"),
 *     { ssr: false }
 *   );
 *
 * Props:
 *   origin          {lat, lng, label}   titik awal rute
 *   destination     {lat, lng, label}   titik tujuan rute
 *   currentLocation {lat, lng}?         posisi truk awal (opsional; kalau
 *                                       kosong, mulai dari `initialProgress`)
 *   waypoints       [{lat,lng}]?        titik antara agar polyline realistis
 *   speedKmh        number?             kecepatan simulasi "dunia nyata" (60)
 *   simMinutesPerSecond number?         kompresi waktu: berapa menit perjalanan
 *                                       berlalu per 1 detik nyata (default 4 —
 *                                       supaya pergerakan terlihat saat demo)
 *   initialProgress number?             0..1, dipakai bila currentLocation kosong
 *   onProgressChange (progress, pos)=>void  callback tiap tick — dipakai panel
 *                                       samping untuk ETA & progress bar sinkron
 *
 * Simulasi VMS: useEffect + setInterval menggeser posisi truk di sepanjang
 * polyline (origin → waypoints → destination) hingga progress = 1.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ============================================================
   GEO HELPERS
   ============================================================ */

/** Jarak haversine antar dua titik (km). */
function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Bangun path + panjang kumulatif per segmen. */
function buildPath(origin, waypoints, destination) {
  const pts = [origin, ...waypoints, destination];
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + haversineKm(pts[i - 1], pts[i]));
  }
  return { pts, cum, totalKm: cum[cum.length - 1] };
}

/** Interpolasi posisi pada progress p (0..1) di sepanjang path. */
function pointAtProgress(path, p) {
  const target = Math.min(Math.max(p, 0), 1) * path.totalKm;
  for (let i = 1; i < path.pts.length; i++) {
    if (target <= path.cum[i] || i === path.pts.length - 1) {
      const segLen = path.cum[i] - path.cum[i - 1] || 1e-9;
      const t = (target - path.cum[i - 1]) / segLen;
      const a = path.pts[i - 1];
      const b = path.pts[i];
      return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
    }
  }
  return path.pts[path.pts.length - 1];
}

/** Estimasi progress awal dari currentLocation: rasio jarak-dari-origin. */
function progressFromLocation(path, loc) {
  if (!loc) return null;
  const dFromOrigin = haversineKm(path.pts[0], loc);
  return Math.min(Math.max(dFromOrigin / path.totalKm, 0), 0.98);
}

/* ============================================================
   MARKER ICONS (L.divIcon — menghindari masalah default icon
   leaflet yang gambar PNG-nya tidak ter-bundle oleh Next.js)
   ============================================================ */
const originIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:9999px;background:#10b981;border:3px solid rgba(16,185,129,.3);box-shadow:0 0 12px rgba(16,185,129,.7)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center">
    <div style="width:26px;height:26px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:#0f172a;border:2px solid #34d399;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(16,185,129,.5)">
      <div style="transform:rotate(45deg);font-size:12px">🏁</div>
    </div>
  </div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const truckIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;width:38px;height:38px">
    <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(16,185,129,.25);animation:tanipro-ping 1.8s ease-out infinite"></div>
    <div style="position:absolute;inset:4px;border-radius:9999px;background:rgba(2,6,23,.9);border:2px solid #34d399;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 16px rgba(16,185,129,.6)">🚚</div>
  </div>
  <style>@keyframes tanipro-ping{0%{transform:scale(.6);opacity:.9}80%,100%{transform:scale(1.7);opacity:0}}</style>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

/** Fit peta ke seluruh rute saat pertama render. */
function FitToRoute({ points }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [36, 36] });
  }, [map, points]);
  return null;
}

/* ============================================================
   KOMPONEN UTAMA
   ============================================================ */
export default function LiveTrackingMap({
  origin,
  destination,
  currentLocation = null,
  waypoints = [],
  speedKmh = 60,
  simMinutesPerSecond = 4,
  initialProgress = 0,
  onProgressChange,
}) {
  const path = useMemo(
    () => buildPath(origin, waypoints, destination),
    [origin, destination, waypoints]
  );

  const startProgress = useMemo(() => {
    return progressFromLocation(path, currentLocation) ?? initialProgress;
  }, [path, currentLocation, initialProgress]);

  const [progress, setProgress] = useState(startProgress);
  const [truckPos, setTruckPos] = useState(() => pointAtProgress(path, startProgress));

  // Simpan callback di ref agar interval tidak perlu dibuat ulang tiap render.
  const cbRef = useRef(onProgressChange);
  useEffect(() => {
    cbRef.current = onProgressChange;
  }, [onProgressChange]);

  /* ── SIMULASI REALTIME VMS ──
     Tiap 1 detik nyata = `simMinutesPerSecond` menit perjalanan.
     Δprogress = (speedKmh × jamPerTick) / totalKm. Berhenti di 1. */
  useEffect(() => {
    const hoursPerTick = simMinutesPerSecond / 60;
    const deltaPerTick = (speedKmh * hoursPerTick) / path.totalKm;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + deltaPerTick, 1);
        const pos = pointAtProgress(path, next);
        setTruckPos(pos);
        cbRef.current?.(next, pos);
        if (next >= 1) clearInterval(interval);
        return next;
      });
    }, 1000);

    // Laporkan posisi awal sekali agar panel samping langsung sinkron.
    cbRef.current?.(startProgress, pointAtProgress(path, startProgress));

    return () => clearInterval(interval);
  }, [path, speedKmh, simMinutesPerSecond, startProgress]);

  const routePositions = path.pts.map((p) => [p.lat, p.lng]);
  const traveled = useMemo(() => {
    // Polyline hijau: bagian rute yang sudah ditempuh (origin → posisi truk)
    const pts = [];
    for (let i = 0; i < path.pts.length; i++) {
      if (path.cum[i] <= progress * path.totalKm) pts.push([path.pts[i].lat, path.pts[i].lng]);
    }
    pts.push([truckPos.lat, truckPos.lng]);
    return pts;
  }, [path, progress, truckPos]);

  return (
    /* relative + z-0 + isolate: kunci stacking context agar pane leaflet
       (z-index internal 200–700) tidak menimpa Navbar sticky (z-50). */
    <div className="relative z-0 isolate h-full w-full overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={[truckPos.lat, truckPos.lng]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#020617" }}
      >
        {/* Tile gelap (CARTO dark) agar menyatu dengan tema slate-950 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitToRoute points={path.pts} />

        {/* Rute penuh (redup) + rute tertempuh (emerald) */}
        <Polyline
          positions={routePositions}
          pathOptions={{ color: "#334155", weight: 4, dashArray: "6 8" }}
        />
        <Polyline
          positions={traveled}
          pathOptions={{ color: "#10b981", weight: 4, opacity: 0.9 }}
        />

        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup>{origin.label ?? "Titik Awal"}</Popup>
        </Marker>
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>{destination.label ?? "Tujuan"}</Popup>
        </Marker>
        <Marker position={[truckPos.lat, truckPos.lng]} icon={truckIcon}>
          <Popup>
            Posisi armada — {Math.round(progress * 100)}% rute
            <br />
            Update VMS tiap detik (simulasi)
          </Popup>
        </Marker>
      </MapContainer>

      {/* Badge overlay "LIVE" */}
      <div className="pointer-events-none absolute left-3 top-3 z-[500] flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-slate-950/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-[11px] font-semibold tracking-wide text-emerald-400">
          LIVE VMS
        </span>
      </div>
    </div>
  );
}
