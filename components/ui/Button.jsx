"use client";

import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Button — UI Primitive (cva + cn)
 *
 * FASE 2 (Pilar 1.2 & 5.2): merangkum seluruh varian tombol glassmorphism
 * TaniPro yang sebelumnya berupa string Tailwind repetitif di banyak halaman:
 *   - primary : emerald solid (CTA utama: "Tambah ke Pesanan", "Konfirmasi")
 *   - ghost   : bg-white/5 + border-white/10 (tombol sekunder "Kembali")
 *   - outline : transparan berbatas, untuk aksi tersier
 *   - danger  : rose, aksi destruktif
 *   - link    : teks emerald tanpa latar
 *
 * Contoh:
 *   <Button>Simpan</Button>
 *   <Button variant="ghost" size="sm">Kembali</Button>
 *   <Button variant="danger" size="icon" aria-label="Hapus"><Trash2 /></Button>
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const buttonVariants = cva(
  // base — dipakai semua varian
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-emerald-500 text-white hover:bg-emerald-400",
        ghost:
          "bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/8 hover:text-slate-200",
        outline:
          "border border-white/10 text-slate-400 font-medium hover:text-slate-200 hover:bg-white/5 hover:border-white/20",
        danger:
          "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20",
        link: "text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2.5",
        lg: "text-sm px-6 py-3",
        icon: "w-7 h-7 rounded-lg text-sm",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

const Button = forwardRef(function Button(
  { className, variant, size, fullWidth, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});

export default Button;
