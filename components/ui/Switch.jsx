"use client";

import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Switch — UI Primitive (toggle on/off)
 *
 * Ditambahkan untuk halaman Pengaturan (Fase 3) — mengikuti pola UI
 * primitives cva-lite lain di components/ui/ (Button, Card, Badge, Input).
 * Controlled component murni: state disimpan di komponen pemanggil.
 *
 * Contoh:
 *   const [on, setOn] = useState(false);
 *   <Switch checked={on} onCheckedChange={setOn} label="Notifikasi Email" />
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function Switch({ checked = false, onCheckedChange, disabled = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed",
        checked ? "bg-emerald-500" : "bg-white/10",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}
