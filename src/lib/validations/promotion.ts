import { z } from "zod";

export const promotionSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  description: z.string().optional(),
  type: z.enum([
    "PERCENTAGE_DISCOUNT",
    "FIXED_AMOUNT_DISCOUNT",
    "FREE_SHIPPING",
  ]),
  value: z.number().min(0, "Value must be positive"),
  minOrderAmount: z.number().min(0).optional(),
  imageUrl: z.string().optional(),
  minQuantity: z.number().min(0).optional(),
  maxQuantity: z.number().min(0).optional(),
  couponCode: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().default(true),
});
