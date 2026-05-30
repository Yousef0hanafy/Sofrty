import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET products with optional category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const includeInactive = searchParams.get("all") === "true";

    const products = await db.product.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(!includeInactive ? { isActive: true } : {}),
      },
      include: {
        category: true,
        variants: { orderBy: { price: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product with variants
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, descriptionAr, descriptionEn, imageUrl, categoryId, tags, allergens, variants } = body;

    if (!nameAr || !nameEn || !categoryId) {
      return NextResponse.json(
        { success: false, error: "nameAr, nameEn, and categoryId are required" },
        { status: 400 }
      );
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one variant is required" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        nameAr,
        nameEn,
        descriptionAr: descriptionAr || null,
        descriptionEn: descriptionEn || null,
        imageUrl: imageUrl || null,
        categoryId,
        tags: tags || "",
        allergens: allergens || "",
        variants: {
          create: variants.map((v: { label: string; price: number; calories?: number }) => ({
            label: v.label,
            price: v.price,
            calories: v.calories || 0,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("POST product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT update product with variants
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nameAr, nameEn, descriptionAr, descriptionEn, imageUrl, categoryId, tags, allergens, isActive, variants } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    // If variants are provided, we need to handle them (delete old, create new)
    if (variants) {
      await db.productVariant.deleteMany({ where: { productId: id } });
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(nameAr && { nameAr }),
        ...(nameEn && { nameEn }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(categoryId && { categoryId }),
        ...(tags !== undefined && { tags }),
        ...(allergens !== undefined && { allergens }),
        ...(isActive !== undefined && { isActive }),
        ...(variants && {
          variants: {
            create: variants.map((v: { label: string; price: number; calories?: number }) => ({
              label: v.label,
              price: v.price,
              calories: v.calories || 0,
            })),
          },
        }),
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("PUT product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
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

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
