import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number(),
  stock: z.number().int().min(0),
  categoryId: z.number(),
});

export type ProductFormData = z.infer<typeof productSchema>;
