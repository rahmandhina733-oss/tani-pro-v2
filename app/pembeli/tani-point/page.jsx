'use client';

import { useState } from 'react';
import Link from 'next/link';

const LEVELS = [
  { name: 'Benih', min: 0, color: '#94a3b8', badge: '🌱' },
  { name: 'Tunas', min: 500, color: '#34d399', badge: '🌿' },
  { name: 'Petani', min: 2000, color: '#60a5fa', badge: '🌾' },
  { name: 'Maestro', min: 5000, color: '#f59e0b', badge: '🏆' },
];

const TOTAL_POIN = 4250;
const DISKON_PER_POIN = 100; // Rp per poin
const MIN_TUKAR = 500;

const RIWAYAT = [
  { id: 'tx1', label: 'Pembelian Order #ORD-7902 — Rp15.000.000', poin: 15000, tanggal: '14 Jul 2026' },
  { id: 'tx2', label: 'Pembelian Order #ORD-7895 — Rp25.000.000', poin: 25000, tanggal: '11 Jul 2026' },
  { id: 'tx3', label: 'Ditukar diskon Checkout #ORD-7841', poin: -8000, tanggal: '9 Jul 2026' },
  { id: 'tx4', label: 'Bonus onboarding pembeli baru', poin: 1000, tanggal: '18 Okt 2025' },
];

function levelSaatIni(poin) {
  let saat = LEVELS[0];
  for (const l of LEVELS) if (poin >= l.min) saat = l;
  const idx = LEVELS.indexOf(saat);
  const berikut = LEVELS[idx + 1] ?? null;
  const progress = berikut ? Math.min(((poin - saat.min) / (berikut.min - saat.min)) * 100, 100) : 100;
  return { saat, berikut, progress };
}

export default function PembeliTaniPointPage() {
  const [poinDitukar, setPoinDitukar] = useState(MIN_TUKAR);
  const { saat, berikut, progress } = levelSaatIni(TOTAL_POIN);
  const nilaiDiskon = poinDitukar * DISKON_PER_POIN;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Tani Point</h1>
        <p className="text-sm text-slate-400 mt-1">
          Dapatkan 1 poin setiap Rp1.000 pembelanjaan. Tukarkan poin untuk diskon checkout.
        </p>
      </div>

      {/* Level card */}
      <div className="bg-emerald-500/[0.04] border border-emerald-500/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `linear-gradient(135deg, ${saat.color}, ${saat.color}99)` }}
            >
              {saat.badge}
            </div>
            <div>
              <p className="text-xs text-slate-500">Level Anda saat ini</p>
              <p className="text-xl font-bold text-slate-50">{saat.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Poin</p>
            <p className="text-3xl font-bold text-emerald-400 tabular-nums">{TOTAL_POIN.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {berikut && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Menuju {berikut.badge} {berikut.name}</span>
              <span>{(berikut.min - TOTAL_POIN).toLocaleString('id-ID')} poin lagi</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Redeem widget */}
        <div className="lg:col-span-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-slate-50 mb-4">Tukar Poin</h2>
          <label className="text-xs text-slate-500 mb-1.5 block">Jumlah poin (min. {MIN_TUKAR})</label>
          <input
            type="range"
            min={MIN_TUKAR}
            max={TOTAL_POIN}
            step={100}
            value={poinDitukar}
            onChange={(e) => setPoinDitukar(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{MIN_TUKAR.toLocaleString('id-ID')}</span>
            <span>{TOTAL_POIN.toLocaleString('id-ID')}</span>
          </div>

          <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500">Poin ditukar</p>
            <p className="text-lg font-bold text-slate-100 tabular-nums">{poinDitukar.toLocaleString('id-ID')} poin</p>
            <p className="text-xs text-slate-500 mt-2">Nilai diskon</p>
            <p className="text-xl font-bold text-emerald-400 tabular-nums">
              Rp{nilaiDiskon.toLocaleString('id-ID')}
            </p>
          </div>

          <Link
            href="/pembeli/checkout"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all"
          >
            Gunakan di Checkout
          </Link>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-base font-semibold text-slate-50">Riwayat Poin</h2>
          </div>
          <div className="divide-y divide-white/5">
            {RIWAYAT.map((tx) => {
              const positif = tx.poin > 0;
              return (
                <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 truncate">{tx.label}</p>
                    <p className="text-xs text-slate-600">{tx.tanggal}</p>
                  </div>
                  <p className={`text-sm font-semibold tabular-nums flex-shrink-0 ${positif ? 'text-emerald-400' : 'text-red-400'}`}>
                    {positif ? '+' : ''}{tx.poin.toLocaleString('id-ID')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
