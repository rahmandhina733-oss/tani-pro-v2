"use client";

import { useState } from "react";
import { ClipboardList, ChevronRight } from "lucide-react";
import { formatRupiah, formatAngka, formatTanggal, STATUS_ORDER_CONFIG } from "@/lib/utils";

const SEMUA_PESANAN = [
  { id: "ord_001", pembeli: "PT Agro Nusantara", perusahaan: "Industri Pangan", produk: "Beras Premium Pandan Wangi", jumlahKg: 2000, hargaPerKg: 12500, status: "DIBAYAR", createdAt: "2026-07-14", alamat: "Kawasan Industri MM2100, Bekasi" },
  { id: "ord_002", pembeli: "CV Sumber Pangan",   perusahaan: "Distributor",     produk: "Jagung Hibrida Pipilan",     jumlahKg: 3500, hargaPerKg: 4800,  status: "DIPROSES", createdAt: "2026-07-13", alamat: "Jl. Industri Raya No. 12, Surabaya" },
  { id: "ord_003", pembeli: "UD Makmur Jaya",     perusahaan: "Pabrik Tahu",     produk: "Kedelai Lokal Grade A",      jumlahKg: 800,  hargaPerKg: 9200,  status: "DIKIRIM",  createdAt: "2026-07-12", alamat: "Jl. Raya Gresik No. 8" },
  { id: "ord_004", pembeli: "PT Cipta Boga",      perusahaan: "Restoran Chain",  produk: "Beras Premium Pandan Wangi", jumlahKg: 1200, hargaPerKg: 12500, status: "PENDING",  createdAt: "2026-07-11", alamat: "Jl. Sudirman No. 45, Jakarta" },
  { id: "ord_005", pembeli: "Koperasi Sejahtera", perusahaan: "Koperasi",       produk: "Singkong Gajah",             jumlahKg: 2400, hargaPerKg: 3200,  status: "DITERIMA", createdAt: "2026-07-08", alamat: "Jl. Pahlawan No. 3, Malang" },
  { id: "ord_006", pembeli: "PT Boga Sentosa",    perusahaan: "Pabrik Tepung",  produk: "Jagung Hibrida Pipilan",     jumlahKg: 5000, hargaPerKg: 4800,  status: "DIBATALKAN", createdAt: "2026-07-05", alamat: "Jl. Industri No. 99, Semarang" },
];

const TAB_STATUS = ["Semua", "PENDING", "DIBAYAR", "DIPROSES", "DIKIRIM", "DITERIMA", "DIBATALKAN", "SENGKETA"];

// Aksi yang diizinkan petani sesuai status pesanan saat ini
const AKSI_BERIKUT = {
  DIBAYAR:  { label: "Tandai Diproses", next: "DIPROSES" },
  DIPROSES: { label: "Serahkan ke Kurir", next: "DIKIRIM" },
};

export default function PesananPage() {
  const [pesanan, setPesanan] = useState(SEMUA_PESANAN);
  const [tabAktif, setTabAktif] = useState("Semua");

  const tampil = tabAktif === "Semua" ? pesanan : pesanan.filter((p) => p.status === tabAktif);

  function prosesAksi(id, statusBaru) {
    setPesanan((prev) => prev.map((p) => (p.id === id ? { ...p, status: statusBaru } : p)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Pesanan Masuk</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola dan proses pesanan dari pembeli B2B.</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TAB_STATUS.map((s) => {
          const jumlah = s === "Semua" ? pesanan.length : pesanan.filter((p) => p.status === s).length;
          const aktif = tabAktif === s;
          return (
            <button
              key={s}
              onClick={() => setTabAktif(s)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                aktif
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-slate-400 bg-white/[0.02] border-white/[0.06] hover:text-slate-200 hover:bg-white/[0.05]"
              }`}
            >
              {s === "Semua" ? "Semua" : STATUS_ORDER_CONFIG[s]?.label ?? s}
              <span className="ml-1.5 text-[10px] opacity-70">{jumlah}</span>
            </button>
          );
        })}
      </div>

      {/* Order list */}
      <div className="space-y-3">
        {tampil.map((p) => {
          const cfg = STATUS_ORDER_CONFIG[p.status];
          const aksi = AKSI_BERIKUT[p.status];
          const total = p.jumlahKg * p.hargaPerKg;

          return (
            <div key={p.id} className="glass-card p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-100">{p.pembeli}</p>
                  <span className="text-xs text-slate-500">· {p.perusahaan}</span>
                  <span className={`status-pill border ${cfg.warna}`}>{cfg.label}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {p.produk} — {formatAngka(p.jumlahKg)} kg · {formatTanggal(p.createdAt)}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 truncate">Kirim ke: {p.alamat}</p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="font-semibold text-slate-100 tabular-nums">{formatRupiah(total)}</p>
                </div>
                {aksi ? (
                  <button
                    onClick={() => prosesAksi(p.id, aksi.next)}
                    className="btn-emerald text-xs px-4 py-2 whitespace-nowrap"
                  >
                    {aksi.label}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button className="btn-ghost text-xs px-4 py-2 whitespace-nowrap">
                    Detail
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {tampil.length === 0 && (
          <div className="glass-card py-16 flex flex-col items-center gap-2 text-slate-500">
            <ClipboardList className="w-8 h-8" />
            <p className="text-sm">Belum ada pesanan pada status ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
