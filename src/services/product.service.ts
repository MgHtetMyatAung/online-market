import { ApiResponse } from "@/lib/api-response";
import { Product } from "@prisma/client";

export const productService = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await fetch("/api/v1/products");
    return response.json();
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`/api/v1/products/${id}`);
    return response.json();
  },

  async createProduct(
    data: Omit<Product, "id">
  ): Promise<ApiResponse<Product>> {
    const response = await fetch("/api/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
