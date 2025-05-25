import { productService } from "@/services/product.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
interface GetProductsParams {
  brandId?: string;
  categoryId?: string;
  promotionId?: string;
}

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    // Include params in the queryKey
    queryKey: ["products", params],
    // Pass params to the service function
    queryFn: () => productService.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productService.getProduct(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
