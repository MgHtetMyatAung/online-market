import CategoryEditForm from "@/components/forms/CategoryEditForm";
import React from "react";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <CategoryEditForm id={id} />
    </div>
  );
}
