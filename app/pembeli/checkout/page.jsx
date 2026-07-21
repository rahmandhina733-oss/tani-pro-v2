"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ClipboardList,
  Leaf,
  Lightbulb,
  Lock,
  Route,
  Star,
  X,
} from "lucide-react";
import useCartSummary from "@/hooks/useCartSummary";
import useCheckoutWizard from "@/hooks/useCheckoutWizard";
import { TANIPRO_FLEETS, DESTINATION_CITIES, calculateEsg } from "@/lib/esg";
import { FLEET_OPTIONS } from "@/lib/fleet";
import { formatAngka, formatRupiah } from "@/lib/format";
import EsgCalculatorCard from "@/components/features/checkout/EsgCalculatorCard";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

/* ============================================================
   COLOR MAP — Object literal class Tailwind UTUH
   (FIX P0 Tailwind Purge — jangan pernah membangun class via
   manipulasi string; setiap varian ditulis lengkap & literal)
   ============================================================ */
const colorMap = {
  blue: {
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    badge: "bg-blue-500/15 text-blue-400",
    glow: "shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)]",
    dot: "bg-blue-500",
  },
  emerald: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400",
    glow: "shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]",
    dot: "bg-emerald-500",
  },
  amber: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400",
    glow: "shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]",
    dot: "bg-amber-500",
  },
};

const PAYMENT_METHODS = [
  {
    id: "escrow",
    label: "Escrow TaniPro",
    desc: "Dana ditahan hingga barang diterima & dikonfirmasi. Transaksi aman 100%.",
    badge: "Disarankan",
    icon: "🔒",
  },
  {
    id: "transfer",
    label: "Transfer Bank Langsung",
    desc: "Transfer ke rekening petani/koperasi. Proses manual 1–2 hari kerja.",
    badge: null,
    icon: "🏦",
  },
  {
    id: "credit",
    label: "Kredit Usaha (Cicilan)",
    desc: "Bayar nanti dengan tenor 30–90 hari. Tersedia untuk pembeli terverifikasi.",
    badge: "KUR Ready",
    icon: "📋",
  },
];

export default function CheckoutPage() {
  /* ---------- Keranjang: agregat & aksi via hook (FASE 2, Pilar 2.4) ---------- */
  const {
    items,
    subtotal,
    totalWeightKg,
    totalWeightTon,
    totalVolumeM3,
    removeItem,
    clearCart,
  } = useCartSummary();

  /* ---------- State lokal halaman ---------- */
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [destination, setDestination] = useState("");
  const [distanceKm, setDistanceKm] = useState(""); // Jarak Tempuh (KM) — variabel D
  const [paymentMethod, setPaymentMethod] = useState("escrow");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderEsg, setOrderEsg] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);

  /* ---------- Wizard step: state machine via hook (FASE 2, Pilar 2.4) ------- */
  const wizard = useCheckoutWizard({
    guards: {
      1: () => items.length > 0,
      2: () => !!selectedFleet,
    },
  });

  const fleet = FLEET_OPTIONS.find((f) => f.id === selectedFleet);
  const grandTotal = subtotal + (fleet?.price || 0);

  /* ============================================================
     MESIN KALKULASI ESG REAL-TIME
     D_opt = D × 0.7 · E_conv = ceil(W/C_pickup) × D × EF_pickup
     E_tp  = ceil(W/C_armada) × D_opt × EF_armada · Saved = E_conv − E_tp
     ============================================================ */
  const esg = useMemo(
    () => calculateEsg(totalWeightTon, parseFloat(distanceKm)),
    [totalWeightTon, distanceKm]
  );

  const handlePlaceOrder = () => {
    // Snapshot ESG & total sebelum keranjang dikosongkan
    setOrderEsg(esg.valid ? { saved: esg.saved } : null);
    setOrderTotal(grandTotal);
    setOrderPlaced(true);
    clearCart();
  };

  const handleSelectCity = (e) => {
    const cityName = e.target.value;
    setDestination(cityName);
    const city = DESTINATION_CITIES.find((c) => c.name === cityName);
    if (city) setDistanceKm(String(city.refDistance));
  };

  /* ============================================================
     RENDER: KONFIRMASI PESANAN
     ============================================================ */
  if (orderPlaced) {
    return (
      <div className="p-4 lg:p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-slate-50 mb-2">Pesanan Terkonfirmasi!</h2>
          <p className="text-slate-400 mb-2">
            No. Pesanan:{" "}
            <span className="text-emerald-400 font-mono font-bold">TRP-2026-08471</span>
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Dana escrow sebesar{" "}
            <strong className="text-slate-300">{formatRupiah(orderTotal)}</strong> telah
            diblokir dengan aman. Dana akan dilepas setelah barang diterima dan dikonfirmasi.
          </p>

          {orderEsg && (
            <Card variant="emerald" padding="sm" className="mb-6 p-4">
              <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wide mb-1">
                Kontribusi ESG Anda
              </p>
              <p className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                {formatAngka(orderEsg.saved, 2)} kg CO₂e
              </p>
              <p className="text-[11px] text-teal-600 mt-0.5">
                berhasil dihemat via rute VMS & Smart Load TaniPro 🌱
              </p>
            </Card>
          )}

          <Card padding="md" className="mb-6 text-left">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Status Pengiriman</h3>
            <div className="space-y-3">
              {[
                "Pesanan Dikonfirmasi",
                "Proses Penyiapan Barang",
                "Barang Diserahkan ke Driver",
                "Dalam Perjalanan",
                "Terkirim",
              ].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      i === 0 ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                    }`}
                  >
                    {i === 0 && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm ${
                      i === 0 ? "text-emerald-400 font-medium" : "text-slate-600"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Link
              href="/pembeli"
              className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-medium hover:bg-white/8 transition text-center"
            >
              Kembali Belanja
            </Link>
            <Link
              href="/pembeli/esg"
              className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-400 transition text-center"
            >
              Lihat Laporan ESG
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER: HALAMAN CHECKOUT
     ============================================================ */
  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/pembeli" className="hover:text-slate-300 transition">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-300">Checkout</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-50">Checkout & Simulasi Logistik</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Sistem AI memilih armada terbaik & menghitung jejak karbon pengiriman Anda secara
          real-time
        </p>
      </div>

      {/* Progress steps — dirender dari state machine wizard */}
      <div className="flex items-center gap-0 mb-8">
        {wizard.steps.map((label, i) => {
          const stepNum = i + 1;
          const isActive = wizard.isActive(stepNum);
          const isDone = wizard.isDone(stepNum);
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                        : "border-white/20 text-slate-600"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : stepNum}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isActive ? "text-slate-200" : isDone ? "text-emerald-400" : "text-slate-600"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < wizard.totalSteps - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    wizard.isDone(stepNum) ? "bg-emerald-500/50" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kolom utama */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Ringkasan pesanan + Kalkulator ESG */}
          {wizard.isActive(1) && (
            <>
              <Card padding="lg">
                <CardTitle className="mb-4">
                  <ClipboardList className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                  Ringkasan Pesanan
                </CardTitle>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500 mb-3">Keranjang Anda kosong.</p>
                    <Link
                      href="/pembeli/katalog"
                      className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition"
                    >
                      Jelajahi Katalog →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        variant="subtle"
                        className="flex items-center gap-4 p-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl">
                          {item.name.includes("Beras")
                            ? "🌾"
                            : item.name.includes("Jagung")
                              ? "🌽"
                              : "🥬"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatAngka(item.qty)} {item.unit} · {formatAngka(item.weight)} kg
                            {item.volume ? ` · ${formatAngka(item.volume, 1)} m³` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-400">
                            {formatRupiah(item.price * item.qty)}
                          </p>
                          <p className="text-xs text-slate-600">
                            {formatRupiah(item.price)}/{item.unit}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Hapus ${item.name}`}
                          className="text-slate-500 hover:text-rose-400 hover:border-rose-500/30"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Ringkasan berat/volume */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Card variant="solid" padding="sm" className="text-center">
                    <p className="text-2xl font-bold text-slate-100">
                      {formatAngka(totalWeightTon, 2)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Total Berat (Ton)</p>
                  </Card>
                  <Card variant="solid" padding="sm" className="text-center">
                    <p className="text-2xl font-bold text-slate-100">
                      {formatAngka(totalVolumeM3, 1)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Total Volume (m³)</p>
                  </Card>
                </div>
              </Card>

              {/* MESIN KALKULASI ESG (komponen terekstrak — FIX P0 focus-loss) */}
              <EsgCalculatorCard
                destination={destination}
                onDestinationChange={handleSelectCity}
                distanceKm={distanceKm}
                onDistanceKmChange={(e) => setDistanceKm(e.target.value)}
                esg={esg}
                totalWeightKg={totalWeightKg}
                totalWeightTon={totalWeightTon}
              />

              <Button
                fullWidth
                onClick={wizard.next}
                disabled={!wizard.canProceed}
              >
                Simulasi Armada
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Step 2: Pemilihan armada */}
          {wizard.isActive(2) && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">
                    Rekomendasi AI Logistik (Smart Load)
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Total muatan{" "}
                    <strong className="text-emerald-400">
                      {formatAngka(totalWeightTon, 2)} Ton
                    </strong>{" "}
                    dan{" "}
                    <strong className="text-emerald-400">
                      {formatAngka(totalVolumeM3, 1)} m³
                    </strong>{" "}
                    — Armada <strong className="text-emerald-300">{esg.fleet.name}</strong>{" "}
                    adalah pilihan optimal (kapasitas {esg.fleet.capacity} Ton, EF{" "}
                    {esg.fleet.emissionFactor} kg CO₂e/km).
                  </p>
                </div>
              </div>

              {FLEET_OPTIONS.map((f) => {
                const c = colorMap[f.color];
                const isSelected = selectedFleet === f.id;
                const isRecommended = f.id === esg.fleet.id;
                const esgFleetData = TANIPRO_FLEETS.find((t) => t.id === f.id);
                const estEmission =
                  esg.valid && esgFleetData
                    ? Math.ceil(totalWeightTon / esgFleetData.capacity) *
                      esg.D_opt *
                      esgFleetData.emissionFactor
                    : null;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFleet(f.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? `${c.border} ${c.bg} ${c.glow}`
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl mt-0.5">{f.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`text-base font-semibold ${
                              isSelected ? c.text : "text-slate-200"
                            }`}
                          >
                            {f.name}
                          </span>
                          {isRecommended && <Badge>✦ Direkomendasikan</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{f.bestFor}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-slate-600">Kapasitas</p>
                            <p className="text-sm font-medium text-slate-300">{f.capacity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Estimasi</p>
                            <p className="text-sm font-medium text-slate-300">{f.time}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Emisi CO₂e</p>
                            <p className="text-sm font-medium text-teal-400">
                              {estEmission !== null
                                ? `${formatAngka(estEmission, 1)} kg`
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Biaya Angkut</p>
                            <p
                              className={`text-sm font-bold ${
                                isSelected ? c.text : "text-slate-200"
                              }`}
                            >
                              {f.priceLabel}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${
                          isSelected ? `${c.border} ${c.bg}` : "border-white/20"
                        }`}
                      >
                        {isSelected && (
                          <div className={`w-full h-full rounded-full scale-50 ${c.dot}`} />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={wizard.back}>
                  Kembali
                </Button>
                <Button
                  className="flex-1"
                  onClick={wizard.next}
                  disabled={!wizard.canProceed}
                >
                  Lanjut ke Pembayaran
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pembayaran */}
          {wizard.isActive(3) && (
            <div className="space-y-4">
              <Card padding="lg">
                <CardTitle className="mb-4">Metode Pembayaran</CardTitle>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        paymentMethod === m.id
                          ? "border-emerald-500/40 bg-emerald-500/8"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                paymentMethod === m.id ? "text-emerald-400" : "text-slate-200"
                              }`}
                            >
                              {m.label}
                            </span>
                            {m.badge && (
                              <Badge size="xs" className="rounded">
                                {m.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            paymentMethod === m.id
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-white/30"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={wizard.back}>
                  Kembali
                </Button>
                <Button className="flex-1" onClick={handlePlaceOrder}>
                  <Lock className="w-4 h-4" />
                  Konfirmasi & Blokir Dana Escrow
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar ringkasan biaya */}
        <div className="space-y-4">
          <Card padding="md" className="sticky top-20">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Ringkasan Biaya</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Produk</span>
                <span className="text-slate-200 font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Logistik</span>
                <span className="text-slate-200 font-medium">
                  {fleet ? (
                    fleet.priceLabel
                  ) : (
                    <span className="text-slate-600 italic">Pilih armada</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Escrow</span>
                <span className="text-emerald-400 font-medium">Gratis</span>
              </div>
              <div className="border-t border-white/10 pt-2.5 flex justify-between">
                <span className="font-semibold text-slate-200">Total</span>
                <span className="font-bold text-emerald-400 text-base">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            {/* Ringkasan ESG mini (real-time) */}
            {esg.valid && (
              <Card variant="teal" padding="sm" className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Route className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-400">
                    Dampak Lingkungan (ESG)
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Konvensional (L300)</span>
                    <span className="text-rose-400 font-semibold tabular-nums">
                      {formatAngka(esg.E_conv, 2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TaniPro ({esg.fleet.name})</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      {formatAngka(esg.E_tp, 2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-1 mt-1">
                    <span className="text-teal-500 font-medium">CO₂e Dihemat</span>
                    <span className="text-teal-300 font-bold tabular-nums">
                      {formatAngka(esg.saved, 2)} kg (↓{formatAngka(esg.savedPercent)}%)
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Tani Point */}
            <div className="mt-3 p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">
                  +{formatAngka(Math.floor(grandTotal / 1000))} Tani Point dari pesanan ini
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
