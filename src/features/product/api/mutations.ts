"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";
import { productApi } from ".";
import { z } from "zod";
import toast from "react-hot-toast";
import { productSchema } from "@/lib/validations/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct: Omit<z.infer<typeof productSchema>, "id">) =>
      productApi.createProduct(newProduct),
    onSuccess: () => {
      // Invalidate the 'products' query to refetch the list after a new product is created
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
      toast.success("Product created successfully");
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
      data: z.infer<typeof productSchema>;
    }) => productApi.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Invalidate both the specific product query and the products list
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(updatedProduct.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });

      toast.success("Product updated successfully");
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
