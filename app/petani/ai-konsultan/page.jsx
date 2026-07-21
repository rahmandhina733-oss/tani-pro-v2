"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Send, TrendingUp, CloudSun, Bug, ShoppingBasket, Sparkles, TriangleAlert } from "lucide-react";
import { hitungPointPetani } from "@/lib/tani-point";

const TOPIK_SARAN = [
  { label: "Harga pasar hari ini", topik: "harga", icon: TrendingUp, warna: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Prakiraan cuaca minggu ini", topik: "cuaca", icon: CloudSun, warna: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { label: "Kendalikan hama wereng", topik: "hama", icon: Bug, warna: "text-red-400 bg-red-500/10 border-red-500/20" },
  { label: "Rekomendasi pembeli potensial", topik: "pasar", icon: ShoppingBasket, warna: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

const RIWAYAT_AWAL = [
  {
    role: "ai",
    topik: "harga",
    pesan: "Halo Pak Slamet! Saya AI Konsultan TaniPro. Tanyakan apa saja soal harga pasar, cuaca, hama, atau strategi penjualan kebun Anda.",
  },
];

// TODO: ganti dengan id petani dari sesi login sesungguhnya (JWT payload).
const MOCK_PETANI_ID = "petani_demo";

/**
 * FIX TUGAS 2: `JAWABAN_MOCK` statis DIHAPUS. Jawaban sekarang berasal dari
 * LLM sungguhan (Gemini/OpenAI) via POST /api/ai-konsultan.
 */
export default function AiKonsultanPage() {
  const [riwayat, setRiwayat] = useState(RIWAYAT_AWAL);
  const [input, setInput] = useState("");
  const [mengetik, setMengetik] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const bawahRef = useRef(null);

  useEffect(() => {
    bawahRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [riwayat, mengetik, errorInfo]);

  async function kirimPesan(teks, topik = "umum") {
    if (!teks.trim() || mengetik) return;
    setRiwayat((prev) => [...prev, { role: "user", pesan: teks }]);
    setInput("");
    setMengetik(true);
    setErrorInfo(null);

    try {
      const res = await fetch("/api/ai-konsultan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petaniId: MOCK_PETANI_ID, pertanyaan: teks, topik }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorInfo(json.pesan || "AI Konsultan sedang tidak dapat dihubungi.");
        return;
      }

      setRiwayat((prev) => [...prev, { role: "ai", topik, pesan: json.data.jawaban }]);
    } catch {
      setErrorInfo("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setMengetik(false);
    }
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            AI Konsultan
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Rekomendasi bisnis instan berbasis data harga, cuaca, dan tren pasar.
          </p>
        </div>
        <span className="status-pill border text-purple-400 bg-purple-400/10 border-purple-400/20">
          +{hitungPointPetani(0) === 0 ? "5" : hitungPointPetani(100)} poin / konsultasi premium
        </span>
      </div>

      {/* Quick topics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TOPIK_SARAN.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.topik}
              disabled={mengetik}
              onClick={() => kirimPesan(t.label, t.topik)}
              className="glass-card p-3.5 flex items-center gap-2.5 text-left hover:bg-white/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <div className={`p-2 rounded-lg border flex-shrink-0 ${t.warna}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat window */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {riwayat.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-500 text-slate-950 font-medium"
                    : "bg-white/5 border border-white/10 text-slate-300"
                }`}>
                  {m.pesan}
                </div>
              </div>
            </div>
          ))}

          {mengetik && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="rounded-2xl px-4 py-2.5 bg-white/5 border border-white/10 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce-soft" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce-soft" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce-soft" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* FIX TUGAS 2: error handling mulus — bubble error, bukan crash/diam */}
          {errorInfo && (
            <div className="flex justify-start">
              <div className="max-w-[80%] flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TriangleAlert className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {errorInfo}
                </div>
              </div>
            </div>
          )}
          <div ref={bawahRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); kirimPesan(input); }}
          className="p-4 border-t border-white/[0.06] flex items-center gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu tentang kebun Anda..."
            className="input-field flex-1"
            disabled={mengetik}
          />
          <button type="submit" className="btn-emerald !px-3.5 !py-2.5" disabled={mengetik || !input.trim()}>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
