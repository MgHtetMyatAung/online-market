/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

const fetchBlogs = async () => {
  const res = await fetch(
    "http://localhost:3000/api/v1/products?isFeatured=true",
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export default async function ProductList() {
  const data = await fetchBlogs();
  console.log(data, "data");
  if (!data) {
    notFound();
  }
  return (
    <div>
      <div className=" grid grid-cols-3 gap-3 p-5">
        {data?.map((item: any) => (
          <Card key={item.id}>
            <CardHeader>
              <Image
                src={item?.image?.url || "/image/default.png"}
                alt={item.slug}
                width={400}
                height={300}
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
