import { Product } from "@prisma/client";

interface typeOfProduct extends Product {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  inStock?: boolean;
  totalStock?: number;
}

interface GetProductsParams {
  brandId?: string;
  categoryId?: string;
  promotionId?: string;
}

interface ProductVariantType {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    attributeId: string;
    value: string;
  };
}
