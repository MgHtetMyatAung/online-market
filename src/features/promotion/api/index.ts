import api from "@/services/api";
import { GetPromotionsParams, typeOfPromotion } from "../type";
import { Promotion } from "@prisma/client";
import { promotionSchema } from "@/lib/validations/promotion";
import { z } from "zod";

const API_BASE_PATH = "/promotion";

export const PromotionApi = {
  getAllPromotions: async (
    params?: GetPromotionsParams,
  ): Promise<typeOfPromotion[]> => {
    const response = await api.get<typeOfPromotion[]>(API_BASE_PATH, {
      params,
    });
    return response.data;
  },
  getPromotionById: async (id: string): Promise<typeOfPromotion> => {
    const response = await api.get<typeOfPromotion>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },
  createPromotion: async (
    PromotionData: z.infer<typeof promotionSchema>,
  ): Promise<Promotion> => {
    const response = await api.post<Promotion>(API_BASE_PATH, PromotionData);
    return response.data;
  },
  updatepromotion: async (
    id: string,
    PromotionData: z.infer<typeof promotionSchema>,
  ): Promise<Promotion> => {
    const response = await api.put<Promotion>(
      `${API_BASE_PATH}/${id}`,
      PromotionData,
    );
    return response.data;
  },
  deletepromotion: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE_PATH}/${id}`);
  },
};
