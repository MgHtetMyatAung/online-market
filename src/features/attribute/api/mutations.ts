/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attributeApi } from ".";
import { typeOfAttribute } from "../type";
import { z } from "zod";
import { queryKeys } from "@/services/query-keys";
import toast from "react-hot-toast";
import { attributeSchema } from "@/lib/validations/attribute";

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAttribute: z.infer<typeof attributeSchema>) =>
      attributeApi.createAttribute(newAttribute),
    onSuccess: () => {
      // Invalidate the 'attributes' query to refetch the list after a new attribute is created
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes() });
      toast.success("Attribute created successfully");
      // You might also update the cache directly if you know the new attribute's ID
    },
    onError: (error: any) => {
      console.error("Failed to create attribute:", error);
      if (error.status === 400) {
        toast.error("Attribute already exists");
      } else {
        toast.error("Failed to create attribute");
      }
      // Handle error (e.g., show toast notification)
    },
  });
};

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof attributeSchema>;
    }) => attributeApi.updateAttribute(id, data),

    // Add optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.attributes() });
      await queryClient.cancelQueries({ queryKey: queryKeys.attribute(id) });

      // Snapshot the previous value
      const previousAttributes = queryClient.getQueryData(
        queryKeys.attributes(),
      );
      const previousAttribute = queryClient.getQueryData(
        queryKeys.attribute(id),
      );

      // Optimistically update the cache
      if (previousAttributes) {
        queryClient.setQueryData(
          queryKeys.attributes(),
          (old: typeOfAttribute[] | undefined) => {
            if (!old) return [];
            return old.map((attribute) =>
              attribute.id === id ? { ...attribute, ...data } : attribute,
            );
          },
        );
      }

      if (previousAttribute) {
        queryClient.setQueryData(
          queryKeys.attribute(id),
          (old: typeOfAttribute | undefined) => {
            if (!old) return;
            return { ...old, ...data };
          },
        );
      }

      return { previousAttributes, previousAttribute };
    },
    onSuccess: () => {
      toast.success("Attribute updated successfully");
    },

    // If mutation fails, roll back to the previous value
    onError: (err, { id }, context) => {
      if (context?.previousAttributes) {
        queryClient.setQueryData(
          queryKeys.attributes(),
          context.previousAttributes,
        );
      }
      if (context?.previousAttribute) {
        queryClient.setQueryData(
          queryKeys.attribute(id),
          context.previousAttribute,
        );
      }
      console.error("Failed to update attribute:", err);
      toast.error("Failed to update attribute");
    },

    // After success or error, invalidate queries to ensure consistency
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes() });
      queryClient.invalidateQueries({ queryKey: queryKeys.attribute(id) });
    },
  });
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attributeApi.deleteAttribute(id),

    // Use optimistic updates to immediately update the UI
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.attributes() });
      await queryClient.cancelQueries({
        queryKey: queryKeys.attribute(deletedId),
      });

      // Snapshot the previous values
      const previousAttributes = queryClient.getQueryData(
        queryKeys.attributes(),
      );
      const previousAttribute = queryClient.getQueryData(
        queryKeys.attribute(deletedId),
      );

      // Optimistically update the cache
      if (previousAttributes) {
        queryClient.setQueryData(
          queryKeys.attributes(),
          (old: typeOfAttribute[] | undefined) => {
            if (!old) return [];
            return old.filter((attribute) => attribute.id !== deletedId);
          },
        );
      }

      // Remove the deleted attribute from its individual query
      queryClient.removeQueries({ queryKey: queryKeys.attribute(deletedId) });

      return { previousAttributes, previousAttribute };
    },
    onSuccess: () => {
      toast.success("Attribute deleted successfully");
    },
    // If the mutation fails, roll back to the previous state
    onError: (err, deletedId, context) => {
      if (context?.previousAttributes) {
        queryClient.setQueryData(
          queryKeys.attributes(),
          context.previousAttributes,
        );
      }
      if (context?.previousAttribute) {
        queryClient.setQueryData(
          queryKeys.attribute(deletedId),
          context.previousAttribute,
        );
      }
      console.error("Failed to delete attribute:", err);
      toast.error("Failed to delete attribute");
    },

    // After success or error, invalidate queries to ensure consistency
    onSettled: (_, __, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attribute(deletedId),
      });
    },
  });
};
