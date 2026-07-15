import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata = {
  title: {
    default: "TaniPro — Platform Agrilogistik B2B Indonesia",
    template: "%s | TaniPro",
  },
  description:
    "Platform-as-a-Service menghubungkan petani langsung dengan pembeli industri B2B. Logistik cerdas, ESG terukur, pembayaran aman.",
  keywords: [
    "agrilogistik",
    "pertanian indonesia",
    "B2B marketplace",
    "supply chain pertanian",
    "TaniPro",
  ],
  authors: [{ name: "TaniPro Team" }],
  creator: "TaniPro",
  metadataBase: new URL("https://tanipro.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://tanipro.id",
    title: "TaniPro — Platform Agrilogistik B2B Indonesia",
    description:
      "Menghubungkan petani langsung dengan pembeli industri B2B melalui logistik cerdas dan pembayaran escrow.",
    siteName: "TaniPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaniPro — Platform Agrilogistik B2B Indonesia",
    description:
      "Menghubungkan petani langsung dengan pembeli industri B2B.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${dmSerif.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* Ambient background glow — top left emerald, bottom right teal */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
          <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-900/5 blur-[150px]" />
        </div>

        {children}
      </body>
    </html>
  );
}
