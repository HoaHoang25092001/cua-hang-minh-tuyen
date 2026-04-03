// app/api/reviews/route.ts – Tiếp nhận đánh giá cửa hàng từ khách hàng
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authorName, rating, comment } = body;

    // Validate
    if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập tên của bạn" }, { status: 400 });
    }
    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Đánh giá phải từ 1 đến 5 sao" }, { status: 400 });
    }

    // Tạo đánh giá cửa hàng (productId không cần thiết)
    await prisma.review.create({
      data: {
        authorName: authorName.trim(),
        rating: ratingNum,
        comment: comment?.trim() || null,
        isApproved: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Có lỗi xảy ra, vui lòng thử lại" }, { status: 500 });
  }
}
