/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";
import { productApi } from ".";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct: Omit<z.infer<typeof formSchema>, "id">) =>
      productApi.createProduct({
        name: newProduct.name,
        slug: newProduct.slug,
        image: newProduct.image || undefined,
        description: newProduct.description || undefined,
      }),
    onSuccess: () => {
      // Invalidate the 'products' query to refetch the list after a new product is created
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      // You might also update the cache directly if you know the new product's ID
    },
    onError: (error) => {
      console.error("Failed to create product:", error);
      // Handle error (e.g., show toast notification)
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<z.infer<typeof formSchema>, "id">>;
    }) =>
      productApi.updateProduct(id, {
        name: data.name ?? "",
        slug: data.slug ?? "",
        description: data.description,
        image: data.image,
      }),
    onSuccess: (updatedProduct) => {
      // Invalidate both the specific product query and the products list
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(updatedProduct.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
    },
    onError: (error) => {
      console.error("Failed to update product:", error);
      // Handle error (e.g., show toast notification)
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (_, id) => {
      // Invalidate the products list query
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      // Remove the specific product from the cache
      queryClient.removeQueries({ queryKey: queryKeys.product(id) });
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
      // Handle error (e.g., show toast notification)
    },
  });
};
