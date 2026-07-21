"use client";

import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Input & Select — UI Primitives (cva + cn)
 *
 * FASE 2 (Pilar 1.2 & 5.2): merangkum field glassmorphism yang sebelumnya
 * diulang (bg-white/5 + border-white/10 + focus:border-emerald-500/50)
 * di katalog (qty), checkout (jarak KM, dropdown kota), dan form login.
 *
 * Contoh:
 *   <Input type="number" value={qty} onChange={...} align="center" />
 *   <Select value={city} onChange={...}><option .../></Select>
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const inputVariants = cva(
  "w-full bg-white/5 border border-white/10 text-slate-200 rounded-lg transition-colors placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      fieldSize: {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-3 py-2.5",
        lg: "text-base px-4 py-3",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      fieldSize: "md",
      align: "left",
    },
  }
);

export const Input = forwardRef(function Input(
  { className, fieldSize, align, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(inputVariants({ fieldSize, align }), className)}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className, fieldSize, align, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        inputVariants({ fieldSize, align }),
        "appearance-none cursor-pointer [&>option]:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export default Input;
