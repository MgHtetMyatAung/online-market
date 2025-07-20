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
}

interface GetProductsParams {
  brandId?: string;
  categoryId?: string;
  promotionId?: string;
}
