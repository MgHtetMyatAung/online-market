"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/hooks/api/use-products";
import { useBrand } from "@/hooks/api/use-brands";
import { Brand, Product } from "@prisma/client";

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

  const { data: productLists, isLoading } = useProducts({ brandId });
  const { data: brandDetail, isLoading: isBrandLoading } = useBrand(brandId);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const brand = brandDetail?.data || ({} as Brand);
  const products =
    (productLists?.data as ProductDetailType[]) || ([] as ProductDetailType[]);

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

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || String(product.isActive) === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.categoryId === categoryFilter;

    // return matchesSearch && matchesStatus && matchesCategory;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const activeProducts = products.filter((p) => p.isActive === true).length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

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

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Brand Header */}
        <div className="flex items-start gap-4 py-6 bg-muted/30 rounded-lg">
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
              <Badge variant={brand.isActive ? "default" : "secondary"}>
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
        <div className=" pt-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              {/* <Search className="h-4 w-4 text-muted-foreground" /> */}
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name.split(" > ").pop()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className=" pt-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                {/* <TableHead>SKU</TableHead> */}
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center">
                        {product.imageUrls[0] ? (
                          <Image
                            src={"/image/default.png"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-lg"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {product.name}
                          {product.isFeatured && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Created{" "}
                          {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell> */}
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {product.price.toFixed(2)} MMK
                      </div>
                      {/* {product.comparePrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.comparePrice.toFixed(2)}
                        </div>
                      )} */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock === 0
                          ? "destructive"
                          : product.stock < 10
                          ? "secondary"
                          : "default"
                      }
                    >
                      {product.stock} in stock
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{product.category.name}</div>
                    {/* <div className="text-xs text-muted-foreground">
                      {product.categoryId.split(" > ").slice(0, -1).join(" > ")}
                    </div> */}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.isActive === true
                          ? "default"
                          : product.isActive === false
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {product.isActive === true ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your filters to see more products."
                  : `${brand.name} doesn't have any products yet.`}
              </p>
              <Button asChild>
                <Link href="/products/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
