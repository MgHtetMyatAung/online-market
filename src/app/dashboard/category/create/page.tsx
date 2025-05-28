"use client";

import CategoryCreateForm from "@/components/pages/category/CategoryCreateForm.component";
import { Suspense } from "react";

export default function CreateCategoryPage() {
  return (
    <Suspense>
      <CategoryCreateForm />
    </Suspense>
  );
}
