import { z } from "zod";

export const attributeValueSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

export const attributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  values: z.array(attributeValueSchema).optional(),
});
