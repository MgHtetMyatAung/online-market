import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { Category } from "@prisma/client";

interface UseCategoriesParams {
  type?: "main" | "sub";
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
  return useQuery<Category[]>({
    // Specify return type
    queryKey: ["categories", params], // Include params in query key for caching
    queryFn: () => categoryService.getCategories(params),
  });
};

export const useCategoryById = (id: string) => {
  return useQuery<Category>({
    // Specify return type
    queryKey: ["category", id], // Include ID in query key for caching
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.createCategory(payload),
    onSuccess: () => {
      // Invalidate the categories list query to refetch data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoryService.updateCategory(id, payload),
    onSuccess: (updatedCategory) => {
      // Invalidate the specific category query
      queryClient.invalidateQueries({
        queryKey: ["category", updatedCategory.id],
      });
      // Invalidate the categories list query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      // Invalidate the categories list query to refetch data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
