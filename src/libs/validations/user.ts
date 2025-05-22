import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserFormData = z.infer<typeof userSchema>;
