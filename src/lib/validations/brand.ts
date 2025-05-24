// lib/validations/product.ts
import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Product name must be at least 3 characters long."),
  slug: z
    .string()
    .min(1, "Product slug must be at least 1 characters long.")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens."), // Regex for URL-friendly slug
  description: z.string().optional(), // Optional field
  image: z.string().optional(),
  // Array of productVariantSchema objects, optional
});

// If you have a schema for updating products, it might use .partial()
export const brandUpdateSchema = brandSchema.partial();
