'use client';

import { memo } from 'react';
import { Gauge, Lock } from 'lucide-react';
import { ORIGIN_LOCATION, PICKUP_L300, DESTINATION_CITIES, co2ToTrees } from '@/lib/esg';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EsgCalculatorCard — Kartu Kalkulator ESG (Jejak Karbon Real-time)
 *
 * FIX P0 (Focus-loss Bug):
 * Sebelumnya komponen ini dideklarasikan DI DALAM `CheckoutPage`, sehingga
 * setiap re-render induk membuat definisi komponen BARU → React meng-unmount
 * dan me-remount seluruh subtree → input "Jarak Tempuh" kehilangan fokus
 * setiap kali user mengetik 1 karakter.
 *
 * Solusi: ekstrak menjadi komponen top-level murni-props (di-memo).
 * Semua state tetap di CheckoutPage; komponen ini hanya menerima props.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @param {object}   props
 * @param {string}   props.destination        Nama kota tujuan terpilih
 * @param {Function} props.onDestinationChange Handler onChange <select> tujuan
 * @param {string}   props.distanceKm         Nilai input jarak (string, controlled)
 * @param {Function} props.onDistanceKmChange Handler onChange input jarak
 * @param {object}   props.esg                Hasil `calculateEsg` dari lib/esg
 * @param {number}   props.totalWeightKg      Total muatan (kg)
 * @param {number}   props.totalWeightTon     Total muatan (Ton)
 */
function EsgCalculatorCard({
  destination,
  onDestinationChange,
  distanceKm,
  onDistanceKmChange,
  esg,
  totalWeightKg,
  totalWeightTon,
}) {
  // Lebar bar perbandingan (relatif terhadap emisi terbesar)
  const maxEmission = Math.max(esg.E_conv, esg.E_tp, 0.0001);
  const convBarWidth = esg.valid ? (esg.E_conv / maxEmission) * 100 : 0;
  const tpBarWidth = esg.valid ? (esg.E_tp / maxEmission) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-teal-500/5 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(16,185,129,0.25)]">
      {/* dekorasi glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md">
            <Gauge className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
          </div>
          <h2 className="text-base font-semibold text-slate-100">Kalkulator ESG — Jejak Karbon Real-time</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Simulasi emisi CO₂e berbasis VMS (Vehicle Management System) TaniPro
        </p>

        {/* --- Input Rute --- */}
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          {/* Origin (dikunci) */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Titik Awal (Origin)</label>
            <div className="flex items-center gap-2 w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-md">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2} />
              <span className="text-sm text-slate-300 truncate">{ORIGIN_LOCATION}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-emerald-500/70 font-semibold flex-shrink-0">Terkunci</span>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Titik Tujuan (Destination)</label>
            <select
              value={destination}
              onChange={onDestinationChange}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition backdrop-blur-md appearance-none [&>option]:bg-slate-900"
            >
              <option value="" disabled>Pilih kota tujuan...</option>
              {DESTINATION_CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Jarak Tempuh (D) */}
        <div className="mb-5">
          <label className="text-xs font-medium text-slate-400 block mb-1.5">
            Jarak Tempuh — D (KM) <span className="text-slate-600">· dari {ORIGIN_LOCATION}</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="1"
              value={distanceKm}
              onChange={onDistanceKmChange}
              placeholder="Masukkan jarak dalam kilometer..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 pr-14 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition backdrop-blur-md"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">KM</span>
          </div>
          {esg.valid && (
            <p className="text-[11px] text-teal-500 mt-1.5">
              ⚡ Rute teroptimasi VMS: <span className="font-semibold text-teal-400">{esg.D_opt.toFixed(1)} km</span> (hemat 30% jarak)
            </p>
          )}
        </div>

        {/* --- Hasil Kalkulasi --- */}
        {esg.valid ? (
          <>
            {/* Perbandingan bar */}
            <div className="space-y-4 mb-5">
              {/* Konvensional */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛻</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Konvensional — {PICKUP_L300.name}</p>
                      <p className="text-[10px] text-slate-600">
                        {esg.tripsConv}× trip · {esg.D.toFixed(0)} km · EF {PICKUP_L300.emissionFactor}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-rose-400">{esg.E_conv.toFixed(2)} kg CO₂e</span>
                </div>
                <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out"
                    style={{ width: `${convBarWidth}%` }}
                  />
                </div>
              </div>

              {/* TaniPro */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{esg.fleet.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        TaniPro Smart Load — {esg.fleet.name}
                        <span className="ml-1.5 text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">Otomatis</span>
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {esg.tripsTp}× trip · {esg.D_opt.toFixed(1)} km (VMS) · EF {esg.fleet.emissionFactor}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{esg.E_tp.toFixed(2)} kg CO₂e</span>
                </div>
                <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out"
                    style={{ width: `${tpBarWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Penghematan — MENCOLOK */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 backdrop-blur-lg p-5 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.25),transparent_60%)]" />
              <p className="relative text-[11px] uppercase tracking-widest text-emerald-500 font-semibold mb-1">
                Total Penghematan Karbon
              </p>
              <p className="relative text-4xl font-extrabold text-emerald-400 tabular-nums drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                {esg.saved.toFixed(2)}
                <span className="text-lg font-semibold text-emerald-500/80 ml-1.5">kg CO₂e</span>
              </p>
              <p className="relative text-xs text-teal-500 mt-1.5">
                ↓ {esg.savedPercent.toFixed(1)}% lebih rendah vs pengiriman konvensional
                · setara menanam <span className="font-semibold text-teal-400">{co2ToTrees(esg.saved)} pohon</span>/tahun
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
            <p className="text-sm text-slate-500">
              Masukkan <span className="text-slate-300 font-medium">jarak tempuh (KM)</span> untuk melihat simulasi penghematan emisi karbon secara real-time.
            </p>
          </div>
        )}

        {/* Info muatan */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600 border-t border-white/5 pt-3">
          <span>
            Total muatan: <span className="text-slate-400 font-semibold">{totalWeightTon.toFixed(2)} Ton</span> ({totalWeightKg.toLocaleString('id-ID')} kg)
          </span>
          <span>
            Armada terpilih: <span className="text-emerald-500 font-semibold">{esg.fleet.name} ({esg.fleet.capacity} Ton)</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(EsgCalculatorCard);
