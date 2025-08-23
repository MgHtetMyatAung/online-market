import api from "@/services/api";
import { typeOfAttribute } from "../type";
import { z } from "zod";
import { attributeSchema } from "@/lib/validations/attribute";

interface variantResponse {
  id: string;
  value: string;
}

const API_BASE_PATH = "/attribute";

export const attributeApi = {
  getAllAttributes: async (params?: {
    category?: string;
    search?: string;
  }): Promise<typeOfAttribute[]> => {
    const response = await api.get<typeOfAttribute[]>(API_BASE_PATH, {
      params,
    });
    return response.data;
  },
  getAllVariants: async (): Promise<variantResponse[]> => {
    const response = await api.get<variantResponse[]>("/variant");
    return response.data;
  },
  getAttributeById: async (id: string): Promise<typeOfAttribute> => {
    const response = await api.get<typeOfAttribute>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },
  createAttribute: async (
    attributeData: z.infer<typeof attributeSchema>,
  ): Promise<typeOfAttribute> => {
    const response = await api.post<typeOfAttribute>(
      API_BASE_PATH,
      attributeData,
    );
    return response.data;
  },
  updateAttribute: async (
    id: string,
    attributeData: z.infer<typeof attributeSchema>,
  ): Promise<typeOfAttribute> => {
    const response = await api.put<typeOfAttribute>(
      `${API_BASE_PATH}/${id}`,
      attributeData,
    );
    return response.data;
  },
  deleteAttribute: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_PATH}/${id}`);
  },
};
