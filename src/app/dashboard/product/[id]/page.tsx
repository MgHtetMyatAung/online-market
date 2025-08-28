import { ProductDetail } from "@/features/product/components/product-detail";
import React from "react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <ProductDetail productId={id} />
    </div>
  );
}
