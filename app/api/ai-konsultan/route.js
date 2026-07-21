import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { tanyaAiKonsultan } from "@/lib/ai/konsultan";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/ai-konsultan — FIX TUGAS 2
 *
 * Ini rute BARU yang benar-benar memanggil LLM (Gemini/OpenAI) — menggantikan
 * respons statis `JAWABAN_MOCK` yang sebelumnya hidup di frontend
 * (app/petani/ai-konsultan/page.jsx). Setelah LLM merespons, hasilnya
 * disimpan sebagai riwayat lewat model Prisma `KonsultasiAI` yang sudah ada
 * (sebelumnya hanya bisa diisi manual via POST /api/konsultasi-ai).
 *
 * Body: { petaniId, pertanyaan, topik }
 * Response sukses: { success: true, data: { jawaban, id, modelAI, tokenUsed } }
 * Response gagal (mis. API key belum diisi): { success: false, pesan }
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, pesan: "Body request tidak valid (harus JSON)." }, { status: 400 });
  }

  const { petaniId, pertanyaan, topik } = body ?? {};

  if (!petaniId || !pertanyaan?.trim()) {
    return NextResponse.json(
      { success: false, pesan: "Field wajib: petaniId, pertanyaan" },
      { status: 400 }
    );
  }

  const topikFinal = topik || "umum";

  try {
    const { jawaban, modelAI, tokenUsed } = await tanyaAiKonsultan(pertanyaan.trim(), topikFinal);

    const konsultasi = await prisma.konsultasiAI.create({
      data: {
        petaniId,
        pertanyaan: pertanyaan.trim(),
        jawaban,
        topik: topikFinal,
        modelAI,
        tokenUsed,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: konsultasi.id, jawaban, modelAI, tokenUsed, createdAt: konsultasi.createdAt },
    });
  } catch (error) {
    // Error dari lib/ai/konsultan.js (API key kosong, LLM API gagal, dll.)
    // — pesan aslinya diteruskan supaya jelas di frontend, TIDAK diam-diam
    // fallback ke mock (sesuai brief: hapus respons statis, bukan sembunyikan).
    console.error("[POST /api/ai-konsultan]", error);
    return NextResponse.json(
      { success: false, pesan: error.message || "Gagal mendapatkan jawaban dari AI Konsultan." },
      { status: 502 }
    );
  }
}
