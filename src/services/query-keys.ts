/* eslint-disable @typescript-eslint/no-explicit-any */
export const queryKeys = {
  products: (params?: Record<string, any>) => ["products", params] as const,
  product: (id: string | undefined | null) => ["product", id] as const,
  brands: (params?: Record<string, any>) => ["brands", params] as const,
  brand: (id: string) => ["brand", id] as const,
  categories: (params?: Record<string, any>) => ["categories", params] as const,
  category: (id: string) => ["category", id] as const,
  promotions: (params?: Record<string, any>) => ["promotions", params] as const,
  promotion: (id: string) => ["promotion", id] as const,
  attributes: (params?: Record<string, any>) => ["attributes", params] as const,
  variants: (params?: Record<string, any>) => ["variants", params] as const,
  attribute: (id: string) => ["attribute", id] as const,
  cart: (userId: string) => ["cart", userId] as const,
  user: (userId: string) => ["user", userId] as const,
  // Add more keys as your features grow
};
