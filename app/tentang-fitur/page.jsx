import Link from "next/link";
import {
  BarChart2, Truck, BrainCircuit, Package, ShieldCheck, Star,
  ArrowRight, CheckCircle2, Leaf,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /tentang-fitur — Kerangka Halaman Detail Fitur
 *
 * CATATAN ARSITEKTUR (hasil evaluasi UX/UI):
 * Penjelasan mendalam mengenai ESG, VMS (Vehicle Management System), dan
 * AI Konsultan DIPINDAHKAN dari Landing Page ke halaman ini agar Landing
 * tetap ringkas. Setiap seksi memiliki anchor id (#esg, #vms, #ai, dst.)
 * yang ditautkan dari Navbar dan kartu fitur Landing Page.
 *
 * Konten di bawah masih berupa KERANGKA (skeleton) — copywriting final,
 * ilustrasi, dan data studi kasus akan diisi pada iterasi berikutnya.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const metadata = {
  title: "Tentang Fitur",
  description:
    "Pelajari lebih dalam fitur ESG Reporting, Smart Logistics VMS, dan AI Konsultan di platform TaniPro.",
};

const SECTIONS = [
  {
    id:     "esg",
    badge:  "Keberlanjutan",
    icon:   <BarChart2 className="w-7 h-7" />,
    accent: "text-teal-400",
    border: "border-teal-500/20",
    glow:   "bg-teal-500/5",
    title:  "ESG Reporting Otomatis",
    lede:
      "Setiap pengiriman TaniPro dihitung jejak karbonnya secara real-time menggunakan metodologi GHG Protocol Scope 3, lalu dirangkum menjadi laporan ESG yang siap diaudit.",
    points: [
      "Kalkulasi CO2e per pengiriman: selisih emisi armada konvensional vs armada rekomendasi AI TaniPro.",
      "Dashboard agregat bulanan/kuartalan untuk laporan keberlanjutan perusahaan.",
      "Ekspor data sesuai kerangka GRI & standar pelaporan Scope 3.",
      "Sertifikat penghematan emisi per transaksi untuk lampiran tender.",
    ],
    placeholder: "Visualisasi grafik CO2e — segera hadir",
  },
  {
    id:     "vms",
    badge:  "Logistik Cerdas",
    icon:   <Truck className="w-7 h-7" />,
    accent: "text-blue-400",
    border: "border-blue-500/20",
    glow:   "bg-blue-500/5",
    title:  "VMS — Vehicle Management System",
    lede:
      "Sistem manajemen armada 3PL yang merekomendasikan kendaraan optimal (CDE, CDD, atau Fuso) berdasarkan total berat, volume, dan rute pesanan Anda.",
    points: [
      "Rekomendasi armada otomatis: muatan dioptimalkan agar tidak membayar ruang kosong.",
      "Load Optimizer: konsolidasi beberapa pesanan dalam satu rute untuk menekan biaya.",
      "Live GPS tracking dan ETA dinamis untuk setiap pengiriman.",
      "Riwayat performa armada dan mitra logistik yang transparan.",
    ],
    placeholder: "Diagram alur rekomendasi armada — segera hadir",
  },
  {
    id:     "ai",
    badge:  "Kecerdasan Buatan",
    icon:   <BrainCircuit className="w-7 h-7" />,
    accent: "text-violet-400",
    border: "border-violet-500/20",
    glow:   "bg-violet-500/5",
    title:  "AI Konsultan Petani",
    lede:
      "Asisten cerdas yang membantu petani mengambil keputusan bisnis: dari analisis harga pasar hingga strategi tanam berbasis prediksi cuaca.",
    points: [
      "Analisis tren harga komoditas lintas wilayah secara berkala.",
      "Rekomendasi waktu tanam & panen berdasarkan data cuaca.",
      "Saran strategi penjualan: kapan jual spot, kapan buka pre-order.",
      "Akses konsultasi premium via penukaran Tani Point.",
    ],
    placeholder: "Pratinjau antarmuka percakapan AI — segera hadir",
  },
];

/* Seksi sekunder — kerangka ringkas untuk fitur lain yang ditautkan dari Landing */
const SECONDARY = [
  {
    id:    "marketplace",
    icon:  <Package className="w-5 h-5" />,
    title: "B2B Marketplace",
    desc:  "Katalog ribuan produk pertanian dari petani terverifikasi dengan harga transparan.",
  },
  {
    id:    "escrow",
    icon:  <ShieldCheck className="w-5 h-5" />,
    title: "Escrow Payment",
    desc:  "Dana tersimpan aman dan hanya dilepas ke petani setelah barang diterima pembeli.",
  },
  {
    id:    "tani-point",
    icon:  <Star className="w-5 h-5" />,
    title: "Tani Point Loyalty",
    desc:  "Poin dari setiap transaksi — diskon untuk pembeli, konsultasi premium untuk petani.",
  },
];

export default function TentangFiturPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="pt-20 pb-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 mb-6">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300 tracking-wide">
                Tentang Fitur TaniPro
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-slate-50 tracking-tight mb-4">
              Teknologi di Balik{" "}
              <span className="text-gradient-emerald">Rantai Pasok</span> Anda
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Pelajari lebih dalam bagaimana ESG Reporting, Smart Logistics VMS,
              dan AI Konsultan bekerja untuk bisnis Anda.
            </p>
          </div>
        </section>

        {/* ── Seksi utama: ESG / VMS / AI ── */}
        <div className="max-w-5xl mx-auto px-4 space-y-16 pb-20">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className={`scroll-mt-24 glass-card rounded-3xl p-8 sm:p-10 border ${s.border} ${s.glow} relative overflow-hidden`}
            >
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Text — alternating layout */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${s.border} ${s.accent} mb-4`}>
                    {s.badge}
                  </span>
                  <div className={`flex items-center gap-3 mb-3 ${s.accent}`}>
                    {s.icon}
                    <h2 className="font-display text-3xl text-slate-50 tracking-tight">
                      {s.title}
                    </h2>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-6">{s.lede}</p>
                  <ul className="space-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${s.accent}`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual placeholder (skeleton) */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className={`glass-card rounded-2xl border ${s.border} h-64 flex items-center justify-center`}>
                    <p className="text-xs text-slate-600 px-6 text-center">
                      [Kerangka] {s.placeholder}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* ── Seksi sekunder ── */}
          <section className="grid md:grid-cols-3 gap-4">
            {SECONDARY.map((f) => (
              <div key={f.id} id={f.id} className="scroll-mt-24 glass-card p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-emerald-400">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-50 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </section>

          {/* ── CTA penutup — murni ke /login ── */}
          <section className="text-center py-8">
            <h2 className="font-display text-3xl text-slate-50 tracking-tight mb-3">
              Siap Memulai?
            </h2>
            <p className="text-slate-400 mb-8">
              Semua fitur di atas tersedia setelah Anda masuk atau mendaftar.
            </p>
            <Link
              href="/login"
              className="btn-emerald text-base px-8 py-3.5 rounded-2xl shadow-glow-emerald"
            >
              Masuk / Daftar Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
