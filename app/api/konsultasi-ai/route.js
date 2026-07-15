import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/konsultasi-ai — fetch history for a petani
// Query: petaniId, topik, page, limit
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const petaniId = searchParams.get("petaniId");
    const topik    = searchParams.get("topik");
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where = {};
    if (petaniId) where.petaniId = petaniId;
    if (topik) where.topik = { contains: topik, mode: "insensitive" };

    const [history, total] = await Promise.all([
      prisma.konsultasiAI.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.konsultasiAI.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: history,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil riwayat konsultasi", error: error.message }, { status: 500 });
  }
}

// POST /api/konsultasi-ai — save a new AI consultation record
// Body: { petaniId, pertanyaan, jawaban, topik, modelAI?, tokenUsed? }
export async function POST(request) {
  try {
    const { petaniId, pertanyaan, jawaban, topik, modelAI, tokenUsed } = await request.json();
    if (!petaniId || !pertanyaan || !jawaban || !topik)
      return NextResponse.json({ success: false, pesan: "Field wajib: petaniId, pertanyaan, jawaban, topik" }, { status: 400 });

    const konsultasi = await prisma.konsultasiAI.create({
      data: { petaniId, pertanyaan, jawaban, topik, modelAI: modelAI ?? "gpt-4o", tokenUsed: tokenUsed ?? null },
    });
    return NextResponse.json({ success: true, pesan: "Konsultasi tersimpan", data: konsultasi }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal menyimpan konsultasi", error: error.message }, { status: 500 });
  }
}
