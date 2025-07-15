"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Brand, Product } from "@prisma/client";
import ProductListTableByBrand from "@/features/brand/components/ProductListTableByBrand";
import { useGetProducts } from "@/features/product/api/queries";
import { useGetBrandById } from "@/features/brand/api/queries";
import clsx from "clsx";

interface ProductDetailType extends Product {
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProductsListByBrandId({ id }: { id: string }) {
  //   const params = useParams();
  //   const brandId = params.brandId as string;
  const brandId = id;

  const { data: productLists, isLoading } = useGetProducts({ brandId });
  const { data: brandDetail, isLoading: isBrandLoading } =
    useGetBrandById(brandId);

  const brand = brandDetail || ({} as Brand);
  const products =
    (productLists as ProductDetailType[]) || ([] as ProductDetailType[]);

  if (isLoading || isBrandLoading) {
    return <div>Loading...</div>;
  }

  if (!brand) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/brand">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brands
            </Link>
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Brand Not Found</h2>
            <p className="text-muted-foreground">
              The requested brand could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/brand">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brands
            </Link>
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="text-muted-foreground">
              The requested product could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get unique categories for filter
  const uniqueCategoriesMap = new Map();
  products.forEach((product) => {
    if (product.category && !uniqueCategoriesMap.has(product.category.id)) {
      uniqueCategoriesMap.set(product.category.id, {
        name: product.category.name,
        id: product.category.id,
      });
    }
  });
  const categories = Array.from(uniqueCategoriesMap.values());

  // Calculate stats
  const activeProducts = products.filter((p) => p.isActive === true).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/brand">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Link>
        </Button>
      </header>

      <div className="flex-1 space-y-4 pt-6">
        {/* Brand Header */}
        <div className="flex items-start gap-4 py-6 px-4 lg:px-8 bg-white rounded-lg">
          <div className="h-16 w-16 rounded-lg border bg-background flex items-center justify-center">
            {brand.image ? (
              <Image
                src={"/image/default.png"}
                alt={brand.name}
                width={64}
                height={64}
                className="rounded-lg"
              />
            ) : (
              <Package className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {brand.name}
              </h2>
              <Badge
                className={clsx({
                  "bg-green-400": brand.isActive,
                  "bg-red-400": !brand.isActive,
                })}
              >
                {brand.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {brand.description && (
              <p className="text-muted-foreground mb-2">{brand.description}</p>
            )}
            {/* {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {brand.website}
              </a>
            )} */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
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
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalValue.toLocaleString()} MMK
              </div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Products below 10 units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}

        <div className="">
          <ProductListTableByBrand brandId={brandId} />
        </div>
      </div>
    </div>
  );
}
