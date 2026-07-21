'use client';

import { useState, useMemo } from 'react';
import {
  ORIGIN_LOCATION,
  DESTINATION_CITIES,
  calculateEsg,
  co2ToTrees,
} from '@/lib/esg';
import EsgComparisonPanel from '@/components/shared/EsgComparisonPanel';

const monthlyData = [
  { month: 'Jan', co2Saved: 8.2, orders: 14, conventional: 22.1 },
  { month: 'Feb', co2Saved: 11.5, orders: 19, conventional: 31.2 },
  { month: 'Mar', co2Saved: 9.8, orders: 16, conventional: 26.4 },
  { month: 'Apr', co2Saved: 14.2, orders: 23, conventional: 38.3 },
  { month: 'Mei', co2Saved: 12.1, orders: 20, conventional: 32.7 },
  { month: 'Jun', co2Saved: 18.4, orders: 31, conventional: 49.6 },
];

const supplyChainBreakdown = [
  { label: 'Transportasi Langsung (Farm-to-Buyer)', saved: 42.3, pct: 58, color: 'emerald' },
  { label: 'Eliminasi Cold Storage Intermediate', saved: 18.7, pct: 25, color: 'teal' },
  { label: 'Load Optimization (Bin Packing)', saved: 8.9, pct: 12, color: 'cyan' },
  { label: 'Rute Efisien (AI Dispatcher)', saved: 3.7, pct: 5, color: 'blue' },
];

const colorBar = {
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  blue: 'bg-blue-500',
};

const colorText = {
  emerald: 'text-emerald-400',
  teal: 'text-teal-400',
  cyan: 'text-cyan-400',
  blue: 'text-blue-400',
};

const esgGoals = [
  { label: 'Emisi CO₂ Tahunan', current: 73.6, target: 120, unit: 'ton CO₂', color: 'emerald' },
  { label: 'Persentase Pengiriman Efisien', current: 84, target: 100, unit: '%', color: 'teal' },
  { label: 'Transaksi Farm-Direct', current: 31, target: 50, unit: 'pesanan', color: 'cyan' },
];

const certifications = [
  { name: 'Green Supply Chain Certified', issuer: 'Kementerian LHK RI', year: '2024', icon: '🌿' },
  { name: 'ISO 14001 Environmental Mgmt', issuer: 'BSI Group Indonesia', year: '2023', icon: '📋' },
  { name: 'Carbon Footprint Verified', issuer: 'Carbon Trust ID', year: '2024', icon: '♻️' },
];

function BarChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.conventional));

  return (
    <div className="flex items-end gap-3 h-40 pt-4">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="relative w-full flex items-end gap-1 justify-center" style={{ height: '112px' }}>
            {/* Conventional bar */}
            <div
              className="flex-1 rounded-t bg-slate-700/50 relative group cursor-pointer"
              style={{ height: `${(d.conventional / maxVal) * 100}%` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-800 border border-white/10 rounded px-1.5 py-0.5 text-xs text-slate-300 whitespace-nowrap z-10">
                {d.conventional}t konvensional
              </div>
            </div>
            {/* Saved bar */}
            <div
              className="flex-1 rounded-t bg-emerald-500/70 relative group cursor-pointer"
              style={{ height: `${(d.co2Saved / maxVal) * 100}%` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-800 border border-white/10 rounded px-1.5 py-0.5 text-xs text-emerald-300 whitespace-nowrap z-10">
                {d.co2Saved}t via TaniPro
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-600">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function ESGPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // ── Simulator Jejak Karbon (Mesin Kalkulasi ESG terpusat) ──
  const [simBeratTon, setSimBeratTon] = useState('5');
  const [simTujuan, setSimTujuan] = useState('');
  const [simJarakKm, setSimJarakKm] = useState('');

  const simEsg = useMemo(
    () => calculateEsg(parseFloat(simBeratTon), parseFloat(simJarakKm)),
    [simBeratTon, simJarakKm]
  );

  const handleSimTujuan = (e) => {
    const nama = e.target.value;
    setSimTujuan(nama);
    const kota = DESTINATION_CITIES.find((c) => c.name === nama);
    if (kota) setSimJarakKm(String(kota.refDistance));
  };

  const totalSaved = monthlyData.reduce((s, m) => s + m.co2Saved, 0);
  const totalConventional = monthlyData.reduce((s, m) => s + m.conventional, 0);
  const reductionPct = ((1 - totalSaved / totalConventional) * 100).toFixed(1);
  const treesEq = Math.round(totalSaved * 45);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Laporan ESG & Jejak Karbon</h1>
            <p className="text-slate-500 text-sm mt-0.5">Dampak lingkungan rantai pasok Anda melalui platform TaniPro</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="sm:col-span-1 bg-gradient-to-br from-emerald-900/40 to-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Total CO₂ Dihemat</span>
            </div>
            <p className="text-5xl font-bold text-emerald-400 mb-1">{totalSaved.toFixed(1)}</p>
            <p className="text-sm text-emerald-600">ton CO₂e · Jan–Jun 2024</p>
            <div className="mt-4 pt-4 border-t border-emerald-500/20">
              <p className="text-xs text-slate-500">Setara dengan menanam</p>
              <p className="text-xl font-bold text-slate-200 mt-0.5">{treesEq.toLocaleString('id-ID')} pohon 🌳</p>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Pengurangan Emisi</p>
          <p className="text-4xl font-bold text-teal-400">{reductionPct}%</p>
          <p className="text-sm text-slate-500 mt-1">vs rantai pasok konvensional</p>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${reductionPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0%</span>
            <span>Target: 70%</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Pesanan Farm-Direct</p>
          <p className="text-4xl font-bold text-cyan-400">31</p>
          <p className="text-sm text-slate-500 mt-1">dari 37 total pesanan (84%)</p>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-xs text-slate-400">Farm-Direct: 31 pesanan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="text-xs text-slate-500">Melalui distributor: 6 pesanan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-0">
        {['overview', 'simulator', 'breakdown', 'sertifikasi'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'overview' ? 'Ikhtisar' : tab === 'simulator' ? 'Simulator Karbon' : tab === 'breakdown' ? 'Rincian Sumber' : 'Sertifikasi'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Bar chart */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-200">Emisi CO₂ Bulanan</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-slate-700/50" />
                  <span className="text-slate-500">Konvensional</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500/70" />
                  <span className="text-emerald-500">TaniPro</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4">Hover pada bar untuk detail · Unit: ton CO₂e</p>
            <BarChart data={monthlyData} />
          </div>

          {/* Monthly table */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-slate-200">Data Bulanan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Bulan</th>
                    <th className="text-right px-4 py-3 text-xs text-slate-500 font-medium">Pesanan</th>
                    <th className="text-right px-4 py-3 text-xs text-slate-500 font-medium">Konvensional</th>
                    <th className="text-right px-4 py-3 text-xs text-slate-500 font-medium">Via TaniPro</th>
                    <th className="text-right px-6 py-3 text-xs text-slate-500 font-medium">Dihemat</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, i) => {
                    const saved = row.conventional - row.co2Saved;
                    const pct = ((saved / row.conventional) * 100).toFixed(0);
                    return (
                      <tr key={row.month} className={`border-b border-white/5 hover:bg-white/[0.02] transition ${i === monthlyData.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-6 py-3 text-slate-300 font-medium">{row.month} 2024</td>
                        <td className="px-4 py-3 text-right text-slate-400">{row.orders}</td>
                        <td className="px-4 py-3 text-right text-slate-500">{row.conventional}t</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-medium">{row.co2Saved}t</td>
                        <td className="px-6 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-teal-400 font-semibold">
                            ↓{pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10 bg-white/[0.02]">
                    <td className="px-6 py-3 text-slate-300 font-semibold">Total</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-semibold">{monthlyData.reduce((s, m) => s + m.orders, 0)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 font-semibold">{totalConventional.toFixed(1)}t</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold">{totalSaved.toFixed(1)}t</td>
                    <td className="px-6 py-3 text-right text-teal-400 font-bold">↓{reductionPct}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Simulator Jejak Karbon Pengiriman</h3>
            <p className="text-xs text-slate-500 mb-5">
              Estimasi emisi CO₂e sebelum memesan — origin dikunci di <span className="text-emerald-400 font-medium">{ORIGIN_LOCATION}</span> 🔒
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Berat Muatan (Ton)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={simBeratTon}
                  onChange={(e) => setSimBeratTon(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                  placeholder="cth: 5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Kota Tujuan</label>
                <select
                  value={simTujuan}
                  onChange={handleSimTujuan}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition appearance-none [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Pilih kota...</option>
                  {DESTINATION_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Jarak Tempuh (KM)</label>
                <input
                  type="number"
                  min="0"
                  value={simJarakKm}
                  onChange={(e) => setSimJarakKm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition"
                  placeholder="cth: 150"
                />
              </div>
            </div>

            <EsgComparisonPanel
              weightTon={parseFloat(simBeratTon)}
              distanceKm={parseFloat(simJarakKm)}
              showOrigin
            />

            {simEsg.valid && (
              <p className="text-xs text-slate-600 mt-4">
                Dengan {simEsg.tripsTp}× perjalanan {simEsg.fleet.name}, penghematan setara menanam{' '}
                <span className="text-emerald-400 font-semibold">{co2ToTrees(simEsg.saved)} pohon</span> per tahun.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-6">Sumber Penghematan CO₂e</h3>
            <div className="space-y-5">
              {supplyChainBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${colorText[item.color]}`}>{item.saved}t CO₂</span>
                      <span className="text-xs text-slate-600 w-8 text-right">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div
                      className={`${colorBar[item.color]} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Total Dihemat</p>
                  <p className="text-2xl font-bold text-emerald-400">{supplyChainBreakdown.reduce((s, i) => s + i.saved, 0).toFixed(1)}t</p>
                  <p className="text-xs text-slate-600 mt-0.5">CO₂e Jan–Jun 2024</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Nilai Ekonomi Karbon</p>
                  <p className="text-2xl font-bold text-teal-400">Rp 14,7M</p>
                  <p className="text-xs text-slate-600 mt-0.5">@ Rp 200K/ton CO₂</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scope breakdown */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Klasifikasi Lingkup (GHG Protocol)</h3>
            <div className="space-y-3">
              {[
                { scope: 'Scope 1', label: 'Emisi Langsung (Armada Sendiri)', value: '0 kg', note: 'Tidak ada armada milik sendiri', color: 'emerald' },
                { scope: 'Scope 2', label: 'Emisi Tidak Langsung (Energi)', value: '847 kg', note: 'Operasional gudang & server', color: 'blue' },
                { scope: 'Scope 3', label: 'Emisi Rantai Pasok', value: '72.75 ton', note: 'Transportasi 3PL mitra', color: 'purple' },
              ].map((s) => (
                <div key={s.scope} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className={`w-16 h-16 rounded-xl bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs font-bold text-${s.color}-400`}>{s.scope}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{s.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.note}</p>
                  </div>
                  <p className={`text-sm font-bold text-${s.color}-400 text-right`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sertifikasi' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/20 transition">
                <span className="text-4xl block mb-3">{cert.icon}</span>
                <p className="text-sm font-semibold text-slate-200 mb-1">{cert.name}</p>
                <p className="text-xs text-slate-500">{cert.issuer}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-600">Diterbitkan {cert.year}</span>
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Aktif</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Target ESG 2024</h3>
            <div className="space-y-5">
              {esgGoals.map((goal) => {
                const pct = Math.min(100, (goal.current / goal.target) * 100);
                return (
                  <div key={goal.label}>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-sm text-slate-300">{goal.label}</p>
                        <p className="text-xs text-slate-600 mt-0.5">Target: {goal.target} {goal.unit}</p>
                      </div>
                      <p className={`text-sm font-bold ${colorText[goal.color]}`}>
                        {goal.current} <span className="text-slate-500 font-normal text-xs">{goal.unit}</span>
                      </p>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`${colorBar[goal.color]} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{pct.toFixed(0)}% dari target</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
