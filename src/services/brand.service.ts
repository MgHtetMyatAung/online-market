/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponse } from "@/lib/api-response";
import { Brand } from "@prisma/client";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const brandService = {
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await fetch("/api/v1/brands");
    return response.json();
  },

  async getBrand(id: string): Promise<ApiResponse<Brand>> {
    const response = await fetch(`/api/v1/brands/${id}`);
    return response.json();
  },

  async createBrand(
    data: z.infer<typeof formSchema>
  ): Promise<ApiResponse<Brand>> {
    const response = await fetch("/api/v1/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateBrand(
    id: string,
    data: z.infer<typeof formSchema>
  ): Promise<ApiResponse<Brand>> {
    const response = await fetch(`/api/v1/brands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteBrand(id: string): Promise<ApiResponse<null>> {
    // Assuming delete returns null or a success message
    const response = await fetch(`/api/v1/brands/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};
