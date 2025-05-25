import ProductsListByBrandId from "@/components/pages/brand/ProductsListByBrandId.component";
import React from "react";

export default async function ProductsOfBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <ProductsListByBrandId id={id} />
    </div>
  );
}
