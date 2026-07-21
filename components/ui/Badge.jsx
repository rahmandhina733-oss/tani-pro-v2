import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Badge — UI Primitive (cva + cn)
 *
 * FASE 2 (Pilar 1.2 & 5.2): menggantikan object `badgeStyles` lokal dan
 * string `bg-*-500/15 text-*-400 border-*-500/20` yang tersebar di katalog,
 * checkout, dan halaman admin. Semua class ditulis LITERAL (aman dari
 * Tailwind JIT purge — pelajaran dari FIX P0 #5).
 *
 * Contoh:
 *   <Badge>Terlaris</Badge>
 *   <Badge tone="amber" size="pill">✦ Direkomendasikan</Badge>
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold border rounded-full",
  {
    variants: {
      tone: {
        emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/15 text-blue-400 border-blue-500/20",
        teal: "bg-teal-500/15 text-teal-400 border-teal-500/20",
        red: "bg-red-500/15 text-red-400 border-red-500/20",
        rose: "bg-rose-500/15 text-rose-400 border-rose-500/20",
        purple: "bg-purple-500/15 text-purple-400 border-purple-500/20",
        amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
        yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
        slate: "bg-slate-800 text-slate-400 border-transparent rounded",
      },
      size: {
        xs: "text-xs px-1.5 py-0.5 rounded",
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
      },
    },
    defaultVariants: {
      tone: "emerald",
      size: "sm",
    },
  }
);

export default function Badge({ className, tone, size, ...props }) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
  );
}
