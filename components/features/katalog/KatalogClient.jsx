"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Database,
  Leaf,
  MapPin,
  Minus,
  PackageSearch,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import useCartSummary from "@/hooks/useCartSummary";
import { formatAngka, formatRupiah } from "@/lib/format";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * KatalogClient — UI interaktif katalog (FASE 2, Pilar 3.2 & 1.4)
 *
 * - Menerima `products` (view-model dari Server Component page.jsx) sebagai
 *   props; TIDAK ada mock data & TIDAK ada fetch sisi klien.
 * - Keranjang: useCartSummary (Zustand SSOT + hydration guard terpusat).
 * - Seluruh <svg> inline diganti komponen lucide-react (Pilar 1.4).
 * - Style repetitif diganti UI primitives: Card, Badge, Button, Input/Select.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Emoji visual per kategori (murni presentasi). */
function categoryEmoji(category = "") {
  const c = category.toLowerCase();
  if (c.includes("padi") || c.includes("beras")) return "🌾";
  if (c.includes("jagung")) return "🌽";
  if (c.includes("kedelai")) return "🫘";
  if (c.includes("cabai") || c.includes("rempah")) return "🌶️";
  if (c.includes("bawang")) return "🧅";
  if (c.includes("singkong") || c.includes("pangan")) return "🥔";
  if (c.includes("sayur") || c.includes("hortikultura")) return "🥬";
  if (c.includes("buah")) return "🍊";
  return "🌱";
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-700 fill-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(product.minOrder);

  return (
    <Card hoverable className="group relative overflow-hidden">
      {/* Badge status produk */}
      <div className="absolute top-3 left-3 z-10">
        <Badge tone={product.badge.tone}>{product.badge.label}</Badge>
      </div>

      {/* Pill ESG */}
      <div className="absolute top-3 right-3 z-10">
        <Badge tone="teal" className="font-medium">
          <Leaf className="w-3 h-3" />
          Rantai Pendek
        </Badge>
      </div>

      {/* Visual produk */}
      <div className="h-36 bg-gradient-to-br from-emerald-950/60 to-slate-900/80 flex items-center justify-center border-b border-white/5">
        <span className="text-6xl select-none opacity-80">
          {categoryEmoji(product.category)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-100 text-sm leading-snug">
            {product.name}
          </h3>
          {product.certified && (
            <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
        </div>

        <p className="text-xs text-slate-500 mb-1">{product.farmer}</p>
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 text-slate-600" />
          <span className="text-xs text-slate-500">{product.origin}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-amber-400 font-medium">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-600">
            · {formatAngka(product.sold)} transaksi
          </span>
        </div>

        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.map((tag) => (
              <Badge key={tag} tone="slate" size="xs" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="border-t border-white/5 pt-3">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-emerald-400">
                {formatRupiah(product.price)}
              </p>
              <p className="text-xs text-slate-500">
                per {product.unit} · min. {formatAngka(product.minOrder)} {product.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Stok</p>
              <p className="text-sm font-semibold text-slate-300">
                {formatAngka(product.stock / 1000, 1)}t
              </p>
            </div>
          </div>

          {/* Input qty */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Kurangi jumlah"
              onClick={() => setQty(Math.max(product.minOrder, qty - product.minOrder))}
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <Input
              type="number"
              value={qty}
              min={product.minOrder}
              align="center"
              fieldSize="sm"
              className="flex-1 py-1"
              onChange={(e) =>
                setQty(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))
              }
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Tambah jumlah"
              onClick={() => setQty(qty + product.minOrder)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs text-slate-600">{product.unit}</span>
          </div>

          <Button fullWidth size="md" className="py-2" onClick={() => onAddToCart(product, qty)}>
            <ShoppingCart className="w-4 h-4" />
            Tambah ke Pesanan
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function KatalogClient({ products = [], dbError = false }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("terlaris");
  const [showCartNotif, setShowCartNotif] = useState(false);

  /* Keranjang: agregat & aksi terpusat di hook (Zustand SSOT). */
  const { items, itemCount, subtotal, addItem } = useCartSummary();

  /* Kategori diturunkan dari data asli, bukan daftar hardcode. */
  const categories = useMemo(
    () => ["Semua", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const visible = useMemo(() => {
    const filtered = products.filter(
      (p) => activeCategory === "Semua" || p.category === activeCategory
    );
    const sorted = [...filtered];
    switch (sortBy) {
      case "harga-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "harga-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "stok":
        sorted.sort((a, b) => b.stock - a.stock);
        break;
      case "terlaris":
      default:
        sorted.sort((a, b) => b.sold - a.sold);
    }
    return sorted;
  }, [products, activeCategory, sortBy]);

  /* Kontrak addItem store: { id, name, unit, price, unitWeight, unitVolume, qty }
     → weight baris dihitung store: qty × unitWeight. */
  const handleAddToCart = (product, qty) => {
    addItem({
      id: product.id,
      name: product.name,
      unit: product.unit,
      price: product.price,
      unitWeight: product.unitWeight,
      unitVolume: product.unitVolume,
      qty,
    });
    setShowCartNotif(true);
    setTimeout(() => setShowCartNotif(false), 2500);
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Toast keranjang */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showCartNotif
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl">
          <Check className="w-5 h-5" />
          <span className="text-sm font-semibold">Produk ditambahkan ke pesanan!</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Katalog Komoditas</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Sumber langsung dari petani terverifikasi di seluruh Indonesia
            </p>
          </div>

          {/* Ringkasan keranjang — dibaca dari store Zustand via hook */}
          {items.length > 0 && (
            <Link
              href="/pembeli/checkout"
              className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-xl px-4 py-2.5 transition group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Pesanan</p>
                <p className="text-sm font-bold text-emerald-400">{formatRupiah(subtotal)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition ml-2" />
            </Link>
          )}
        </div>
      </div>

      {/* Peringatan koneksi database (graceful degradation) */}
      {dbError && (
        <Card variant="subtle" padding="sm" className="mb-6 flex items-center gap-3 border-amber-500/30 bg-amber-500/5">
          <Database className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-400">
            Katalog tidak dapat dimuat dari database. Periksa koneksi DATABASE_URL lalu muat ulang halaman.
          </p>
        </Card>
      )}

      {/* Filter kategori + sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/8 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          fieldSize="sm"
          className="min-w-[150px] sm:w-auto w-full"
        >
          <option value="terlaris">Terlaris</option>
          <option value="harga-asc">Harga Terendah</option>
          <option value="harga-desc">Harga Tertinggi</option>
          <option value="stok">Stok Terbanyak</option>
        </Select>
      </div>

      {/* Grid produk */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center py-16">
          <PackageSearch className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400 mb-1">Belum ada produk di kategori ini</p>
          <p className="text-xs text-slate-600">
            {dbError
              ? "Data akan muncul setelah koneksi database pulih."
              : "Coba kategori lain, atau jalankan `npm run db:seed` untuk data contoh."}
          </p>
        </Card>
      )}
    </div>
  );
}
