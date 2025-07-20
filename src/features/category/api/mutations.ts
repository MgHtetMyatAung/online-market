/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from ".";
import { typeOfCategory } from "../type";
import toast from "react-hot-toast";
import { queryKeys } from "@/services/query-keys";

interface CategoryPayload {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive?: boolean;
  parentId?: string | null;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCategory: Omit<CategoryPayload, "id">) =>
      categoryApi.createCategory({
        name: newCategory.name,
        slug: newCategory.slug,
        image: newCategory.image || undefined,
        description: newCategory.description || undefined,
        isActive: newCategory.isActive,
        parentId: newCategory.parentId,
      }),
    onSuccess: () => {
      // Invalidate the 'categorys' query to refetch the list after a new category is created
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories({ type: "main" }),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories({ type: "sub" }),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories({ type: "last" }),
      });
      toast.success("Category created successfully");
      // You might also update the cache directly if you know the new category's ID
    },
    onError: (error: any) => {
      console.error("Failed to create category:", error);
      if (error.status === 400) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create category");
      }
      // Handle error (e.g., show toast notification)
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),

    // Use optimistic updates to immediately update the UI
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Get all the existing category queries
      const queryCache = queryClient.getQueryCache();
      const categoryQueries = queryCache.findAll({ queryKey: ["categories"] });

      // For each query, update the data by filtering out the deleted category
      categoryQueries.forEach((query) => {
        const previousData = query.state.data as typeOfCategory[] | undefined;

        if (previousData) {
          queryClient.setQueryData(
            query.queryKey,
            previousData.filter((category) => category.id !== deletedId)
          );
        }
      });

      // Return the previous data for rollback in case of error
      return { categoryQueries };
    },

    onSuccess: () => {
      toast.success("Category deleted successfully");
    },

    // If the mutation fails, roll back to the previous state
    onError: (err, deletedId, context) => {
      const error = err as any;
      if (context?.categoryQueries) {
        context.categoryQueries.forEach((query) => {
          queryClient.setQueryData(query.queryKey, query.state.data);
        });
      }
      console.error("Failed to delete category:", err);
      toast.error(error.message || "Failed to delete category");
    },

    // After success or error, invalidate queries to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"], exact: false });
    },
  });
};
