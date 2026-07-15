'use client';

import { useState } from 'react';
import Link from 'next/link';

const fleetOptions = [
  {
    id: 'cde',
    name: 'CDE (Cold Diesel Engine)',
    capacity: '3.5 ton / 12 m³',
    maxWeight: 3500,
    maxVolume: 12,
    bestFor: 'Pengiriman kota dalam radius 100km',
    price: 850000,
    priceLabel: 'Rp 850.000',
    co2: 2.1,
    time: '1–2 hari',
    icon: '🚐',
    color: 'blue',
  },
  {
    id: 'cdd',
    name: 'CDD (Cold Double Diesel)',
    capacity: '8 ton / 30 m³',
    maxWeight: 8000,
    maxVolume: 30,
    bestFor: 'Antar kota Pulau Jawa',
    price: 1400000,
    priceLabel: 'Rp 1.400.000',
    co2: 3.8,
    time: '2–3 hari',
    icon: '🚛',
    color: 'emerald',
  },
  {
    id: 'fuso',
    name: 'Fuso (Heavy Truck)',
    capacity: '15 ton / 55 m³',
    maxWeight: 15000,
    maxVolume: 55,
    bestFor: 'Pengiriman massal antar pulau',
    price: 2800000,
    priceLabel: 'Rp 2.800.000',
    co2: 7.2,
    time: '3–5 hari',
    icon: '🚚',
    color: 'amber',
  },
];

const colorMap = {
  blue: {
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-400',
    glow: 'shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)]',
  },
  emerald: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
    glow: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]',
  },
  amber: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-400',
    glow: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]',
  },
};

// Mock order items
const mockOrderItems = [
  { id: 1, name: 'Beras Premium Pandan Wangi', qty: 2000, unit: 'kg', price: 12500, weight: 2000, volume: 2.5 },
  { id: 2, name: 'Jagung Hibrida Pipilan Kering', qty: 3000, unit: 'kg', price: 4800, weight: 3000, volume: 4.2 },
];

function getRecommendedFleet(totalWeight) {
  if (totalWeight <= 3500) return 'cde';
  if (totalWeight <= 8000) return 'cdd';
  return 'fuso';
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [destination, setDestination] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('escrow');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalWeight = mockOrderItems.reduce((s, i) => s + i.weight, 0);
  const totalVolume = mockOrderItems.reduce((s, i) => s + i.volume, 0);
  const subtotal = mockOrderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const recommendedId = getRecommendedFleet(totalWeight);
  const fleet = fleetOptions.find((f) => f.id === selectedFleet);
  const grandTotal = subtotal + (fleet?.price || 0);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="p-4 lg:p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-50 mb-2">Pesanan Terkonfirmasi!</h2>
          <p className="text-slate-400 mb-2">No. Pesanan: <span className="text-emerald-400 font-mono font-bold">TRP-2024-08471</span></p>
          <p className="text-slate-500 text-sm mb-8">
            Dana escrow sebesar <strong className="text-slate-300">Rp {grandTotal.toLocaleString('id-ID')}</strong> telah diblokir dengan aman. 
            Dana akan dilepas setelah barang diterima dan dikonfirmasi.
          </p>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6 text-left">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Status Pengiriman</h3>
            <div className="space-y-3">
              {['Pesanan Dikonfirmasi', 'Proses Penyiapan Barang', 'Barang Diserahkan ke Driver', 'Dalam Perjalanan', 'Terkirim'].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                    {i === 0 && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-sm ${i === 0 ? 'text-emerald-400 font-medium' : 'text-slate-600'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/pembeli" className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:bg-white/8 transition text-center">
              Kembali Belanja
            </Link>
            <Link href="/pembeli/esg" className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-400 transition text-center">
              Lihat Laporan ESG
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/pembeli" className="hover:text-slate-300 transition">Marketplace</Link>
          <span>/</span>
          <span className="text-slate-300">Checkout</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-50">Checkout & Simulasi Logistik</h1>
        <p className="text-slate-500 text-sm mt-0.5">Sistem AI memilih armada terbaik berdasarkan berat dan volume muatan Anda</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-0 mb-8">
        {['Ringkasan Pesanan', 'Pilih Armada', 'Pembayaran'].map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                  isActive ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' :
                  'border-white/20 text-slate-600'
                }`}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-slate-200' : isDone ? 'text-emerald-400' : 'text-slate-600'}`}>{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-2 ${step > stepNum ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Order summary */}
          {step === 1 && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ringkasan Pesanan
              </h2>
              <div className="space-y-3">
                {mockOrderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl">
                      {item.name.includes('Beras') ? '🌾' : '🌽'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.qty.toLocaleString('id-ID')} {item.unit} · {item.weight.toLocaleString('id-ID')} kg · {item.volume} m³</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                      <p className="text-xs text-slate-600">Rp {item.price.toLocaleString('id-ID')}/{item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weight/volume summary */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-100">{totalWeight.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Total Berat (kg)</p>
                </div>
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-100">{totalVolume.toFixed(1)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Total Volume (m³)</p>
                </div>
              </div>

              {/* Destination */}
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Alamat Tujuan Pengiriman</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Masukkan alamat lengkap tujuan..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                Simulasi Armada
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Step 2: Fleet selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Rekomendasi AI Logistik</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Total muatan <strong className="text-emerald-400">{totalWeight.toLocaleString('id-ID')} kg</strong> dan <strong className="text-emerald-400">{totalVolume.toFixed(1)} m³</strong> — 
                    Armada <strong className="text-emerald-300">{fleetOptions.find(f => f.id === recommendedId)?.name}</strong> adalah pilihan optimal.
                  </p>
                </div>
              </div>

              {fleetOptions.map((f) => {
                const c = colorMap[f.color];
                const isSelected = selectedFleet === f.id;
                const isRecommended = f.id === recommendedId;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFleet(f.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? `${c.border} ${c.bg} ${c.glow}`
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl mt-0.5">{f.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-base font-semibold ${isSelected ? c.text : 'text-slate-200'}`}>{f.name}</span>
                          {isRecommended && (
                            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                              ✦ Direkomendasikan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{f.bestFor}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-slate-600">Kapasitas</p>
                            <p className="text-sm font-medium text-slate-300">{f.capacity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Estimasi</p>
                            <p className="text-sm font-medium text-slate-300">{f.time}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Emisi CO₂</p>
                            <p className="text-sm font-medium text-teal-400">{f.co2} kg CO₂</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Biaya Angkut</p>
                            <p className={`text-sm font-bold ${isSelected ? c.text : 'text-slate-200'}`}>{f.priceLabel}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${isSelected ? `${c.border} ${c.bg}` : 'border-white/20'}`}>
                        {isSelected && <div className={`w-full h-full rounded-full scale-50 ${c.bg.replace('bg-', 'bg-').replace('/10', '')}`} />}
                      </div>
                    </div>
                  </button>
                );
              })}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:bg-white/8 transition">
                  Kembali
                </button>
                <button
                  onClick={() => selectedFleet && setStep(3)}
                  disabled={!selectedFleet}
                  className="flex-1 py-2.5 bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm hover:bg-emerald-400 transition"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-base font-semibold text-slate-200 mb-4">Metode Pembayaran</h2>
                <div className="space-y-3">
                  {[
                    {
                      id: 'escrow',
                      label: 'Escrow TaniPro',
                      desc: 'Dana ditahan hingga barang diterima & dikonfirmasi. Transaksi aman 100%.',
                      badge: 'Disarankan',
                      icon: '🔒',
                    },
                    {
                      id: 'transfer',
                      label: 'Transfer Bank Langsung',
                      desc: 'Transfer ke rekening petani/koperasi. Proses manual 1–2 hari kerja.',
                      badge: null,
                      icon: '🏦',
                    },
                    {
                      id: 'credit',
                      label: 'Kredit Usaha (Cicilan)',
                      desc: 'Bayar nanti dengan tenor 30–90 hari. Tersedia untuk pembeli terverifikasi.',
                      badge: 'KUR Ready',
                      icon: '📋',
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        paymentMethod === m.id
                          ? 'border-emerald-500/40 bg-emerald-500/8'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${paymentMethod === m.id ? 'text-emerald-400' : 'text-slate-200'}`}>{m.label}</span>
                            {m.badge && (
                              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">{m.badge}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === m.id ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:bg-white/8 transition">
                  Kembali
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl text-sm hover:bg-emerald-400 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Konfirmasi & Blokir Dana Escrow
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Ringkasan Biaya</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Produk</span>
                <span className="text-slate-200 font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Logistik</span>
                <span className="text-slate-200 font-medium">
                  {fleet ? fleet.priceLabel : <span className="text-slate-600 italic">Pilih armada</span>}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Escrow</span>
                <span className="text-emerald-400 font-medium">Gratis</span>
              </div>
              <div className="border-t border-white/10 pt-2.5 flex justify-between">
                <span className="font-semibold text-slate-200">Total</span>
                <span className="font-bold text-emerald-400 text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {fleet && (
              <div className="mt-4 p-3 bg-teal-500/8 border border-teal-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" />
                  </svg>
                  <span className="text-xs font-semibold text-teal-400">Dampak Lingkungan</span>
                </div>
                <p className="text-xs text-teal-600">Pengiriman ini menghasilkan <span className="text-teal-300 font-medium">{fleet.co2} kg CO₂</span>. Anda menghemat <span className="text-teal-300 font-medium">64%</span> vs pengiriman retail konvensional.</p>
              </div>
            )}

            {/* Tani points */}
            <div className="mt-3 p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs text-emerald-400 font-medium">
                  +{Math.floor(grandTotal / 1000)} Tani Point dari pesanan ini
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
