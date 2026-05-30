// ============================================================
// Madaq Restaurant Menu Platform - TypeScript Type Definitions
// ============================================================

// --- Database Models (from Prisma) ---

export interface Restaurant {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  heroImage: string | null;
  instagramUrl: string | null;
  whatsappNumber: string | null;
  mapsUrl: string | null;
  primaryColor: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  categoryId: string;
  category?: Category;
  tags: string;
  allergens: string;
  isActive: boolean;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  label: string;
  price: number;
  calories: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- API Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Input Types for CRUD ---

export interface CreateCategoryInput {
  nameAr: string;
  nameEn: string;
  imageUrl?: string;
  order?: number;
}

export interface UpdateCategoryInput {
  id: string;
  nameAr?: string;
  nameEn?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateProductInput {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
  categoryId: string;
  tags?: string;
  allergens?: string;
  variants: {
    label: string;
    price: number;
    calories?: number;
  }[];
}

export interface UpdateProductInput {
  id: string;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
  categoryId?: string;
  tags?: string;
  allergens?: string;
  isActive?: boolean;
  variants?: {
    id?: string;
    label: string;
    price: number;
    calories?: number;
  }[];
}

export interface UpdateRestaurantInput {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  heroImage?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  mapsUrl?: string;
  primaryColor?: string;
}

// --- UI State Types ---

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";
