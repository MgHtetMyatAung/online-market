/* eslint-disable @typescript-eslint/no-explicit-any */
import { brandService } from "@/services/brand.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getBrands(),
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => brandService.getBrand(id),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; data: any }) =>
      brandService.updateBrand(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandService.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}
