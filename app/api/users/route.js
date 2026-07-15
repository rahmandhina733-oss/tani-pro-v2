import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users — admin: list all users with role filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role   = searchParams.get("role");
    const search = searchParams.get("search");
    const page   = parseInt(searchParams.get("page")  ?? "1");
    const limit  = parseInt(searchParams.get("limit") ?? "20");

    const where = {};
    if (role) where.role = role;
    if (search) where.OR = [
      { nama: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, nama: true, email: true, telepon: true, role: true,
          avatarUrl: true, createdAt: true,
          petaniProfile: { select: { id: true, namaKebun: true, provinsi: true, rating: true } },
          pembeliProfile: { select: { id: true, namaPerusahaan: true, isVerified: true } },
          taniPoint: { select: { totalPoin: true, level: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: users,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) } });
  } catch (error) {
    return NextResponse.json({ success: false, pesan: "Gagal mengambil daftar pengguna", error: error.message }, { status: 500 });
  }
}
