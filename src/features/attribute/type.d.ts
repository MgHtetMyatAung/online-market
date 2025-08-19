import { Attribute } from "@prisma/client";

interface typeOfAttribute extends Attribute {
  values: {
    value: string;
  }[];
  _count: {
    values: number;
  };
}
