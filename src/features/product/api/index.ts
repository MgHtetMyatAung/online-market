/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/services/api";
import { Product } from "@prisma/client";
import { z } from "zod";
import { GetProductsParams, typeOfProduct } from "../type";

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});

const API_BASE_PATH = "/products";

export const productApi = {
  getAllProducts: async (
    params?: GetProductsParams,
  ): Promise<typeOfProduct[]> => {
    const response = await api.get<typeOfProduct[]>(API_BASE_PATH, { params });
    return response.data;
  },
  getProductById: async (id: string): Promise<typeOfProduct> => {
    const response = await api.get<typeOfProduct>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },
  createProduct: async (
    productData: z.infer<typeof formSchema>,
  ): Promise<Product> => {
    const response = await api.post<Product>(API_BASE_PATH, productData);
    return response.data;
  },
  updateProduct: async (
    id: string,
    productData: z.infer<typeof formSchema>,
  ): Promise<Product> => {
    const response = await api.patch<Product>(
      `${API_BASE_PATH}/${id}`,
      productData,
    );
    return response.data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_PATH}/${id}`);
  },
};
