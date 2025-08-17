import { promotionSchema } from "@/lib/validations/promotion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { PromotionApi } from ".";
import { queryKeys } from "@/services/query-keys";
import toast from "react-hot-toast";

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPromotion: Omit<z.infer<typeof promotionSchema>, "id">) =>
      PromotionApi.createPromotion(newPromotion),
    onSuccess: () => {
      // Invalidate the 'promotions' query to refetch the list after a new promotion is created
      queryClient.invalidateQueries({ queryKey: [queryKeys.promotions()] });
      toast.success("Promotion created successfully");
      // You might also update the cache directly if you know the new promotion's ID
    },
    onError: (error) => {
      console.error("Failed to create promotion:", error);
      // Handle error (e.g., show toast notification)
    },
  });
};
