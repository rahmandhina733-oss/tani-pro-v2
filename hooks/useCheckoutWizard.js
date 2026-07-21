"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useCheckoutWizard — state machine langkah checkout (FASE 2, Pilar 2.4)
 *
 * Mengekstrak logika step yang sebelumnya tersebar sebagai
 * `useState(1)` + perbandingan angka mentah di CheckoutPage.
 * Transisi divalidasi: tidak bisa maju melewati step yang gerbangnya
 * (guard) belum terpenuhi.
 *
 * @param {object}  [options]
 * @param {Array}   [options.steps]  Daftar label step (default 3 step checkout)
 * @param {object}  [options.guards] Map { [stepNumber]: () => boolean } —
 *                                   syarat agar BOLEH MENINGGALKAN step tsb.
 *
 * Contoh:
 *   const wizard = useCheckoutWizard({
 *     guards: { 1: () => items.length > 0, 2: () => !!selectedFleet },
 *   });
 *   wizard.next(); wizard.back(); wizard.isActive(2); wizard.isDone(1);
 * ─────────────────────────────────────────────────────────────────────────────
 */
const DEFAULT_STEPS = ["Ringkasan & ESG", "Pilih Armada", "Pembayaran"];

export default function useCheckoutWizard({ steps = DEFAULT_STEPS, guards = {} } = {}) {
  const [step, setStep] = useState(1);
  const totalSteps = steps.length;

  const canLeave = useCallback(
    (n) => {
      const guard = guards[n];
      return typeof guard === "function" ? !!guard() : true;
    },
    [guards]
  );

  const next = useCallback(() => {
    setStep((s) => (s < totalSteps && canLeave(s) ? s + 1 : s));
  }, [totalSteps, canLeave]);

  const back = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
  }, []);

  /** Lompat langsung ke step n — hanya mundur, atau maju jika semua guard di antaranya lolos. */
  const goTo = useCallback(
    (n) => {
      setStep((s) => {
        const target = Math.min(Math.max(1, n), totalSteps);
        if (target <= s) return target; // mundur selalu boleh
        for (let i = s; i < target; i++) {
          if (!canLeave(i)) return s; // ada gerbang yang belum terpenuhi
        }
        return target;
      });
    },
    [totalSteps, canLeave]
  );

  const helpers = useMemo(
    () => ({
      isActive: (n) => step === n,
      isDone: (n) => step > n,
      isFirst: step === 1,
      isLast: step === totalSteps,
      /** true jika tombol "lanjut" pada step aktif boleh diklik. */
      canProceed: canLeave(step),
    }),
    [step, totalSteps, canLeave]
  );

  return { step, steps, totalSteps, next, back, goTo, ...helpers };
}
