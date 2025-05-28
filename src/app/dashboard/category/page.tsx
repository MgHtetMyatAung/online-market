"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  FolderTree,
  Building2,
  Folder,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import Link from "next/link";
import { useCategories, useDeleteCategory } from "@/hooks/api/use-category";
import { Category } from "@prisma/client";
import DeleteConfirmBtn from "@/components/actions/DeleteConfirmBtn";

type levelType = "main" | "sub" | "last";

interface CategoryType extends Category {
  parent?: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    };
  };
  _count: {
    products: number;
  };
}

// Extended mock data with more categories for pagination demonstration

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const delta = 1; // Reduced for mobile
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div className="flex items-center space-x-2 text-sm">
        <p className="text-muted-foreground hidden sm:block">
          Showing {startItem} to {endItem} of {totalItems} entries
        </p>
        <p className="text-muted-foreground sm:hidden">
          {startItem}-{endItem} of {totalItems}
        </p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-16 sm:w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20, 30, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground hidden sm:block">per page</p>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {getVisiblePages()
            .slice(0, 5)
            .map(
              (
                page,
                index // Limit visible pages on mobile
              ) => (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => typeof page === "number" && onPageChange(page)}
                  disabled={page === "..."}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              )
            )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CategoryTable({
  categories,
  level,
}: {
  categories: CategoryType[];
  level: levelType;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { mutate, isSuccess, isPending } = useDeleteCategory();

  // Filter categories by level and search term
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [categories, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + pageSize
  );

  // Reset to first page when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Reset to first page when page size changes
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const getLevelIcon = (level: levelType) => {
    switch (level) {
      case "main":
        return <Folder className="h-4 w-4 text-primary" />;
      case "sub":
        return <FolderTree className="h-4 w-4 text-blue-600" />;
      case "last":
        return <Building2 className="h-4 w-4 text-green-600" />;
      default:
        return <Folder className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLevelLabel = (level: levelType) => {
    switch (level) {
      case "main":
        return "Main Category";
      case "sub":
        return "Subcategory";
      case "last":
        return "Brand";
      default:
        return "Category";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${getLevelLabel(level).toLowerCase()}s...`}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredCategories.length} {getLevelLabel(level).toLowerCase()}
          {filteredCategories.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Name</TableHead>
                <TableHead className="min-w-[200px] hidden md:table-cell">
                  Description
                </TableHead>
                {level !== "main" && (
                  <TableHead className="min-w-[150px] hidden lg:table-cell">
                    Parent
                  </TableHead>
                )}
                <TableHead className="min-w-[100px]">Products</TableHead>
                <TableHead className="min-w-[80px] hidden sm:table-cell">
                  Status
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  Created
                </TableHead>
                <TableHead className="text-right min-w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getLevelIcon(level)}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="truncate">{category.name}</span>
                          <Badge variant="outline" className="text-xs w-fit">
                            {getLevelLabel(level)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          /{category.slug}
                        </div>
                        {/* Show description on mobile when hidden */}
                        <div className="md:hidden text-xs text-muted-foreground mt-1 truncate">
                          {category.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-[250px]">
                      <div className="truncate">
                        {category.description || "No description"}
                      </div>
                      {level === "sub" && (
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {category?.parent?.name} &gt; {category.name}
                        </div>
                      )}
                      {level === "last" && (
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {category?.parent?.parent.name} &gt;
                          {category?.parent?.name} &gt; {category.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  {level !== "main" && (
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(level)}
                        <span className="text-sm truncate">
                          {category?.parent?.name}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {category._count.products}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {new Date(category.createdAt).toLocaleDateString()}
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
                        {level !== "last" && (
                          <Link
                            href={
                              level === "main"
                                ? `/dashboard/category/create?level=sub&cateId=${category.id}`
                                : `/dashboard/category/create?level=last&cateId=${category.id}`
                            }
                          >
                            <DropdownMenuItem>
                              <Plus className="h-4 w-4 mr-2" />
                              Add {level === "main" ? "Subcategory" : "Brand"}
                            </DropdownMenuItem>
                          </Link>
                        )}
                        <DropdownMenuItem>View Products</DropdownMenuItem>
                        <DeleteConfirmBtn
                          title="Category"
                          targetId={category.id}
                          onDelete={mutate}
                          isPending={isPending}
                          isSuccess={isSuccess}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredCategories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredCategories.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No {getLevelLabel(level).toLowerCase()}s found
          </h3>
          <p className="text-muted-foreground mb-4 text-sm px-4">
            {searchTerm
              ? `No ${getLevelLabel(level).toLowerCase()}s match your search.`
              : `No ${getLevelLabel(
                  level
                ).toLowerCase()}s have been created yet.`}
          </p>
          <Button asChild>
            <Link href="/categories/create">
              <Plus className="h-4 w-4 mr-2" />
              Add {getLevelLabel(level)}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const { data: mainCate } = useCategories({ type: "main" });
  const { data: subCate } = useCategories({ type: "sub" });
  const { data: lastCate } = useCategories({ type: "last" });

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
              <Link href="/categories/create">
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
                {mainCate?.data?.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {mainCate?.data?.reduce(
                  (sum, cat) => sum + cat._count.products,
                  0
                )}{" "}
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
                {subCate?.data?.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {subCate?.data?.reduce(
                  (sum, cat) => sum + cat._count.products,
                  0
                )}{" "}
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
                {lastCate?.data?.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lastCate?.data?.reduce(
                  (sum, cat) => sum + cat._count.products,
                  0
                )}{" "}
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
                    Main ({mainCate?.data?.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="sub"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <FolderTree className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Sub ({subCate?.data?.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="brand"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Brands ({lastCate?.data?.length})
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                {mainCate?.data ? (
                  <CategoryTable
                    categories={mainCate?.data as CategoryType[]}
                    level="main"
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="sub" className="mt-6">
                {subCate?.data ? (
                  <CategoryTable
                    categories={subCate?.data as CategoryType[]}
                    level={"sub"}
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="brand" className="mt-6">
                {lastCate?.data ? (
                  <CategoryTable
                    categories={lastCate?.data as CategoryType[]}
                    level={"last"}
                  />
                ) : null}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
