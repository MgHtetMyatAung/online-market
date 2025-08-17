import { useQuery } from "@tanstack/react-query";
import { GetPromotionsParams } from "../type";
import { PromotionApi } from ".";
import { queryKeys } from "@/services/query-keys";

export const useGetPromotions = (params?: GetPromotionsParams) => {
  return useQuery({
    queryKey: queryKeys.promotions(params),
    queryFn: () => PromotionApi.getAllPromotions(params),
    // placeholderData: [], // Optional: for immediate UI
  });
};

export const useGetPromotionById = (promotionId: string) => {
  return useQuery({
    queryKey: queryKeys.promotion(promotionId),
    queryFn: () => PromotionApi.getPromotionById(promotionId),
    enabled: !!promotionId, // Only run if promotionId is available
  });
};
