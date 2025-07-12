"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/query-keys";
import { brandApi } from ".";

export const useGetBrands = (params?: {
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.brands(params),
    queryFn: () => brandApi.getAllBrands(params),
    placeholderData: [], // Optional: for immediate UI
  });
};

export const useGetBrandById = (brandId: string) => {
  return useQuery({
    queryKey: queryKeys.brand(brandId),
    queryFn: () => brandApi.getBrandById(brandId),
    enabled: !!brandId, // Only run if brandId is available
  });
};
