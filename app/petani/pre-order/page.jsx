"use client";

import { useState } from "react";
import { CalendarClock, Plus, X, Sprout } from "lucide-react";
import { formatRupiah, formatAngka, formatTanggal } from "@/lib/utils";
import { KATEGORI_PRODUK } from "@/lib/constants";

const PRE_ORDER_AWAL = [
  { id: "po_001", produk: "Cabai Merah Keriting", kategori: "Sayuran", estimasiPanen: "2026-08-02", jumlahKg: 500, hargaPerKg: 38000, terisi: 320 },
  { id: "po_002", produk: "Bawang Merah Super",   kategori: "Sayuran", estimasiPanen: "2026-08-10", jumlahKg: 1200, hargaPerKg: 26000, terisi: 1200 },
  { id: "po_003", produk: "Melon Golden",         kategori: "Buah-buahan", estimasiPanen: "2026-09-01", jumlahKg: 800, hargaPerKg: 15000, terisi: 0 },
];

export default function PreOrderPage() {
  const [daftar, setDaftar] = useState(PRE_ORDER_AWAL);
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [form, setForm] = useState({ produk: "", kategori: KATEGORI_PRODUK[0], estimasiPanen: "", jumlahKg: "", hargaPerKg: "" });

  function ubahForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function tambahPreOrder(e) {
    e.preventDefault();
    if (!form.produk || !form.estimasiPanen || !form.jumlahKg || !form.hargaPerKg) return;
    setDaftar((prev) => [
      {
        id: `po_${Date.now()}`,
        produk: form.produk,
        kategori: form.kategori,
        estimasiPanen: form.estimasiPanen,
        jumlahKg: parseFloat(form.jumlahKg),
        hargaPerKg: parseFloat(form.hargaPerKg),
        terisi: 0,
      },
      ...prev,
    ]);
    setForm({ produk: "", kategori: KATEGORI_PRODUK[0], estimasiPanen: "", jumlahKg: "", hargaPerKg: "" });
    setFormTerbuka(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="section-heading">Pre-Order</h1>
          <p className="mt-1 text-sm text-slate-400">
            Buka pemesanan lebih awal untuk hasil panen mendatang.
          </p>
        </div>
        <button onClick={() => setFormTerbuka(!formTerbuka)} className="btn-emerald">
          {formTerbuka ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formTerbuka ? "Tutup Form" : "Buat Pre-Order"}
        </button>
      </div>

      {/* Create form */}
      {formTerbuka && (
        <form onSubmit={tambahPreOrder} className="glass-card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="text-xs text-slate-500 mb-1.5 block">Nama Produk</label>
            <input
              value={form.produk}
              onChange={(e) => ubahForm("produk", e.target.value)}
              placeholder="cth. Cabai Merah Keriting"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Kategori</label>
            <select value={form.kategori} onChange={(e) => ubahForm("kategori", e.target.value)} className="input-field">
              {KATEGORI_PRODUK.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Estimasi Panen</label>
            <input
              type="date"
              value={form.estimasiPanen}
              onChange={(e) => ubahForm("estimasiPanen", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Jumlah (kg)</label>
            <input
              type="number"
              value={form.jumlahKg}
              onChange={(e) => ubahForm("jumlahKg", e.target.value)}
              placeholder="500"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Harga / kg</label>
            <input
              type="number"
              value={form.hargaPerKg}
              onChange={(e) => ubahForm("hargaPerKg", e.target.value)}
              placeholder="38000"
              className="input-field"
            />
          </div>
          <div className="lg:col-span-5 flex justify-end">
            <button type="submit" className="btn-emerald text-sm">Simpan Pre-Order</button>
          </div>
        </form>
      )}

      {/* Pre-order cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {daftar.map((po) => {
          const persenTerisi = po.jumlahKg > 0 ? Math.min((po.terisi / po.jumlahKg) * 100, 100) : 0;
          const penuh = persenTerisi >= 100;
          return (
            <div key={po.id} className="glass-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                </div>
                <span className={`status-pill border ${penuh ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-blue-400 bg-blue-400/10 border-blue-400/20"}`}>
                  {penuh ? "Kuota Penuh" : "Dibuka"}
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-100">{po.produk}</p>
                <p className="text-xs text-slate-500">{po.kategori}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarClock className="w-3.5 h-3.5" />
                Estimasi panen {formatTanggal(po.estimasiPanen)}
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-emerald-300">{formatRupiah(po.hargaPerKg)}</span>
                <span className="text-xs text-slate-500">/ kg</span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>{formatAngka(po.terisi)} / {formatAngka(po.jumlahKg)} kg terisi</span>
                  <span>{Math.round(persenTerisi)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${persenTerisi}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {daftar.length === 0 && (
        <div className="glass-card py-16 flex flex-col items-center gap-2 text-slate-500">
          <CalendarClock className="w-8 h-8" />
          <p className="text-sm">Belum ada pre-order aktif.</p>
        </div>
      )}
    </div>
  );
}
