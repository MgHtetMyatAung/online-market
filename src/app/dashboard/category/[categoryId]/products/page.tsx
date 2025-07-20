import ProductListByCategoryId from "@/features/category/components/ProductListByCategoryId";
import React from "react";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  return (
    <div>
      <ProductListByCategoryId categoryId={categoryId} />
    </div>
  );
}
