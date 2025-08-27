"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";
import { productApi } from ".";
import { z } from "zod";
import toast from "react-hot-toast";
import { productSchema } from "@/lib/validations/product";
import { typeOfProduct } from "../type";

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
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.product(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.products() });

      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData<typeOfProduct>(
        queryKeys.product(id),
      );
      const previousProducts = queryClient.getQueryData<typeOfProduct[]>(
        queryKeys.products(),
      );

      // Optimistically update the cache
      if (previousProduct) {
        queryClient.setQueryData(queryKeys.product(id), data);
      }

      if (previousProducts) {
        queryClient.setQueryData(
          queryKeys.products(),
          previousProducts.map((product) =>
            product.id === id ? { ...product, ...data } : product,
          ),
        );
      }

      return { previousProduct, previousProducts };
    },
    onSuccess: (updatedProduct) => {
      // Invalidate both the specific product query and the products list
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(updatedProduct.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });

      toast.success("Product updated successfully");
    },
    onError: (err, { id }, context) => {
      // Revert the optimistic update on error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          queryKeys.product(id),
          context.previousProduct,
        );
      }
      if (context?.previousProducts) {
        queryClient.setQueryData(
          queryKeys.products(),
          context.previousProducts,
        );
      }
      toast.error("Failed to update product");
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products() });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products());

      // Optimistically update products list
      queryClient.setQueryData(queryKeys.products(), (old: typeOfProduct[]) => {
        if (!old) return [];
        return old?.filter((product) => product.id !== deletedId);
      });

      // Remove the individual product query
      queryClient.removeQueries({ queryKey: queryKeys.product(deletedId) });

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      queryClient.removeQueries({ queryKey: queryKeys.product(id) });
      toast.success("Product deleted successfully");
    },
    onError: (err, deletedId, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.products(), context?.previousProducts);
      toast.error("Failed to delete product");
    },
  });
};
