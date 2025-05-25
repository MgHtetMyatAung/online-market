/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponse } from "@/lib/api-response";
import { Product } from "@prisma/client";

interface GetProductsParams {
  brandId?: string;
  categoryId?: string;
  promotionId?: string;
}

export const productService = {
  async getProducts(
    params?: GetProductsParams
  ): Promise<ApiResponse<Product[]>> {
    // Construct the query string from the params object
    const queryString = params
      ? Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")
      : "";

    // Build the fetch URL with the query string
    const url = `/api/v1/products${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
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
