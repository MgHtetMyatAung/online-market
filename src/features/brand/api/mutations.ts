/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brandApi } from ".";
import { typeOfBrand } from "../type";
import { z } from "zod";
import { queryKeys } from "@/services/query-keys";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBrand: Omit<z.infer<typeof formSchema>, "id">) =>
      brandApi.createBrand({
        name: newBrand.name,
        slug: newBrand.slug,
        image: newBrand.image || undefined,
        description: newBrand.description || undefined,
        url: newBrand.url || undefined,
        isActive: newBrand.isActive,
      }),
    onSuccess: () => {
      // Invalidate the 'brands' query to refetch the list after a new brand is created
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
      toast.success("Brand created successfully");
      // You might also update the cache directly if you know the new brand's ID
    },
    onError: (error: any) => {
      console.error("Failed to create brand:", error);
      if (error.status === 400) {
        toast.error("Brand already exists");
      } else {
        toast.error("Failed to create brand");
      }
      // Handle error (e.g., show toast notification)
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<z.infer<typeof formSchema>, "id">>;
    }) =>
      brandApi.updateBrand(id, {
        name: data.name ?? "",
        slug: data.slug ?? "",
        description: data.description,
        url: data.url,
        image: data.image,
        isActive: data.isActive,
      }),

    // Add optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.brands() });
      await queryClient.cancelQueries({ queryKey: queryKeys.brand(id) });

      // Snapshot the previous value
      const previousBrands = queryClient.getQueryData(queryKeys.brands());
      const previousBrand = queryClient.getQueryData(queryKeys.brand(id));

      // Optimistically update the cache
      if (previousBrands) {
        queryClient.setQueryData(
          queryKeys.brands(),
          (old: typeOfBrand[] | undefined) => {
            if (!old) return [];
            return old.map((brand) =>
              brand.id === id ? { ...brand, ...data } : brand
            );
          }
        );
      }

      if (previousBrand) {
        queryClient.setQueryData(
          queryKeys.brand(id),
          (old: typeOfBrand | undefined) => {
            if (!old) return;
            return { ...old, ...data };
          }
        );
      }

      return { previousBrands, previousBrand };
    },
    onSuccess: () => {
      toast.success("Brand updated successfully");
    },

    // If mutation fails, roll back to the previous value
    onError: (err, { id }, context) => {
      if (context?.previousBrands) {
        queryClient.setQueryData(queryKeys.brands(), context.previousBrands);
      }
      if (context?.previousBrand) {
        queryClient.setQueryData(queryKeys.brand(id), context.previousBrand);
      }
      console.error("Failed to update brand:", err);
      toast.error("Failed to update brand");
    },

    // After success or error, invalidate queries to ensure consistency
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
      queryClient.invalidateQueries({ queryKey: queryKeys.brand(id) });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandApi.deleteBrand(id),

    // Use optimistic updates to immediately update the UI
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.brands() });
      await queryClient.cancelQueries({ queryKey: queryKeys.brand(deletedId) });

      // Snapshot the previous values
      const previousBrands = queryClient.getQueryData(queryKeys.brands());
      const previousBrand = queryClient.getQueryData(
        queryKeys.brand(deletedId)
      );

      // Optimistically update the cache
      if (previousBrands) {
        queryClient.setQueryData(
          queryKeys.brands(),
          (old: typeOfBrand[] | undefined) => {
            if (!old) return [];
            return old.filter((brand) => brand.id !== deletedId);
          }
        );
      }

      // Remove the deleted brand from its individual query
      queryClient.removeQueries({ queryKey: queryKeys.brand(deletedId) });

      return { previousBrands, previousBrand };
    },
    onSuccess: () => {
      toast.success("Brand deleted successfully");
    },
    // If the mutation fails, roll back to the previous state
    onError: (err, deletedId, context) => {
      if (context?.previousBrands) {
        queryClient.setQueryData(queryKeys.brands(), context.previousBrands);
      }
      if (context?.previousBrand) {
        queryClient.setQueryData(
          queryKeys.brand(deletedId),
          context.previousBrand
        );
      }
      console.error("Failed to delete brand:", err);
      toast.error("Failed to delete brand");
    },

    // After success or error, invalidate queries to ensure consistency
    onSettled: (_, __, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
      queryClient.invalidateQueries({ queryKey: queryKeys.brand(deletedId) });
    },
  });
};
