'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useCartStore — Zustand SSOT untuk Keranjang Belanja TaniPro.
 *
 * Semantik berat/volume (per baris item):
 *   weight (kg)  = qty × unitWeight   (unitWeight = berat per 1 unit, kg)
 *   volume (m³)  = qty × unitVolume   (unitVolume = volume per 1 unit, m³)
 *
 * - Tanpa data dummy: keranjang selalu mulai kosong.
 * - Middleware `persist`: keranjang bertahan antar-halaman & refresh
 *   (localStorage key: "tanipro-cart"). Yang dipersist hanya data keranjang,
 *   BUKAN data sesi/otentikasi.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Normalisasi 1 baris item: hitung ulang weight & volume dari qty. */
function buildLine(item, qty) {
  const q = Math.max(0, Number(qty) || 0);
  const unitWeight = Number(item.unitWeight) || 0;
  const unitVolume = Number(item.unitVolume) || 0;
  return {
    id: item.id,
    name: item.name,
    unit: item.unit ?? 'kg',
    price: Number(item.price) || 0,
    unitWeight,
    unitVolume,
    qty: q,
    weight: q * unitWeight,   // total berat baris (kg)
    volume: q * unitVolume,   // total volume baris (m³)
  };
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      /**
       * Tambah item ke keranjang.
       * @param item { id, name, unit, price, unitWeight, unitVolume?, qty }
       */
      addItem: (item) =>
        set((state) => {
          const existing = state.cartItems.find((i) => i.id === item.id);
          if (existing) {
            const newQty = existing.qty + (Number(item.qty) || 0);
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id ? buildLine(i, newQty) : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, buildLine(item, item.qty)] };
        }),

      /** Hapus 1 baris item berdasarkan id. */
      removeItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        })),

      /** Ubah qty; weight & volume dihitung ulang otomatis (qty × unit*). */
      updateQty: (id, qty) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.id === id ? buildLine(i, qty) : i
          ),
        })),

      /** Kosongkan keranjang (dipakai setelah order sukses). */
      clearCart: () => set({ cartItems: [] }),

      /** Agregat — dipakai checkout & badge katalog. */
      getTotalWeightKg: () => get().cartItems.reduce((s, i) => s + i.weight, 0),
      getTotalVolumeM3: () => get().cartItems.reduce((s, i) => s + i.volume, 0),
      getSubtotal: () => get().cartItems.reduce((s, i) => s + i.price * i.qty, 0),
      getItemCount: () => get().cartItems.length,
    }),
    {
      name: 'tanipro-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
