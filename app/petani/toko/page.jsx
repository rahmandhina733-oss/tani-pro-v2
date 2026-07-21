"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /petani/toko — Toko Saya
 *
 * FIX TUGAS 4:
 * - Fitur Pre-Order dihapus total (status PRE_ORDER tidak lagi ada di enum
 *   Prisma ProductStatus — lihat prisma/schema.prisma).
 * - Form "Tambah Produk" (sebelumnya cuma tombol placeholder tanpa isi)
 *   dibangun lengkap dengan 3 field wajib baru: umur simpan (hari), warna
 *   visual, dan grade kualitas (A/B/C) — persis skema Produk yang baru.
 *
 * CATATAN: interaksi tabel & form di sini memakai state lokal (mock) sesuai
 * konvensi UI proyek ini. Validasi yang sama (termasuk 3 field baru) sudah
 * diterapkan juga di backend: POST /api/produk.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { Plus, Search, Pencil, Package, Leaf, ImageOff, X, AlertCircle } from "lucide-react";
import { formatRupiah, formatAngka } from "@/lib/format";
import { KATEGORI_PRODUK } from "@/lib/constants";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";

const STATUS_PRODUK_CONFIG = {
  AKTIF:      { label: "Aktif",      warna: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  HABIS:      { label: "Stok Habis", warna: "text-red-400 bg-red-400/10 border-red-400/20" },
  DIARSIPKAN: { label: "Diarsipkan", warna: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
};

const GRADE_TONE = { A: "emerald", B: "blue", C: "slate" };

const PRODUK_SAYA = [
  { id: "p1", nama: "Beras Premium Pandan Wangi", kategori: "Padi & Beras", hargaPerKg: 12500, stokKg: 4200, minPesanan: 500, status: "AKTIF", sertifikasi: ["Organik"], umurSimpanHari: 180, warnaVisual: "Putih Bersih", gradeKualitas: "A" },
  { id: "p2", nama: "Jagung Hibrida Pipilan Kering", kategori: "Tanaman Pangan", hargaPerKg: 4800, stokKg: 0, minPesanan: 1000, status: "HABIS", sertifikasi: [], umurSimpanHari: 270, warnaVisual: "Kuning Cerah", gradeKualitas: "A" },
  { id: "p3", nama: "Cabai Merah Keriting", kategori: "Sayuran", hargaPerKg: 38000, stokKg: 320, minPesanan: 100, status: "AKTIF", sertifikasi: [], umurSimpanHari: 10, warnaVisual: "Merah Segar", gradeKualitas: "B" },
  { id: "p4", nama: "Kedelai Lokal Grade A", kategori: "Tanaman Pangan", hargaPerKg: 9200, stokKg: 3100, minPesanan: 300, status: "AKTIF", sertifikasi: ["Non-GMO"], umurSimpanHari: 300, warnaVisual: "Kuning Pucat", gradeKualitas: "A" },
  { id: "p5", nama: "Singkong Gajah", kategori: "Perkebunan", hargaPerKg: 3200, stokKg: 1120, minPesanan: 500, status: "DIARSIPKAN", sertifikasi: [], umurSimpanHari: 14, warnaVisual: "Putih Krem", gradeKualitas: "C" },
];

const FORM_KOSONG = {
  nama: "",
  kategori: KATEGORI_PRODUK[0] ?? "",
  hargaPerKg: "",
  stokKg: "",
  beratSatuan: "1",
  minPesanan: "10",
  umurSimpanHari: "",
  warnaVisual: "",
  gradeKualitas: "",
};

/** Validasi form — dipakai sebelum submit. Mengembalikan { field: pesan }. */
function validasiForm(f) {
  const err = {};
  if (!f.nama.trim()) err.nama = "Nama produk wajib diisi.";
  if (!f.kategori) err.kategori = "Kategori wajib dipilih.";
  if (!f.hargaPerKg || parseFloat(f.hargaPerKg) <= 0) err.hargaPerKg = "Harga harus lebih dari 0.";
  if (f.stokKg === "" || parseFloat(f.stokKg) < 0) err.stokKg = "Stok tidak boleh negatif.";
  if (!f.beratSatuan || parseFloat(f.beratSatuan) <= 0) err.beratSatuan = "Berat satuan harus lebih dari 0.";
  // FIX TUGAS 4 — tiga field wajib baru:
  if (f.umurSimpanHari === "" || parseInt(f.umurSimpanHari) < 0 || Number.isNaN(parseInt(f.umurSimpanHari)))
    err.umurSimpanHari = "Umur simpan (hari) wajib diisi, angka ≥ 0.";
  if (!f.warnaVisual.trim()) err.warnaVisual = "Warna visual wajib diisi.";
  if (!["A", "B", "C"].includes(f.gradeKualitas)) err.gradeKualitas = "Pilih salah satu grade: A, B, atau C.";
  return err;
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-400 mb-1.5 block">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

/** Modal Tambah Produk — self-contained, tanpa dependency Dialog eksternal. */
function TambahProdukModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(FORM_KOSONG);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    const err = validasiForm(form);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSaving(true);
    // Mock latency — endpoint sungguhan: POST /api/produk (validasi sama di server).
    setTimeout(() => {
      onSubmit({
        id: `p_${Date.now()}`,
        nama: form.nama.trim(),
        kategori: form.kategori,
        hargaPerKg: parseFloat(form.hargaPerKg),
        stokKg: parseFloat(form.stokKg),
        minPesanan: parseFloat(form.minPesanan) || 10,
        status: parseFloat(form.stokKg) > 0 ? "AKTIF" : "HABIS",
        sertifikasi: [],
        umurSimpanHari: parseInt(form.umurSimpanHari),
        warnaVisual: form.warnaVisual.trim(),
        gradeKualitas: form.gradeKualitas,
      });
      setSaving(false);
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-slate-900">
          <h2 className="text-base font-semibold text-slate-50">Tambah Produk</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField label="Nama Produk" error={errors.nama}>
            <Input value={form.nama} onChange={update("nama")} placeholder="Contoh: Mangga Harum Manis" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kategori" error={errors.kategori}>
              <Select value={form.kategori} onChange={update("kategori")}>
                {KATEGORI_PRODUK.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Harga / kg (Rp)" error={errors.hargaPerKg}>
              <Input type="number" value={form.hargaPerKg} onChange={update("hargaPerKg")} placeholder="12500" />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Stok (kg)" error={errors.stokKg}>
              <Input type="number" value={form.stokKg} onChange={update("stokKg")} placeholder="1000" />
            </FormField>
            <FormField label="Berat Satuan (kg)" error={errors.beratSatuan}>
              <Input type="number" value={form.beratSatuan} onChange={update("beratSatuan")} placeholder="1" />
            </FormField>
            <FormField label="Min. Pesanan (kg)">
              <Input type="number" value={form.minPesanan} onChange={update("minPesanan")} placeholder="10" />
            </FormField>
          </div>

          {/* ── FIX TUGAS 4: tiga field wajib baru ── */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3">
              Detail Kualitas Produk
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Umur Simpan (hari)" error={errors.umurSimpanHari}>
                <Input
                  type="number"
                  value={form.umurSimpanHari}
                  onChange={update("umurSimpanHari")}
                  placeholder="mis. 7"
                />
              </FormField>
              <FormField label="Grade Kualitas" error={errors.gradeKualitas}>
                <Select value={form.gradeKualitas} onChange={update("gradeKualitas")}>
                  <option value="">Pilih grade...</option>
                  <option value="A">A — Premium</option>
                  <option value="B">B — Standar</option>
                  <option value="C">C — Ekonomis</option>
                </Select>
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Warna Visual" error={errors.warnaVisual}>
                <Input
                  value={form.warnaVisual}
                  onChange={update("warnaVisual")}
                  placeholder="mis. Kuning Cerah, Merah Segar"
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TokoPage() {
  const [produk, setProduk] = useState(PRODUK_SAYA);
  const [cari, setCari] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [editId, setEditId] = useState(null);
  const [stokBaru, setStokBaru] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  function tambahProdukBaru(produkBaru) {
    setProduk((prev) => [produkBaru, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="section-heading">Toko Saya</h1>
          <p className="mt-1 text-sm text-slate-400">Kelola produk, stok, dan status penjualan Anda.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
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
                <th className="px-5 py-3 font-medium">Grade</th>
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
                            {p.warnaVisual && (
                              <span className="text-xs text-slate-600">· {p.warnaVisual}</span>
                            )}
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
                    <td className="px-5 py-3.5">
                      {p.gradeKualitas ? (
                        <Badge tone={GRADE_TONE[p.gradeKualitas]} size="xs">
                          Grade {p.gradeKualitas}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>
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

      {showForm && (
        <TambahProdukModal onClose={() => setShowForm(false)} onSubmit={tambahProdukBaru} />
      )}
    </div>
  );
}
