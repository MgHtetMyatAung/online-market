import { ApiResponse } from "@/libs/api-response";
import { Product } from "@prisma/client";

export const productService = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await fetch("/api/products");
    return response.json();
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`/api/products/${id}`);
    return response.json();
  },

  async createProduct(
    data: Omit<Product, "id">
  ): Promise<ApiResponse<Product>> {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
