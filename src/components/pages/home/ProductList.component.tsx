"use client";
import { useProducts } from "@/hooks/api/use-products";
import React from "react";

export default function ProductList() {
  const { data, isLoading } = useProducts();
  if (isLoading) return <p>Loading ...</p>;
  if (!data?.data) return <p>Data not found</p>;
  return (
    <div>
      <div>
        {data?.data.map((item, idx) => (
          <div key={idx}>
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
