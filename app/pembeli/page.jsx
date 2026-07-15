'use client';

import Link from 'next/link';

const RINGKASAN = {
  pesananAktif: 7,
  danaEscrow: 38500000,
  co2eDihemat: 18.4,
  taniPoint: 4250,
};

const PESANAN_TERBARU = [
  { id: 'ord_001', produk: 'Beras Premium Pandan Wangi', petani: 'Koperasi Tani Subur', jumlahKg: 2000, total: 25000000, status: 'DIKIRIM',  tanggal: '14 Jul 2026' },
  { id: 'ord_002', produk: 'Jagung Hibrida Pipilan',      petani: 'Gapoktan Makmur Sejati', jumlahKg: 3500, total: 16800000, status: 'DIPROSES', tanggal: '13 Jul 2026' },
  { id: 'ord_003', produk: 'Kedelai Lokal Grade A',       petani: 'UD. Sumber Rejeki', jumlahKg: 800,  total: 7360000,  status: 'DITERIMA', tanggal: '11 Jul 2026' },
  { id: 'ord_004', produk: 'Bawang Merah Brebes',         petani: 'Koperasi Sumber Agung', jumlahKg: 500,  total: 9250000,  status: 'DIBAYAR',  tanggal: '10 Jul 2026' },
];

const STATUS_STYLES = {
  PENDING:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  DIBAYAR:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  DIPROSES: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  DIKIRIM:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  DITERIMA: 'text-emerald-300 bg-emerald-300/10 border-emerald-300/20',
};

const STATUS_LABEL = {
  PENDING: 'Menunggu', DIBAYAR: 'Dibayar', DIPROSES: 'Diproses', DIKIRIM: 'Dikirim', DITERIMA: 'Diterima',
};

const QUICK_LINKS = [
  {
    href: '/pembeli/katalog',
    label: 'Jelajahi Katalog',
    desc: 'Cari komoditas dari petani terverifikasi',
    color: 'emerald',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: '/pembeli/escrow',
    label: 'Kelola Escrow',
    desc: 'Pantau dana yang tertahan hingga barang diterima',
    color: 'blue',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    href: '/pembeli/esg',
    label: 'Laporan ESG',
    desc: 'Lihat jejak karbon yang berhasil dihemat',
    color: 'teal',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function StatCard({ label, value, suffix, icon, accentColor }) {
  const accents = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${accents[accentColor]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-50">
        {value}{suffix && <span className="text-sm font-medium text-slate-500 ml-1">{suffix}</span>}
      </p>
    </div>
  );
}

export default function DashboardPembeliPage() {
  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Dashboard Pembeli</h1>
          <p className="text-slate-500 text-sm mt-0.5">Ringkasan aktivitas pembelian Anda di TaniPro.</p>
        </div>
        <Link
          href="/pembeli/katalog"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Pesanan Baru
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pesanan Aktif"
          value={RINGKASAN.pesananAktif}
          accentColor="emerald"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          label="Dana di Escrow"
          value={`Rp ${(RINGKASAN.danaEscrow / 1000000).toFixed(1)}Jt`}
          accentColor="blue"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          label="CO2e Dihemat"
          value={RINGKASAN.co2eDihemat}
          suffix="ton"
          accentColor="teal"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" />
            </svg>
          }
        />
        <StatCard
          label="Tani Point"
          value={RINGKASAN.taniPoint.toLocaleString('id-ID')}
          suffix="poin"
          accentColor="amber"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pesanan terbaru */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-50">Pesanan Terbaru</h2>
            <Link href="/pembeli/checkout" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Lihat semua
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-white/[0.06]">
                  <th className="pb-2.5 font-medium">Produk</th>
                  <th className="pb-2.5 font-medium">Petani</th>
                  <th className="pb-2.5 font-medium text-right">Total</th>
                  <th className="pb-2.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {PESANAN_TERBARU.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                    <td className="py-3 pr-2">
                      <p className="font-medium text-slate-200">{p.produk}</p>
                      <p className="text-xs text-slate-500">{p.tanggal} · {p.jumlahKg.toLocaleString('id-ID')} kg</p>
                    </td>
                    <td className="py-3 pr-2 text-slate-400">{p.petani}</td>
                    <td className="py-3 text-right font-medium text-slate-200 tabular-nums">
                      Rp {p.total.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-2.5">
          <h2 className="text-base font-semibold text-slate-50 mb-2">Aksi Cepat</h2>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-3 px-3 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition"
            >
              <div className={`w-8 h-8 flex-shrink-0 rounded-lg border flex items-center justify-center ${
                link.color === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                link.color === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                'text-teal-400 bg-teal-500/10 border-teal-500/20'
              }`}>
                {link.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{link.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
