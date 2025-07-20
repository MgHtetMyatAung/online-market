"use client";

import { useQuery } from "@tanstack/react-query";
import { productApi } from ".";
import { queryKeys } from "@/services/query-keys";
import { GetProductsParams } from "../type";

export const useGetProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => productApi.getAllProducts(params),
    // placeholderData: [], // Optional: for immediate UI
  });
};

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId, // Only run if productId is available
  });
};
