import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, imageUrl, order } = body;

    if (!nameAr || !nameEn) {
      return NextResponse.json(
        { success: false, error: "nameAr and nameEn are required" },
        { status: 400 }
      );
    }

    const maxOrder = await db.category.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const category = await db.category.create({
      data: {
        nameAr,
        nameEn,
        imageUrl: imageUrl || null,
        order: order ?? ((maxOrder?.order ?? 0) + 1),
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nameAr, nameEn, imageUrl, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    const category = await db.category.update({
      where: { id },
      data: {
        ...(nameAr && { nameAr }),
        ...(nameEn && { nameEn }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("PUT category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
