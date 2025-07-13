import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from ".";
import { typeOfCategory } from "../type";

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

    // If the mutation fails, roll back to the previous state
    onError: (err, deletedId, context) => {
      if (context?.categoryQueries) {
        context.categoryQueries.forEach((query) => {
          queryClient.setQueryData(query.queryKey, query.state.data);
        });
      }
      console.error("Failed to delete category:", err);
    },

    // After success or error, invalidate queries to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"], exact: false });
    },
  });
};
