import Link from "next/link";
import {
  Leaf, Truck, ShieldCheck, BarChart2,
  BrainCircuit, Star, ArrowRight, CheckCircle2,
  Package, MapPin, Zap,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";

// ─────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────

const STATS = [
  { value: "2.400+", label: "Petani Terdaftar",    suffix: "" },
  { value: "340+",   label: "Perusahaan Pembeli",  suffix: "" },
  { value: "98.2%",  label: "On-time Delivery",    suffix: "" },
  { value: "12.8K",  label: "Ton CO2e Dihemat",    suffix: "" },
];

const FEATURES = [
  {
    icon: <Package className="w-6 h-6" />,
    title: "B2B Marketplace Katalog",
    desc:  "Ribuan produk pertanian premium langsung dari petani terverifikasi. Harga transparan, kualitas terjamin.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border:"border-emerald-500/15",
    accent:"text-emerald-400",
    href:  "/pembeli/katalog",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Smart Logistics 3PL",
    desc:  "Rekomendasi armada CDE, CDD, atau Fuso otomatis berdasarkan berat dan dimensi pesanan Anda.",
    color: "from-blue-500/20 to-blue-500/5",
    border:"border-blue-500/15",
    accent:"text-blue-400",
    href:  "/pembeli/checkout",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Escrow Payment",
    desc:  "Dana pembayaran tersimpan aman dan hanya dilepas ke petani setelah barang Anda terima.",
    color: "from-purple-500/20 to-purple-500/5",
    border:"border-purple-500/15",
    accent:"text-purple-400",
    href:  "/pembeli/escrow",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "ESG Reporting",
    desc:  "Dashboard CO2e real-time menggunakan metodologi GHG Protocol Scope 3. Siap untuk laporan ESG perusahaan.",
    color: "from-teal-500/20 to-teal-500/5",
    border:"border-teal-500/15",
    accent:"text-teal-400",
    href:  "/pembeli/esg",
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "AI Konsultan Petani",
    desc:  "Analisis harga pasar, prediksi cuaca, strategi tanam — semua berbasis AI untuk keputusan bisnis lebih cerdas.",
    color: "from-violet-500/20 to-violet-500/5",
    border:"border-violet-500/15",
    accent:"text-violet-400",
    href:  "/petani/ai-konsultan",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Tani Point Loyalty",
    desc:  "Setiap transaksi menghasilkan poin. Pembeli dapat diskon, petani dapat akses konsultasi premium.",
    color: "from-amber-500/20 to-amber-500/5",
    border:"border-amber-500/15",
    accent:"text-amber-400",
    href:  "/pembeli/tani-point",
  },
];

const ROLES = [
  {
    role:    "Pembeli",
    tagline: "Dapatkan produk pertanian premium langsung dari sumbernya",
    bullets: [
      "Akses 2.400+ petani terverifikasi",
      "Harga lebih efisien tanpa perantara",
      "Laporan ESG otomatis tiap transaksi",
      "Pembayaran aman via escrow",
    ],
    href:    "/pembeli",
    color:   "from-blue-500 to-cyan-400",
    bgGlow:  "bg-blue-500/5",
    border:  "border-blue-500/20",
    badge:   "Untuk Perusahaan",
  },
  {
    role:    "Petani",
    tagline: "Jangkau pasar B2B lebih luas, kelola usaha lebih cerdas",
    bullets: [
      "Storefront digital untuk produk Anda",
      "Fitur Pre-Order untuk kepastian panen",
      "AI Konsultan untuk strategi bisnis",
      "Tani Point dari setiap kg terjual",
    ],
    href:    "/petani",
    color:   "from-emerald-500 to-teal-400",
    bgGlow:  "bg-emerald-500/5",
    border:  "border-emerald-500/20",
    badge:   "Untuk Petani & Koperasi",
  },
];

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-20 pb-28 px-4">
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(52,211,153,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          <div className="max-w-5xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300 tracking-wide">
                Platform Agrilogistik B2B #1 Indonesia
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-slate-50 leading-[1.05] tracking-tight mb-6">
              Dari Ladang ke{" "}
              <span className="text-gradient-emerald animate-gradient">
                Industri
              </span>
              ,<br />
              Tanpa Perantara
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              TaniPro menghubungkan petani Indonesia langsung dengan pembeli industri B2B
              melalui logistik cerdas, pembayaran escrow, dan pelaporan ESG otomatis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/pembeli" className="btn-emerald text-base px-8 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Mulai sebagai Pembeli
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/petani" className="btn-ghost text-base px-8 py-3.5 rounded-2xl">
                Daftarkan Toko Petani
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
              {["Kementan RI Verified", "GHG Protocol Certified", "OJK Escrow Licensed"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — floating dashboard mockup */}
          <div className="mt-16 max-w-4xl mx-auto relative">
            <div className="glass-card p-1 border-white/10 shadow-2xl shadow-black/50">
              {/* Fake dashboard header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center px-3">
                  <span className="text-xs text-slate-600">tanipro.id/pembeli</span>
                </div>
              </div>

              {/* Mock dashboard content */}
              <div className="p-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Pesanan", val: "247",        color: "text-emerald-400" },
                  { label: "Nilai Transaksi", val: "Rp 8.2M", color: "text-blue-400" }, ,
                  { label: "CO2e Dihemat",  val: "1.24 ton",  color: "text-teal-400" },
                  { label: "Tani Point",    val: "8.240 pt",  color: "text-amber-400" },
                ].map((m, i) => (
                  <div key={i} className="glass-card p-3 rounded-xl">
                    <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                    <p className={`text-base font-bold tabular-nums ${m.color}`}>{m.val}</p>
                  </div>
                ))}
                {/* Fake chart bar */}
                <div className="col-span-3 sm:col-span-4 glass-card p-3 rounded-xl">
                  <p className="text-[10px] text-slate-500 mb-3">Volume Pembelian (ton) — 6 Bulan Terakhir</p>
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 45, 80, 72, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {["Feb","Mar","Apr","Mei","Jun","Jul"].map((m) => (
                      <span key={m} className="text-[9px] text-slate-600 flex-1 text-center">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating GPS card */}
            <div className="absolute -right-4 top-8 hidden lg:block glass-card p-3 w-44 shadow-xl shadow-black/40">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-slate-300">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-gps-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-emerald-400 block" />
                </div>
                <span className="text-[11px] text-slate-400">Fuso-012 • Surabaya</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">ETA: 2j 14m</div>
            </div>

            {/* Floating escrow card */}
            <div className="absolute -left-4 bottom-8 hidden lg:block glass-card p-3 w-44 shadow-xl shadow-black/40">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-slate-300">Escrow Aktif</span>
              </div>
              <p className="text-base font-bold text-purple-300 tabular-nums">Rp 142.5 jt</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Dana terkunci aman</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════ */}
        <section className="border-y border-white/[0.06] bg-white/[0.015] py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-gradient-emerald tabular-nums">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
            FEATURES GRID
        ════════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
                Ekosistem Lengkap
              </p>
              <h2 className="font-display text-4xl text-slate-50 tracking-tight mb-4">
                Semua yang Anda Butuhkan,<br />Dalam Satu Platform
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Dari katalog hingga pengiriman, dari pembayaran hingga laporan ESG —
                TaniPro menangani seluruh rantai pasok pertanian Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className={`
                    group relative glass-card p-6 rounded-2xl border ${f.border}
                    bg-gradient-to-br ${f.color}
                    hover:border-white/20 hover:shadow-lg hover:shadow-black/20
                    transition-all duration-300 hover:-translate-y-0.5
                  `}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border ${f.border} flex items-center justify-center mb-4 ${f.accent}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-50 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    Lihat detail <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            ROLE CTAs
        ════════════════════════════════════ */}
        <section className="py-20 px-4 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl text-slate-50 tracking-tight mb-3">
                Bergabung sebagai Siapa?
              </h2>
              <p className="text-slate-400">Platform yang dirancang khusus untuk setiap peran dalam rantai pasok pertanian.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {ROLES.map((r) => (
                <div
                  key={r.role}
                  className={`glass-card rounded-2xl p-8 border ${r.border} ${r.bgGlow} relative overflow-hidden`}
                >
                  {/* Background gradient orb */}
                  <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${r.color} opacity-10 blur-3xl`} />

                  <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${r.border} mb-4`}
                    style={{ color: "inherit" }}>
                    {r.badge}
                  </span>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${r.color} bg-clip-text text-transparent mb-2`}>
                    {r.role}
                  </h3>
                  <p className="text-slate-400 text-sm mb-5">{r.tagline}</p>
                  <ul className="space-y-2 mb-6">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={r.href}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r ${r.color} hover:opacity-90 transition-opacity shadow-lg`}
                  >
                    Masuk ke Dashboard {r.role}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Admin link */}
            <div className="mt-4 text-center">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Admin Command Center
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <footer className="border-t border-white/[0.06] py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
              {/* Brand */}
              <div className="max-w-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
                  </div>
                  <span className="font-display text-lg text-slate-50">
                    Tani<span className="text-emerald-400">Pro</span>
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Platform Agrilogistik B2B Indonesia. Menghubungkan petani dan industri
                  melalui teknologi cerdas dan rantai pasok yang berkelanjutan.
                </p>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                {[
                  {
                    heading: "Platform",
                    links: ["Pembeli", "Petani", "Admin", "API"],
                  },
                  {
                    heading: "Fitur",
                    links: ["Marketplace", "Logistik 3PL", "Escrow", "ESG Report"],
                  },
                  {
                    heading: "Perusahaan",
                    links: ["Tentang Kami", "Blog", "Karir", "Kontak"],
                  },
                ].map((col) => (
                  <div key={col.heading}>
                    <p className="font-semibold text-slate-300 mb-3">{col.heading}</p>
                    <ul className="space-y-2">
                      {col.links.map((l) => (
                        <li key={l}>
                          <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                            {l}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="emerald-divider" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
              <p>© 2025 TaniPro. Hak cipta dilindungi.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-slate-400 transition-colors">Syarat & Ketentuan</a>
                <a href="#" className="hover:text-slate-400 transition-colors">Hubungi Kami</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
