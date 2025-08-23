import { queryKeys } from "@/services/query-keys";
import { attributeApi } from ".";
import { useQuery } from "@tanstack/react-query";

export const useGetAttributes = (params?: {
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.attributes(),
    queryFn: () => attributeApi.getAllAttributes(params),
    // placeholderData: [], // Optional: for immediate UI
  });
};

export const useGetVariants = () => {
  return useQuery({
    queryKey: queryKeys.variants(),
    queryFn: () => attributeApi.getAllVariants(),
    // placeholderData: [], // Optional: for immediate UI
  });
};

export const useGetAttributeById = (attributeId: string) => {
  return useQuery({
    queryKey: queryKeys.attribute(attributeId),
    queryFn: () => attributeApi.getAttributeById(attributeId),
    enabled: !!attributeId, // Only run if attributeId is available
  });
};
