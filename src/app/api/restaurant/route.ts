import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET restaurant settings
export async function GET() {
  try {
    let restaurant = await db.restaurant.findFirst();

    if (!restaurant) {
      // Create default if not exists
      restaurant = await db.restaurant.create({
        data: {
          nameAr: "مضيق",
          nameEn: "Madaq",
          descriptionAr: "مطعم مضيق - تجربة طعام استثنائية",
          descriptionEn: "Madaq Restaurant - An exceptional dining experience",
        },
      });
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("GET restaurant error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurant settings" },
      { status: 500 }
    );
  }
}

// PUT update restaurant settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameAr, nameEn, descriptionAr, descriptionEn, heroImage, instagramUrl, whatsappNumber, mapsUrl, primaryColor } = body;

    let restaurant = await db.restaurant.findFirst();

    if (!restaurant) {
      restaurant = await db.restaurant.create({
        data: {
          nameAr: nameAr || "مضيق",
          nameEn: nameEn || "Madaq",
          descriptionAr: descriptionAr || null,
          descriptionEn: descriptionEn || null,
          heroImage: heroImage || null,
          instagramUrl: instagramUrl || null,
          whatsappNumber: whatsappNumber || null,
          mapsUrl: mapsUrl || null,
          primaryColor: primaryColor || null,
        },
      });
    } else {
      restaurant = await db.restaurant.update({
        where: { id: restaurant.id },
        data: {
          ...(nameAr && { nameAr }),
          ...(nameEn && { nameEn }),
          ...(descriptionAr !== undefined && { descriptionAr }),
          ...(descriptionEn !== undefined && { descriptionEn }),
          ...(heroImage !== undefined && { heroImage }),
          ...(instagramUrl !== undefined && { instagramUrl }),
          ...(whatsappNumber !== undefined && { whatsappNumber }),
          ...(mapsUrl !== undefined && { mapsUrl }),
          ...(primaryColor !== undefined && { primaryColor }),
        },
      });
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("PUT restaurant error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update restaurant settings" },
      { status: 500 }
    );
  }
}
