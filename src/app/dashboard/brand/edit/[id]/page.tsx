import BrandEditForm from "@/components/forms/BrandEditForm";
import React from "react";

export default async function BrandEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <BrandEditForm id={id} />
    </div>
  );
}
