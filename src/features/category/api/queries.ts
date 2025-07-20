"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/query-keys";
import { categoryApi } from ".";
import { GetCategoriesParams } from "../type";

export const useGetCategories = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: queryKeys.categories(params),
    queryFn: () => categoryApi.getAllCategorys(params),
  });
};

export const useGetCategoryById = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.category(categoryId),
    queryFn: () => categoryApi.getCategoryById(categoryId),
    enabled: !!categoryId, // Only run if categoryId is available
  });
};
