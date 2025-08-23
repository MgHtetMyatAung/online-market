import { z } from "zod";

// Define a schema for variant attributes
const variantAttributeValueSchema = z.object({
  attributeId: z.string().uuid("Invalid attribute ID.").optional(),
  value: z.string().min(1, "Attribute value is required.").optional(),
  attributeValueId: z.string().uuid("Invalid attribute value ID.").optional(),
});

// Define a schema for product variants
const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, "SKU is required."),
  price: z.number().positive("Price must be a positive number."),
  stock: z.number().int().min(0, "Stock cannot be negative."),
  attributes: z
    .array(variantAttributeValueSchema)
    .min(1, "At least one attribute is required."),
});

// Main product schema
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long."),
  slug: z
    .string()
    .min(3, "Product slug must be at least 3 characters long.")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens."),
  description: z.string().optional(),
  howToUse: z.string().optional(),
  youtubeVideo: z
    .string()
    .url("Invalid YouTube video URL.")
    .optional()
    .or(z.literal("")),
  specification: z.string().optional(),
  basePrice: z.number().positive("Base price must be a positive number."),
  stock: z.number().int().min(0, "Stock cannot be negative."),
  imageUrls: z.array(z.string().url("Invalid image URL.")).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  categoryId: z.string().uuid("Invalid category ID."),
  brandId: z.string().uuid("Invalid brand ID.").optional().or(z.literal("")),
  promotionId: z
    .string()
    .uuid("Invalid promotion ID.")
    .optional()
    .or(z.literal("")),
  variants: z.array(productVariantSchema).optional(),
  // for frontend use
  selectedAttributes: z.array(z.string()).optional(),
});

// Schema for updating products - makes all fields optional
export const productUpdateSchema = productSchema.partial();

// Schema for creating a product variant
export const createProductVariantSchema = productVariantSchema;

// Schema for updating a product variant
export const updateProductVariantSchema = productVariantSchema.partial();
