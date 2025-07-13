"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FolderTree, Building2, Folder } from "lucide-react";

import Link from "next/link";
import { useGetCategories } from "@/features/category/api/queries";
import CategoryListTable from "@/features/category/components/CategoryListTable";
import { ROUTE_PATH } from "@/constants/router";

export default function CategoriesPage() {
  const { data: mainCate } = useGetCategories({ type: "main" });
  const { data: subCate } = useGetCategories({ type: "sub" });
  const { data: lastCate } = useGetCategories({ type: "last" });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className=" space-y-3">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Categories
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base">
              Manage your product categories and subcategories
            </p>
          </div>
          <div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={ROUTE_PATH.CATEGORY.CREATE}>
                <Plus className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Add Category</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Main Categories
              </CardTitle>
              <Folder className="h-4 w-4 text-primary shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                {mainCate?.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {mainCate?.reduce((sum, cat) => sum + cat._count.products, 0)}{" "}
                total products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subcategories
              </CardTitle>
              <FolderTree className="h-4 w-4 text-blue-600 shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                {subCate?.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {subCate?.reduce((sum, cat) => sum + cat._count.products, 0)}{" "}
                total products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brands</CardTitle>
              <Building2 className="h-4 w-4 text-green-600 shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">
                {lastCate?.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lastCate?.reduce((sum, cat) => sum + cat._count.products, 0)}{" "}
                total products
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">
              Category Management
            </CardTitle>
            <CardDescription className="text-sm">
              Organize your products with 3-level categories: Main Category &gt;
              Subcategory &gt; Brand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger
                  value="main"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <Folder className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Main ({mainCate?.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="sub"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <FolderTree className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Sub ({subCate?.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="brand"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Brands ({lastCate?.length})
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                <CategoryListTable type="main" />
              </TabsContent>

              <TabsContent value="sub" className="mt-6">
                <CategoryListTable type="sub" />
              </TabsContent>

              <TabsContent value="brand" className="mt-6">
                <CategoryListTable type="last" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
