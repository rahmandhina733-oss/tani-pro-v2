import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StatCard — reusable KPI card
 *
 * Props:
 *  label       string
 *  value       string | number
 *  suffix      string?         (e.g. "kg", "%", "CO2e")
 *  delta       number?         (percentage change, positive = good)
 *  deltaLabel  string?         (e.g. "vs bulan lalu")
 *  icon        ReactNode?
 *  accentColor "emerald" | "blue" | "amber" | "purple" | "red"
 *  className   string?
 */
export default function StatCard({
  label,
  value,
  suffix,
  delta,
  deltaLabel = "vs bulan lalu",
  icon,
  accentColor = "emerald",
  className,
}) {
  const colorMap = {
    emerald: {
      icon:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      value: "text-emerald-300",
      glow:  "shadow-[0_0_30px_rgba(16,185,129,0.06)]",
    },
    blue: {
      icon:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
      value: "text-blue-300",
      glow:  "shadow-[0_0_30px_rgba(59,130,246,0.06)]",
    },
    amber: {
      icon:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
      value: "text-amber-300",
      glow:  "shadow-[0_0_30px_rgba(245,158,11,0.06)]",
    },
    purple: {
      icon:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
      value: "text-purple-300",
      glow:  "shadow-[0_0_30px_rgba(168,85,247,0.06)]",
    },
    red: {
      icon:  "bg-red-500/10 text-red-400 border-red-500/20",
      value: "text-red-300",
      glow:  "shadow-[0_0_30px_rgba(239,68,68,0.06)]",
    },
  };

  const colors = colorMap[accentColor] ?? colorMap.emerald;

  const deltaPositive = delta !== undefined && delta > 0;
  const deltaNegative = delta !== undefined && delta < 0;
  const deltaNeutral  = delta !== undefined && delta === 0;

  return (
    <div className={cn("glass-card p-5 flex flex-col gap-3", colors.glow, className)}>
      {/* Top row: icon + delta */}
      <div className="flex items-start justify-between">
        {icon && (
          <div className={cn("p-2.5 rounded-xl border", colors.icon)}>
            <div className="w-5 h-5">{icon}</div>
          </div>
        )}

        {delta !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
              deltaPositive && "text-emerald-400 bg-emerald-400/10",
              deltaNegative && "text-red-400 bg-red-400/10",
              deltaNeutral  && "text-slate-400 bg-slate-400/10",
            )}
          >
            {deltaPositive && <TrendingUp  className="w-3 h-3" />}
            {deltaNegative && <TrendingDown className="w-3 h-3" />}
            {deltaNeutral  && <Minus        className="w-3 h-3" />}
            {deltaPositive ? "+" : ""}{delta}%
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-2xl font-bold tabular-nums leading-tight", colors.value)}>
            {value}
          </span>
          {suffix && (
            <span className="text-xs text-slate-500 font-medium">{suffix}</span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-400">{label}</p>
      </div>

      {/* Delta context */}
      {delta !== undefined && deltaLabel && (
        <p className="text-xs text-slate-600">{deltaLabel}</p>
      )}
    </div>
  );
}
