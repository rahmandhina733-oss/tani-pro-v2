"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Package, Leaf, ImageOff } from "lucide-react";
import { formatRupiah, formatAngka } from "@/lib/format";
import { KATEGORI_PRODUK } from "@/lib/constants";

const STATUS_PRODUK_CONFIG = {
  AKTIF:      { label: "Aktif",      warna: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  HABIS:      { label: "Stok Habis", warna: "text-red-400 bg-red-400/10 border-red-400/20" },
  PRE_ORDER:  { label: "Pre-Order",  warna: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  DIARSIPKAN: { label: "Diarsipkan", warna: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
};

const PRODUK_SAYA = [
  { id: "p1", nama: "Beras Premium Pandan Wangi", kategori: "Padi & Beras", hargaPerKg: 12500, stokKg: 4200, minPesanan: 500, status: "AKTIF", sertifikasi: ["Organik"] },
  { id: "p2", nama: "Jagung Hibrida Pipilan Kering", kategori: "Tanaman Pangan", hargaPerKg: 4800, stokKg: 0, minPesanan: 1000, status: "HABIS", sertifikasi: [] },
  { id: "p3", nama: "Cabai Merah Keriting", kategori: "Sayuran", hargaPerKg: 38000, stokKg: 0, minPesanan: 100, status: "PRE_ORDER", sertifikasi: [] },
  { id: "p4", nama: "Kedelai Lokal Grade A", kategori: "Tanaman Pangan", hargaPerKg: 9200, stokKg: 3100, minPesanan: 300, status: "AKTIF", sertifikasi: ["Non-GMO"] },
  { id: "p5", nama: "Singkong Gajah", kategori: "Perkebunan", hargaPerKg: 3200, stokKg: 1120, minPesanan: 500, status: "DIARSIPKAN", sertifikasi: [] },
];

export default function TokoPage() {
  const [produk, setProduk] = useState(PRODUK_SAYA);
  const [cari, setCari] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [editId, setEditId] = useState(null);
  const [stokBaru, setStokBaru] = useState("");

  const daftarTampil = produk.filter((p) => {
    const cocokCari = p.nama.toLowerCase().includes(cari.toLowerCase());
    const cocokKategori = kategoriFilter === "Semua" || p.kategori === kategoriFilter;
    return cocokCari && cocokKategori;
  });

  function mulaiEditStok(p) {
    setEditId(p.id);
    setStokBaru(String(p.stokKg));
  }

  function simpanStok(id) {
    const nilai = parseFloat(stokBaru);
    if (Number.isNaN(nilai) || nilai < 0) return;
    setProduk((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stokKg: nilai, status: nilai === 0 && p.status === "AKTIF" ? "HABIS" : (nilai > 0 && p.status === "HABIS" ? "AKTIF" : p.status) }
          : p
      )
    );
    setEditId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="section-heading">Toko Saya</h1>
          <p className="mt-1 text-sm text-slate-400">Kelola produk, stok, dan status penjualan Anda.</p>
        </div>
        <button className="btn-emerald">
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari produk..."
            className="input-field pl-9"
          />
        </div>
        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="input-field sm:w-56"
        >
          <option>Semua</option>
          {KATEGORI_PRODUK.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      {/* Product table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-white/[0.06]">
                <th className="px-5 py-3 font-medium">Produk</th>
                <th className="px-5 py-3 font-medium">Harga / kg</th>
                <th className="px-5 py-3 font-medium">Stok</th>
                <th className="px-5 py-3 font-medium">Min. Pesanan</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarTampil.map((p) => {
                const cfg = STATUS_PRODUK_CONFIG[p.status];
                const sedangEdit = editId === p.id;
                return (
                  <tr key={p.id} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <ImageOff className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{p.nama}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-slate-500">{p.kategori}</span>
                            {p.sertifikasi.map((s) => (
                              <span key={s} className="badge bg-emerald-400/10 text-emerald-400 flex items-center gap-1">
                                <Leaf className="w-2.5 h-2.5" /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 tabular-nums">{formatRupiah(p.hargaPerKg)}</td>
                    <td className="px-5 py-3.5">
                      {sedangEdit ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            type="number"
                            value={stokBaru}
                            onChange={(e) => setStokBaru(e.target.value)}
                            className="input-field w-24 py-1.5 text-sm"
                          />
                          <button onClick={() => simpanStok(p.id)} className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
                            Simpan
                          </button>
                          <button onClick={() => setEditId(null)} className="text-xs text-slate-500 hover:text-slate-300">
                            Batal
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300 tabular-nums">{formatAngka(p.stokKg)} kg</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 tabular-nums">{formatAngka(p.minPesanan)} kg</td>
                    <td className="px-5 py-3.5">
                      <span className={`status-pill border ${cfg.warna}`}>{cfg.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!sedangEdit && (
                        <button
                          onClick={() => mulaiEditStok(p)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Ubah Stok
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {daftarTampil.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2 text-slate-500">
            <Package className="w-8 h-8" />
            <p className="text-sm">Tidak ada produk yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
