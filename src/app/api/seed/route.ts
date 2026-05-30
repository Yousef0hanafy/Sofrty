import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seedCategories, restaurantDefaults } from "@/data/seed";

export async function POST() {
  try {
    // Check if data already exists
    const existingCategories = await db.category.count();
    if (existingCategories > 0) {
      return NextResponse.json(
        { success: false, error: "Database already seeded" },
        { status: 400 }
      );
    }

    // Create restaurant settings
    await db.restaurant.create({
      data: restaurantDefaults,
    });

    // Create categories with products and variants
    for (const cat of seedCategories) {
      await db.category.create({
        data: {
          nameAr: cat.nameAr,
          nameEn: cat.nameEn,
          imageUrl: cat.imageUrl,
          order: cat.order,
          products: {
            create: cat.products.map((p) => ({
              nameAr: p.nameAr,
              nameEn: p.nameEn,
              descriptionAr: p.descriptionAr,
              descriptionEn: p.descriptionEn,
              imageUrl: p.imageUrl,
              tags: p.tags,
              allergens: p.allergens,
              variants: {
                create: p.variants.map((v) => ({
                  label: v.label,
                  price: v.price,
                  calories: v.calories,
                })),
              },
            })),
          },
        },
      });
    }

    const categoryCount = await db.category.count();
    const productCount = await db.product.count();
    const variantCount = await db.productVariant.count();

    return NextResponse.json({
      success: true,
      data: {
        categories: categoryCount,
        products: productCount,
        variants: variantCount,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
