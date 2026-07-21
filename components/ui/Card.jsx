import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Card — UI Primitive (cva + cn)
 *
 * FASE 2 (Pilar 1.2 & 5.2): merangkum permukaan glassmorphism TaniPro yang
 * sebelumnya diulang di hampir setiap halaman:
 *   - default : bg-white/[0.03] + border-white/10 (kartu standar)
 *   - subtle  : bg-white/[0.02] + border-white/5 (baris item di dalam kartu)
 *   - emerald : gradasi emerald/teal + backdrop-blur (panel ESG)
 *   - solid   : bg-slate-800/50 (kotak angka ringkasan)
 *
 * Prop `hoverable` menambah efek hover emerald glow (dipakai kartu produk).
 * Prop `as` mengizinkan elemen semantik lain (mis. as="section").
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const cardVariants = cva("border rounded-2xl", {
  variants: {
    variant: {
      default: "bg-white/[0.03] border-white/10",
      subtle: "bg-white/[0.02] border-white/5 rounded-xl",
      emerald:
        "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-teal-500/5 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(16,185,129,0.25)]",
      teal:
        "border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 backdrop-blur-md rounded-xl",
      solid: "bg-slate-800/50 border-white/5 rounded-xl",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-6",
    },
    hoverable: {
      true: "backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.2)]",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "none",
    hoverable: false,
  },
});

const Card = forwardRef(function Card(
  { className, variant, padding, hoverable, as: Comp = "div", ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={cn(cardVariants({ variant, padding, hoverable }), className)}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn(
        "text-base font-semibold text-slate-200 flex items-center gap-2",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-xs text-slate-500 mt-0.5", className)} {...props} />;
}

export default Card;
