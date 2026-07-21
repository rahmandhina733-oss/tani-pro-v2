"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Store, Package, CalendarClock, Truck,
  BrainCircuit, Star, ShoppingBag, ClipboardList, ShoppingCart,
  ShieldCheck, Leaf, Monitor, MapPin, Box, Users, BarChart2,
  ChevronLeft, ChevronRight, Sprout,
} from "lucide-react";
import { NAV_PETANI, NAV_PEMBELI, NAV_ADMIN } from "@/lib/constants";
import { formatAngka } from "@/lib/format";
import { getLevelTaniPoint } from "@/lib/tani-point";

const ICON_MAP = {
  LayoutDashboard, Store, Package, CalendarClock, Truck,
  BrainCircuit, Star, ShoppingBag, ClipboardList, ShoppingCart,
  ShieldCheck, Leaf, Monitor, MapPin, Box, Users, BarChart2,
};

const ROLE_NAV = {
  petani:  NAV_PETANI,
  pembeli: NAV_PEMBELI,
  admin:   NAV_ADMIN,
};

const ROLE_COLORS = {
  petani:  "from-emerald-500 to-teal-500",
  pembeli: "from-blue-500 to-cyan-500",
  admin:   "from-purple-500 to-violet-500",
};

const ROLE_ACCENT = {
  petani:  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  pembeli: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  admin:   "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function Sidebar({ role = "petani", user = null, taniPoint = 0 }) {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems  = ROLE_NAV[role] ?? [];
  const gradient  = ROLE_COLORS[role];
  const accent    = ROLE_ACCENT[role];
  const levelInfo = getLevelTaniPoint(taniPoint);

  return (
    <aside
      className={`
        relative flex flex-col h-screen border-r border-white/[0.06]
        bg-slate-950/60 backdrop-blur-xl transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[240px]"}
      `}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-50 hover:bg-slate-700 transition-colors shadow-md"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft  className="w-3 h-3" />
        }
      </button>

      {/* User info header */}
      <div className={`p-4 border-b border-white/[0.06] ${collapsed ? "px-3" : ""}`}>
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
            {user?.nama?.[0] ?? <Sprout className="w-4 h-4" />}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-50 truncate">
                {user?.nama ?? "Pengguna"}
              </p>
              <span className={`status-pill text-[10px] border mt-0.5 ${accent}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon      = ICON_MAP[item.ikon];
          const isActive  = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${collapsed ? "justify-center" : ""}
                ${isActive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-50 hover:bg-white/[0.04] border border-transparent"
                }
              `}
            >
              {Icon && (
                <Icon
                  className={`flex-shrink-0 w-4.5 h-4.5 transition-colors ${
                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
              )}
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tani Point widget (bottom) */}
      {!collapsed && role !== "admin" && (
        <div className="p-3 border-t border-white/[0.06]">
          <div className="glass-card-accent p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                <span className="text-xs font-semibold text-slate-200">Tani Point</span>
              </div>
              <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                {levelInfo.levelSaat.badge} {levelInfo.levelSaat.nama}
              </span>
            </div>
            <p className="text-lg font-bold text-slate-50 tabular-nums">
              {formatAngka(taniPoint)}
              <span className="text-xs font-normal text-slate-500 ml-1">poin</span>
            </p>
            {/* Progress bar */}
            {levelInfo.levelBerikut && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Menuju {levelInfo.levelBerikut.badge} {levelInfo.levelBerikut.nama}</span>
                  <span>{Math.round(levelInfo.progressPersen)}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPersen}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed: point icon only */}
      {collapsed && role !== "admin" && (
        <div className="p-3 border-t border-white/[0.06] flex justify-center">
          <div title={`${formatAngka(taniPoint)} poin`} className="p-2 rounded-xl bg-amber-400/10">
            <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          </div>
        </div>
      )}
    </aside>
  );
}
