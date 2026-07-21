'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

const STATUS_CONFIG = {
  MENUNGGU:     { label: 'Menunggu Pembayaran', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  TERKUNCI:     { label: 'Dana Terkunci',        color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  DILEPAS:      { label: 'Dana Dilepas',         color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  DIKEMBALIKAN: { label: 'Dikembalikan',         color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

const ESCROW_AWAL = [
  { id: 'esc_001', orderId: 'ORD-7902', produk: 'Beras Premium Pandan Wangi', petani: 'Kebun Makmur', jumlah: 15000000, status: 'TERKUNCI', va: '8807 1234 5678', bank: 'BCA Virtual Account', tanggal: '14 Jul 2026' },
  { id: 'esc_004', orderId: 'ORD-7841', produk: 'Beras Premium Pandan Wangi', petani: 'Kebun Makmur', jumlah: 52500000, status: 'TERKUNCI', va: '8807 2233 4499', bank: 'BNI VA', tanggal: '9 Jul 2026' },
  { id: 'esc_006', orderId: 'ORD-7712', produk: 'Kedelai Lokal Grade A', petani: 'UD. Sumber Rejeki', jumlah: 7360000, status: 'DILEPAS', va: '8807 4455 6677', bank: 'BRI Virtual Account', tanggal: '2 Jul 2026' },
];

export default function PembeliEscrowPage() {
  const [daftar, setDaftar] = useState(ESCROW_AWAL);

  const totalTertahan = daftar.filter((e) => e.status === 'TERKUNCI').reduce((s, e) => s + e.jumlah, 0);

  function konfirmasiDiterima(id) {
    setDaftar((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'DILEPAS' } : e)));
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Escrow Saya</h1>
        <p className="text-sm text-slate-400 mt-1">
          Dana pembayaran Anda ditahan aman hingga barang diterima dan dikonfirmasi.
        </p>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Dana Tertahan</p>
            <p className="text-xl font-bold text-slate-50">Rp{totalTertahan.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          Dana otomatis dilepas ke petani 3 hari setelah barang terkirim, kecuali Anda mengajukan sengketa dalam jendela 7 hari.
        </p>
      </div>

      <div className="space-y-4">
        {daftar.map((e) => {
          const cfg = STATUS_CONFIG[e.status];
          return (
            <div key={e.id} className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-mono text-xs text-slate-400">{e.orderId}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200 mt-1.5">{e.produk}</p>
                <p className="text-xs text-slate-500">dari {e.petani} · {e.tanggal}</p>
                <p className="text-xs text-slate-600 font-mono mt-1">{e.bank} — {e.va}</p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Jumlah</p>
                  <p className="font-semibold text-slate-100 tabular-nums">Rp{e.jumlah.toLocaleString('id-ID')}</p>
                </div>
                {e.status === 'TERKUNCI' ? (
                  <button
                    onClick={() => konfirmasiDiterima(e.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all whitespace-nowrap"
                  >
                    Konfirmasi Diterima
                  </button>
                ) : e.status === 'DILEPAS' ? (
                  // FIX TUGAS 3: tombol unduh hanya muncul untuk transaksi
                  // yang statusnya sudah 'selesai' (Escrow DILEPAS).
                  // CATATAN: `e.orderId` di sini adalah data mock ("ORD-XXXX");
                  // di produksi ganti dengan Order.id (cuid) sungguhan dari Prisma
                  // agar cocok dengan /api/orders/[id]/esg-report.
                  <a
                    href={`/api/orders/${e.orderId}/esg-report`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-emerald-400 font-semibold text-xs transition-all whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Laporan ESG
                  </a>
                ) : (
                  <span className="text-xs text-slate-600 whitespace-nowrap">Selesai</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
