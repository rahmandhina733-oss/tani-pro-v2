"use client";

import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/lib/stores/useCartStore";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useCartSummary — agregat keranjang dari Zustand (FASE 2, Pilar 2.4)
 *
 * Menggantikan blok `reduce()` yang sebelumnya diduplikasi di halaman
 * Katalog dan Checkout. Sekaligus memusatkan HYDRATION GUARD: store
 * di-persist ke localStorage, sehingga render pertama (SSR) harus selalu
 * memakai keranjang kosong agar tidak terjadi hydration mismatch.
 *
 * @returns {{
 *   hydrated: boolean,       // true setelah mount (data persist siap dibaca)
 *   items: Array,            // baris keranjang ([] sebelum hydrated)
 *   itemCount: number,       // jumlah baris
 *   subtotal: number,        // Σ price × qty (Rp)
 *   totalWeightKg: number,   // Σ weight baris (kg) — weight = qty × unitWeight
 *   totalWeightTon: number,  // kg / 1000
 *   totalVolumeM3: number,   // Σ volume baris (m³)
 *   removeItem, updateQty, clearCart, addItem, // aksi store
 * }}
 */
export default function useCartSummary() {
  const cartItems = useCartStore((s) => s.cartItems);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const items = hydrated ? cartItems : [];

  const summary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const totalWeightKg = items.reduce((s, i) => s + (i.weight || 0), 0);
    const totalVolumeM3 = items.reduce((s, i) => s + (i.volume || 0), 0);
    return {
      itemCount: items.length,
      subtotal,
      totalWeightKg,
      totalWeightTon: totalWeightKg / 1000,
      totalVolumeM3,
    };
  }, [items]);

  return {
    hydrated,
    items,
    ...summary,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  };
}
