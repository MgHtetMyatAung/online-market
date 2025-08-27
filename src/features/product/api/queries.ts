"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { productApi } from ".";
import { queryKeys } from "@/services/query-keys";
import { GetProductsParams, typeOfProduct } from "../type";

export const useGetProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => productApi.getAllProducts(params),
    // placeholderData: [], // Optional: for immediate UI
  });
};

type ProductQueryOptions = Omit<
  UseQueryOptions<typeOfProduct, Error, typeOfProduct, readonly unknown[]>,
  "queryKey" | "queryFn" | "enabled"
>;

export const useGetProductById = (
  productId: string | null,
  options?: ProductQueryOptions,
) => {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId, // Only run if productId is available
    ...options,
  });
};
