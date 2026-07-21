/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is default in Next.js 14
  //
  // FIX P0: sebelumnya ada DUA deklarasi key `experimental` dalam satu objek.
  // Di JavaScript, key duplikat membuat deklarasi pertama tertimpa diam-diam
  // (silent override) — sumber bug konfigurasi yang sulit dilacak.
  // Semua opsi kini digabung dalam SATU blok `experimental`.
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
    // Silence Prisma Edge warnings in App Router
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

module.exports = nextConfig;
