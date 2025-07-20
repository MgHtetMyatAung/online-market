/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/services/api";
import { typeOfBrand } from "../type";
import { z } from "zod";

const API_BASE_PATH = "/brands";

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const brandApi = {
  getAllBrands: async (params?: {
    category?: string;
    search?: string;
  }): Promise<typeOfBrand[]> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await api.get<typeOfBrand[]>(API_BASE_PATH, { params });
    return response.data;
  },
  getBrandById: async (id: string): Promise<typeOfBrand> => {
    const response = await api.get<typeOfBrand>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },
  createBrand: async (
    brandData: z.infer<typeof formSchema>
  ): Promise<typeOfBrand> => {
    const response = await api.post<typeOfBrand>(API_BASE_PATH, brandData);
    return response.data;
  },
  updateBrand: async (
    id: string,
    brandData: z.infer<typeof formSchema>
  ): Promise<typeOfBrand> => {
    const response = await api.put<typeOfBrand>(
      `${API_BASE_PATH}/${id}`,
      brandData
    );
    return response.data;
  },
  deleteBrand: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_PATH}/${id}`);
  },
};
