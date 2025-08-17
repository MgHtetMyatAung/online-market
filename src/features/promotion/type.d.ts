import { Promotion } from "@prisma/client";

interface typeOfPromotion extends Promotion {
  products: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
  }[];
  _count: {
    products: number;
  };
}

interface GetPromotionsParams {
  isActive?: boolean;
  couponCode?: string;
}
