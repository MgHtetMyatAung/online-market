import { Category } from "@prisma/client";

interface typeOfCategory extends Category {
  parent?: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    };
  };
  _count: {
    products: number;
  };
  level: number;
}

interface GetCategoriesParams {
  type?: "main" | "sub" | "last";
  parentId?: string;
}
