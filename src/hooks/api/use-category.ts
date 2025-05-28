/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { Category } from "@prisma/client";
import { ApiResponse } from "@/lib/api-response";
import toast from "react-hot-toast";

interface CategoryType extends Category {
  parent?: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    };
  };
  _count: {
    products: number;
  };
}

interface UseCategoriesParams {
  type?: "main" | "sub" | "last";
  parentId?: string;
}

interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive?: boolean;
  parentId?: string | null;
}

interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: string;
  slug?: string;
  isActive?: boolean;
  parentId?: string | null;
}

export const useCategories = (params?: UseCategoriesParams) => {
  return useQuery<ApiResponse<CategoryType[]>>({
    // Updated return type
    queryKey: ["categories", params],
    queryFn: () => categoryService.getCategories(params),
  });
};

export const useCategoryById = (id: string) => {
  return useQuery<ApiResponse<Category>>({
    // Updated return type
    queryKey: ["category", id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Category>, Error, CreateCategoryPayload>({
    // Updated return and error types
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.createCategory(payload),
    onSuccess: (data) => {
      // 'data' here is the ApiResponse<Category>
      // Invalidate the categories list query to refetch data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // You can now access data.message here if needed for a toast or log
      toast.success(data.message || "Category created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category.");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Category>,
    Error,
    { id: string; payload: UpdateCategoryPayload }
  >({
    // Updated types
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoryService.updateCategory(id, payload),
    onSuccess: (data) => {
      // 'data' here is the ApiResponse<Category>
      // Invalidate the specific category query
      queryClient.invalidateQueries({ queryKey: ["category", data.data?.id] }); // Use data.data?.id
      // Invalidate the categories list query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message || "Category updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category.");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Category>, Error, string>({
    // Updated types
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (data) => {
      // 'data' here is the ApiResponse<Category>
      // Invalidate the categories list query to refetch data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // toast.success(data.message || "Category deleted successfully!");
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to delete category.");
    },
  });
};
