// lib/validations/product.ts
import { z } from "zod";

// Define a Zod schema for ProductVariant
const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required."),
  value: z.string().min(1, "Variant value is required."),
  variantStock: z.number().int().min(0, "Variant stock cannot be negative."),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long."),
  slug: z
    .string()
    .min(3, "Product slug must be at least 3 characters long.")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens."), // Regex for URL-friendly slug
  description: z.string().optional(), // Optional field
  price: z.number().positive("Price must be a positive number."),
  stock: z.number().int().min(0, "Stock cannot be negative."),
  categoryId: z.string().uuid("Invalid category ID."), // UUID format for Prisma IDs
  brandId: z.string().uuid("Invalid brand ID.").optional(), // Optional, but if present, must be UUID
  imageUrls: z
    .array(z.string().url("Invalid image URL."))
    .min(1, "At least one image URL is required."), // Array of URLs
  isFeatured: z.boolean().optional(), // Optional boolean
  isActive: z.boolean().optional(), // Optional boolean
  promotionId: z.string().uuid("Invalid promotion ID.").optional(), // Optional, but if present, must be UUID
  variants: z.array(productVariantSchema).optional(), // Array of productVariantSchema objects, optional
});

// If you have a schema for updating products, it might use .partial()
export const productUpdateSchema = productSchema.partial();
