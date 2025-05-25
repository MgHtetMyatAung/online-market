"use client";
import { useCategories } from "@/hooks/api/use-category";
import React from "react";

export default function CategoryPage() {
  const { data, isLoading } = useCategories({ type: "main" });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  console.log(data);
  return <div>CategoryPage</div>;
}
