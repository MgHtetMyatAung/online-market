import api from "@/services/api";
import { Product } from "@prisma/client";

const API_BASE_PATH = "/products";

export const productApi = {
  getAllProducts: async (params?: {
    category?: string;
    search?: string;
  }): Promise<Product[]> => {
    const response = await api.get<Product[]>(API_BASE_PATH, { params });
    return response.data;
  },
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },
  createProduct: async (productData: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post<Product>(API_BASE_PATH, productData);
    return response.data;
  },
  updateProduct: async (
    id: string,
    productData: Partial<Omit<Product, "id">>
  ): Promise<Product> => {
    const response = await api.put<Product>(
      `${API_BASE_PATH}/${id}`,
      productData
    );
    return response.data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_PATH}/${id}`);
  },
};
