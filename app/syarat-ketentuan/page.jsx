import Navbar from "@/components/shared/Navbar";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * /syarat-ketentuan — Syarat & Ketentuan (Terms & Conditions)
 *
 * Halaman statis publik — mengikuti pola /tentang-fitur (Navbar polos,
 * Server Component, tanpa Sidebar/DashboardLayout, sebab konten legal
 * harus tetap terbaca sebelum pengguna login).
 *
 * CATATAN TIPOGRAFI: proyek ini TIDAK menginstal plugin @tailwindcss/
 * typography (dicek di tailwind.config.js — hanya `tailwindcss-animate`),
 * sehingga class `prose` tidak akan bekerja tanpa menambah dependency baru.
 * Sesuai opsi fallback di brief, margin/line-height diatur manual di bawah
 * agar teks panjang tetap nyaman dibaca tanpa perlu instalasi tambahan.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan Ketentuan penggunaan platform Agrilogistik B2B TaniPro.",
};

const SECTIONS = [
  {
    id: "definisi",
    title: "1. Definisi",
    body: [
      `"Platform" berarti aplikasi web dan layanan TaniPro, termasuk namun tidak terbatas pada marketplace komoditas, sistem logistik VMS (Vehicle Management System), fitur pembayaran Escrow, dan program Tani Point.`,
      `"Pengguna" berarti setiap pihak yang mendaftar dan menggunakan Platform, terdiri dari tiga peran: Petani (penjual komoditas), Pembeli (badan usaha B2B), dan Admin (operator internal TaniPro).`,
      `"Transaksi" berarti setiap kesepakatan jual-beli komoditas pertanian yang difasilitasi melalui Platform, termasuk proses checkout, pengiriman, dan pelepasan dana Escrow.`,
    ],
  },
  {
    id: "ketentuan-umum",
    title: "2. Ketentuan Umum",
    body: [
      `Dengan mengakses dan menggunakan Platform, Pengguna dianggap telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini beserta perubahannya di kemudian hari.`,
      `TaniPro berhak menolak, menangguhkan, atau menghentikan akses Pengguna yang terbukti melanggar ketentuan ini, memberikan data palsu, atau melakukan tindakan yang merugikan Pengguna lain maupun Platform.`,
      `Layanan Platform disediakan "sebagaimana adanya" (as-is) dan dapat mengalami penyesuaian fitur, pemeliharaan terjadwal, atau perubahan tampilan tanpa mengurangi fungsi inti layanan.`,
    ],
  },
  {
    id: "akun-verifikasi",
    title: "3. Akun & Verifikasi",
    body: [
      `Pembeli wajib melengkapi data badan usaha (nama perusahaan, NPWP, alamat kantor, dan bidang industri) untuk proses verifikasi sebelum dapat melakukan Transaksi dalam jumlah besar.`,
      `Petani wajib melengkapi data kebun/koperasi dan dapat mengajukan sertifikasi organik untuk mendapatkan lencana verifikasi tambahan pada katalog produknya.`,
      `Pengguna bertanggung jawab penuh atas kerahasiaan kredensial akun (email dan kata sandi) serta seluruh aktivitas yang terjadi melalui akun tersebut.`,
    ],
  },
  {
    id: "transaksi-pembayaran",
    title: "4. Transaksi & Pembayaran (Escrow)",
    body: [
      `Seluruh Transaksi disarankan menggunakan mekanisme Escrow TaniPro, di mana dana Pembeli ditahan oleh Platform hingga barang diterima dan dikonfirmasi sesuai spesifikasi pesanan.`,
      `Dana Escrow akan dilepaskan kepada Petani/koperasi penjual secara otomatis dalam jangka waktu tertentu setelah konfirmasi penerimaan, atau lebih cepat apabila Pembeli mengonfirmasi secara manual.`,
      `Apabila timbul sengketa atas kualitas, jumlah, atau kondisi barang, Pengguna dapat mengajukan klaim melalui Platform sebelum dana Escrow dilepaskan, dan tim Admin akan melakukan mediasi berdasarkan bukti yang diajukan kedua pihak.`,
      `TaniPro tidak memungut biaya tambahan atas penggunaan layanan Escrow, kecuali biaya logistik yang telah disepakati pada tahap checkout.`,
    ],
  },
  {
    id: "logistik-pengiriman",
    title: "5. Logistik & Pengiriman",
    body: [
      `Estimasi armada, rute, dan biaya logistik dihitung oleh sistem Smart Load & VMS TaniPro berdasarkan total berat, volume muatan, dan jarak tempuh menuju lokasi tujuan.`,
      `Pembeli bertanggung jawab memastikan alamat dan detail penerima yang dicantumkan sudah benar; keterlambatan akibat kesalahan data alamat bukan merupakan tanggung jawab TaniPro maupun mitra armada.`,
      `Kerusakan atau kekurangan barang selama pengiriman dapat dilaporkan melalui fitur pelacakan pesanan dalam waktu 24 jam sejak barang diterima untuk diproses lebih lanjut oleh tim Admin.`,
    ],
  },
  {
    id: "esg-data",
    title: "6. Kebijakan ESG & Data",
    body: [
      `TaniPro menghitung estimasi jejak karbon (CO₂e) setiap Transaksi menggunakan metodologi GHG Protocol Scope 3 — Category 4, berdasarkan berat muatan, jarak tempuh, dan jenis armada yang digunakan.`,
      `Data ESG yang dihasilkan bersifat estimasi untuk keperluan pelaporan keberlanjutan Pembeli dan tidak dimaksudkan sebagai sertifikasi resmi pihak ketiga, kecuali dinyatakan lain secara tertulis.`,
      `Data pribadi dan data transaksi Pengguna dikelola sesuai peraturan perlindungan data yang berlaku di Indonesia, dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.`,
    ],
  },
  {
    id: "tani-point",
    title: "7. Tani Point (Gamifikasi)",
    body: [
      `Tani Point adalah poin loyalitas yang diperoleh Pengguna dari aktivitas Transaksi di Platform — Pembeli memperoleh poin berdasarkan nilai belanja, Petani memperoleh poin berdasarkan volume penjualan.`,
      `Poin dapat digunakan untuk potongan harga pada Transaksi berikutnya sesuai rasio konversi yang berlaku, dan tidak dapat dicairkan menjadi uang tunai maupun dipindahtangankan ke akun lain.`,
      `Level keanggotaan (Benih, Tunas, Petani, Maestro) ditentukan oleh akumulasi Tani Point dan dapat memengaruhi akses ke fitur premium seperti konsultasi AI lanjutan atau prioritas dukungan pelanggan.`,
    ],
  },
  {
    id: "batasan-tanggung-jawab",
    title: "8. Pembatasan Tanggung Jawab",
    body: [
      `TaniPro berperan sebagai penyedia platform yang menghubungkan Petani dan Pembeli; TaniPro bukan pihak dalam perjanjian jual-beli itu sendiri dan tidak menjamin kualitas komoditas di luar deskripsi yang dicantumkan penjual.`,
      `TaniPro tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan, atau gangguan usaha yang timbul akibat force majeure, gangguan jaringan, atau kondisi di luar kendali wajar Platform.`,
    ],
  },
  {
    id: "sengketa-hukum",
    title: "9. Sengketa & Hukum yang Berlaku",
    body: [
      `Setiap sengketa yang timbul dari penggunaan Platform akan diselesaikan terlebih dahulu melalui mediasi internal TaniPro sebelum ditempuh jalur hukum lebih lanjut.`,
      `Syarat & Ketentuan ini diatur dan ditafsirkan berdasarkan hukum yang berlaku di Republik Indonesia.`,
    ],
  },
  {
    id: "perubahan-ketentuan",
    title: "10. Perubahan Ketentuan",
    body: [
      `TaniPro dapat memperbarui Syarat & Ketentuan ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui Platform atau email terdaftar Pengguna sebelum berlaku efektif.`,
      `Penggunaan Platform secara berkelanjutan setelah perubahan berlaku dianggap sebagai persetujuan Pengguna terhadap Syarat & Ketentuan yang telah diperbarui.`,
    ],
  },
];

export default function SyaratKetentuanPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Header */}
          <div className="mb-10 max-w-2xl">
            <h1 className="font-display text-3xl text-slate-50 mb-2">Syarat &amp; Ketentuan</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Berlaku efektif sejak 21 Juli 2026. Dokumen ini mengatur penggunaan platform
              Agrilogistik B2B TaniPro oleh Petani, Pembeli, dan mitra logistik.
            </p>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            {/* Daftar Isi — sticky di kiri */}
            <nav aria-label="Daftar isi" className="hidden lg:block">
              <div className="sticky top-24 glass-card p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Daftar Isi
                </p>
                <ul className="space-y-1">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors py-1 leading-snug"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Daftar isi versi mobile (dropdown ringkas di atas konten) */}
            <nav aria-label="Daftar isi (mobile)" className="lg:hidden -mt-2">
              <details className="glass-card p-4">
                <summary className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                  Daftar Isi
                </summary>
                <ul className="mt-3 space-y-1 border-t border-white/10 pt-3">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="block text-sm text-slate-400 hover:text-emerald-400 py-1">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </nav>

            {/* Konten — tipografi manual (tanpa plugin @tailwindcss/typography) */}
            <article className="max-w-2xl">
              {SECTIONS.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className={`scroll-mt-24 ${i > 0 ? "mt-10 pt-10 border-t border-white/[0.06]" : ""}`}
                >
                  <h2 className="text-lg font-semibold text-slate-100 mb-3">{s.title}</h2>
                  <div className="space-y-3.5">
                    {s.body.map((p, idx) => (
                      <p key={idx} className="text-[15px] text-slate-400 leading-[1.8]">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <p className="mt-12 pt-8 border-t border-white/[0.06] text-xs text-slate-600">
                Ada pertanyaan mengenai dokumen ini? Hubungi tim kami melalui halaman{" "}
                <a href="/tentang-fitur" className="text-emerald-400 hover:text-emerald-300">
                  Tentang Fitur
                </a>{" "}
                atau email resmi TaniPro.
              </p>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
