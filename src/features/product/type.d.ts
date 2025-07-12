import { Product } from "@prisma/client";

interface typeOfProduct extends Product {
  category: {
    id: string;
    name: string;
    slug: string;
  };
}
