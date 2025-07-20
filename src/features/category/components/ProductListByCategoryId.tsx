"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  FolderTree,
  Building2,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { useGetProducts } from "@/features/product/api/queries";
import { useGetCategoryById } from "../api/queries";
import ProductListTableByCategory from "./ProductListTableByCategory";
import useScrollToTop from "@/hooks/useScrollToTop";

export default function ProductListByCategoryId({
  categoryId,
}: {
  categoryId: string;
}) {
  const { data: products, isLoading } = useGetProducts({ categoryId });
  const { data: category, isLoading: isCategoryLoading } =
    useGetCategoryById(categoryId);
  useScrollToTop();

  // Get unique brands for filter
  const brands = Array.from(
    new Set(products?.map((product) => product.brandId))
  );

  if (isLoading || isCategoryLoading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex h-14 lg:h-16 shrink-0 items-center gap-2 border-b px-3 lg:px-4">
          <SidebarTrigger className="-ml-1" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Categories</span>
            </Link>
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl lg:text-2xl font-bold">
              Category Not Found
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base">
              The requested category could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeProducts = products?.filter((p) => p.isActive === true).length;
  const totalValue = products?.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockProducts = products?.filter((p) => p.stock < 10).length;

  const getCategoryIcon = (level: number) => {
    switch (level) {
      case 0:
        return <Folder className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />;
      case 1:
        return <FolderTree className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />;
      case 2:
        return <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />;
      default:
        return (
          <Folder className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />
        );
    }
  };

  const getCategoryLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return "Main Category";
      case 1:
        return "Subcategory";
      case 2:
        return "Brand";
      default:
        return "Category";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/category">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Link>
        </Button>
      </header>

      <div className="flex-1 space-y-5 pt-4 lg:pt-6">
        {/* Category Header */}
        <div className="flex items-start gap-4 py-6 px-4 lg:px-8 bg-white rounded-lg shadow">
          <div className="h-12 w-12 lg:h-16 lg:w-16 rounded-lg border bg-background flex items-center justify-center shrink-0">
            {getCategoryIcon(category.level)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight truncate">
                {category.name}
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="w-fit">
                  {getCategoryLevelLabel(category.level)}
                </Badge>
                <Badge
                  variant={category.isActive ? "default" : "secondary"}
                  className="w-fit"
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            {category.description && (
              <p className="text-muted-foreground mb-2 text-sm lg:text-base">
                {category.description}
              </p>
            )}
            {/* <div className="text-sm text-muted-foreground">
              <span className="font-medium">Category Path:</span>{" "}
              {category.description}
            </div> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                {products?.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeProducts} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                ${totalValue?.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                {lowStockProducts}
              </div>
              <p className="text-xs text-muted-foreground">Below 10 units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brands</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                {brands.length}
              </div>
              <p className="text-xs text-muted-foreground">Unique brands</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <div>
          <ProductListTableByCategory categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
}
