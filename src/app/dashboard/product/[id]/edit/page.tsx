import GoBackBtn from "@/components/actions/GoBackBtn";
import { ROUTE_PATH } from "@/constants/router";
import { ProductEditForm } from "@/features/product/components/product-form/product-edit-form";
import React from "react";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <div className="container mx-auto">
        <GoBackBtn href={ROUTE_PATH.PRODUCT.LIST} label="Back" />
        <div className="mb-8 mt-4">
          <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
        </div>
        <ProductEditForm productId={id} />
      </div>
    </div>
  );
}
