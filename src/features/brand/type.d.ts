import { Brand } from "@prisma/client";

interface typeOfBrand extends Brand {
  _count: {
    products: number;
  };
}
