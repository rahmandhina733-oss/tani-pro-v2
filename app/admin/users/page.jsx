"use client";

import { useState, useMemo } from "react";
import { Search, ShieldCheck, MoreVertical, Users as UsersIcon } from "lucide-react";
import { formatTanggalPendek } from "@/lib/utils";

const ROLE_CONFIG = {
  PETANI:  { label: "Petani",  warna: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  PEMBELI: { label: "Pembeli", warna: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  ADMIN:   { label: "Admin",   warna: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
};

const PENGGUNA = [
  { id: "u1", nama: "Slamet Wijaya", email: "slamet.wijaya@kebunmakmur.id", role: "PETANI", detail: "Kebun Makmur — Jawa Timur", verified: true, joinedAt: "2025-11-02" },
  { id: "u2", nama: "PT Agro Nusantara", email: "procurement@agronusantara.co.id", role: "PEMBELI", detail: "Industri Pangan", verified: true, joinedAt: "2025-10-18" },
  { id: "u3", nama: "Gapoktan Makmur Sejati", email: "gapoktan.makmur@gmail.com", role: "PETANI", detail: "Kediri, Jawa Timur", verified: true, joinedAt: "2025-12-01" },
  { id: "u4", nama: "CV Sumber Pangan", email: "admin@sumberpangan.id", role: "PEMBELI", detail: "Distributor", verified: false, joinedAt: "2026-02-14" },
  { id: "u5", nama: "UD. Sumber Rejeki", email: "sumberrejeki.ud@gmail.com", role: "PETANI", detail: "Grobogan, Jawa Tengah", verified: true, joinedAt: "2025-09-27" },
  { id: "u6", nama: "Rina Kartika", email: "rina.kartika@tanipro.id", role: "ADMIN", detail: "Operasional Platform", verified: true, joinedAt: "2025-06-01" },
];

export default function AdminUsersPage() {
  const [cari, setCari] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");

  const tampil = useMemo(() => {
    return PENGGUNA.filter((u) => {
      const cocokCari = u.nama.toLowerCase().includes(cari.toLowerCase()) || u.email.toLowerCase().includes(cari.toLowerCase());
      const cocokRole = roleFilter === "Semua" || u.role === roleFilter;
      return cocokCari && cocokRole;
    });
  }, [cari, roleFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading">Pengguna</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola akun petani, pembeli, dan admin di platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama atau email..."
            className="input-field pl-9"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field sm:w-48">
          <option>Semua</option>
          <option value="PETANI">Petani</option>
          <option value="PEMBELI">Pembeli</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-white/[0.06]">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Detail</th>
                <th className="px-5 py-3 font-medium">Bergabung</th>
                <th className="px-5 py-3 font-medium">Verifikasi</th>
                <th className="px-5 py-3 font-medium text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((u) => {
                const roleCfg = ROLE_CONFIG[u.role];
                return (
                  <tr key={u.id} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-slate-400 flex-shrink-0">
                          {u.nama[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-200 truncate">{u.nama}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`status-pill border ${roleCfg.warna}`}>{roleCfg.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{u.detail}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatTanggalPendek(u.joinedAt)}</td>
                    <td className="px-5 py-3.5">
                      {u.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Menunggu</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tampil.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2 text-slate-500">
            <UsersIcon className="w-8 h-8" />
            <p className="text-sm">Tidak ada pengguna yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
