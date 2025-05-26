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
  Trash2,
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  parentId?: string;
  parentName?: string;
  level: 0 | 1 | 2; // 0 = Main, 1 = Subcategory, 2 = Brand
  isActive: boolean;
  createdAt: string;
  fullPath?: string;
}

// Extended mock data with more categories for pagination demonstration
const mockCategories: Category[] = [
  // Main Categories (Level 0)
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and accessories",
    productCount: 245,
    level: 0,
    isActive: true,
    createdAt: "2024-01-15",
    fullPath: "Electronics",
  },
  {
    id: "15",
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    productCount: 324,
    level: 0,
    isActive: true,
    createdAt: "2024-01-12",
    fullPath: "Clothing",
  },
  {
    id: "26",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Home improvement and garden supplies",
    productCount: 203,
    level: 0,
    isActive: true,
    createdAt: "2024-01-10",
    fullPath: "Home & Garden",
  },
  {
    id: "35",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment and outdoor gear",
    productCount: 156,
    level: 0,
    isActive: true,
    createdAt: "2024-01-08",
    fullPath: "Sports & Outdoors",
  },
  {
    id: "36",
    name: "Books & Media",
    slug: "books-media",
    description: "Books, movies, music and digital media",
    productCount: 89,
    level: 0,
    isActive: true,
    createdAt: "2024-01-06",
    fullPath: "Books & Media",
  },
  {
    id: "37",
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Health, wellness and beauty products",
    productCount: 234,
    level: 0,
    isActive: true,
    createdAt: "2024-01-04",
    fullPath: "Health & Beauty",
  },

  // Subcategories (Level 1) - More entries for pagination
  {
    id: "2",
    name: "Smartphones",
    slug: "smartphones",
    description: "Mobile phones and accessories",
    productCount: 89,
    parentId: "1",
    parentName: "Electronics",
    level: 1,
    isActive: true,
    createdAt: "2024-01-14",
    fullPath: "Electronics > Smartphones",
  },
  {
    id: "6",
    name: "Laptops",
    slug: "laptops",
    description: "Portable computers",
    productCount: 156,
    parentId: "1",
    parentName: "Electronics",
    level: 1,
    isActive: true,
    createdAt: "2024-01-13",
    fullPath: "Electronics > Laptops",
  },
  {
    id: "11",
    name: "Tablets",
    slug: "tablets",
    description: "Tablet computers",
    productCount: 67,
    parentId: "1",
    parentName: "Electronics",
    level: 1,
    isActive: true,
    createdAt: "2024-01-11",
    fullPath: "Electronics > Tablets",
  },
  {
    id: "38",
    name: "Desktop Computers",
    slug: "desktop-computers",
    description: "Desktop PCs and workstations",
    productCount: 45,
    parentId: "1",
    parentName: "Electronics",
    level: 1,
    isActive: true,
    createdAt: "2024-01-09",
    fullPath: "Electronics > Desktop Computers",
  },
  {
    id: "39",
    name: "Gaming Consoles",
    slug: "gaming-consoles",
    description: "Video game consoles and accessories",
    productCount: 78,
    parentId: "1",
    parentName: "Electronics",
    level: 1,
    isActive: true,
    createdAt: "2024-01-07",
    fullPath: "Electronics > Gaming Consoles",
  },
  {
    id: "40",
    name: "Audio Equipment",
    slug: "audio-equipment",
    description: "Speakers, headphones, and audio gear",
    productCount: 123,
    parentId: "1",
    parentName: "Electronics",
    level: 1,
    isActive: true,
    createdAt: "2024-01-05",
    fullPath: "Electronics > Audio Equipment",
  },
  {
    id: "16",
    name: "Men's Clothing",
    slug: "mens-clothing",
    description: "Men's fashion and apparel",
    productCount: 156,
    parentId: "15",
    parentName: "Clothing",
    level: 1,
    isActive: true,
    createdAt: "2024-01-11",
    fullPath: "Clothing > Men's Clothing",
  },
  {
    id: "21",
    name: "Women's Clothing",
    slug: "womens-clothing",
    description: "Women's fashion and apparel",
    productCount: 168,
    parentId: "15",
    parentName: "Clothing",
    level: 1,
    isActive: true,
    createdAt: "2024-01-09",
    fullPath: "Clothing > Women's Clothing",
  },
  {
    id: "41",
    name: "Children's Clothing",
    slug: "childrens-clothing",
    description: "Kids and baby clothing",
    productCount: 89,
    parentId: "15",
    parentName: "Clothing",
    level: 1,
    isActive: true,
    createdAt: "2024-01-03",
    fullPath: "Clothing > Children's Clothing",
  },
  {
    id: "42",
    name: "Shoes",
    slug: "shoes",
    description: "Footwear for all occasions",
    productCount: 234,
    parentId: "15",
    parentName: "Clothing",
    level: 1,
    isActive: true,
    createdAt: "2024-01-01",
    fullPath: "Clothing > Shoes",
  },

  // Brands (Level 2) - Extended for pagination
  {
    id: "3",
    name: "iPhone",
    slug: "iphone",
    description: "Apple iPhone series",
    productCount: 34,
    parentId: "2",
    parentName: "Smartphones",
    level: 2,
    isActive: true,
    createdAt: "2024-01-13",
    fullPath: "Electronics > Smartphones > iPhone",
  },
  {
    id: "4",
    name: "Samsung Galaxy",
    slug: "samsung-galaxy",
    description: "Samsung Galaxy series",
    productCount: 28,
    parentId: "2",
    parentName: "Smartphones",
    level: 2,
    isActive: true,
    createdAt: "2024-01-12",
    fullPath: "Electronics > Smartphones > Samsung Galaxy",
  },
  {
    id: "5",
    name: "Google Pixel",
    slug: "google-pixel",
    description: "Google Pixel phones",
    productCount: 27,
    parentId: "2",
    parentName: "Smartphones",
    level: 2,
    isActive: true,
    createdAt: "2024-01-11",
    fullPath: "Electronics > Smartphones > Google Pixel",
  },
  {
    id: "43",
    name: "OnePlus",
    slug: "oneplus",
    description: "OnePlus smartphones",
    productCount: 15,
    parentId: "2",
    parentName: "Smartphones",
    level: 2,
    isActive: true,
    createdAt: "2024-01-10",
    fullPath: "Electronics > Smartphones > OnePlus",
  },
  {
    id: "44",
    name: "Xiaomi",
    slug: "xiaomi",
    description: "Xiaomi smartphones and accessories",
    productCount: 22,
    parentId: "2",
    parentName: "Smartphones",
    level: 2,
    isActive: true,
    createdAt: "2024-01-09",
    fullPath: "Electronics > Smartphones > Xiaomi",
  },
  {
    id: "7",
    name: "Lenovo",
    slug: "lenovo",
    description: "Lenovo laptops and ThinkPads",
    productCount: 45,
    parentId: "6",
    parentName: "Laptops",
    level: 2,
    isActive: true,
    createdAt: "2024-01-12",
    fullPath: "Electronics > Laptops > Lenovo",
  },
  {
    id: "8",
    name: "Dell",
    slug: "dell",
    description: "Dell laptops and workstations",
    productCount: 38,
    parentId: "6",
    parentName: "Laptops",
    level: 2,
    isActive: true,
    createdAt: "2024-01-11",
    fullPath: "Electronics > Laptops > Dell",
  },
  {
    id: "9",
    name: "HP",
    slug: "hp",
    description: "HP laptops and notebooks",
    productCount: 42,
    parentId: "6",
    parentName: "Laptops",
    level: 2,
    isActive: true,
    createdAt: "2024-01-10",
    fullPath: "Electronics > Laptops > HP",
  },
  {
    id: "10",
    name: "Apple MacBook",
    slug: "apple-macbook",
    description: "MacBook Air and MacBook Pro",
    productCount: 31,
    parentId: "6",
    parentName: "Laptops",
    level: 2,
    isActive: true,
    createdAt: "2024-01-09",
    fullPath: "Electronics > Laptops > Apple MacBook",
  },
  {
    id: "45",
    name: "ASUS",
    slug: "asus",
    description: "ASUS laptops and gaming notebooks",
    productCount: 29,
    parentId: "6",
    parentName: "Laptops",
    level: 2,
    isActive: true,
    createdAt: "2024-01-08",
    fullPath: "Electronics > Laptops > ASUS",
  },
  {
    id: "46",
    name: "Acer",
    slug: "acer",
    description: "Acer laptops and Chromebooks",
    productCount: 18,
    parentId: "6",
    parentName: "Laptops",
    level: 2,
    isActive: true,
    createdAt: "2024-01-07",
    fullPath: "Electronics > Laptops > Acer",
  },
  {
    id: "17",
    name: "Nike",
    slug: "nike-mens",
    description: "Nike men's clothing",
    productCount: 45,
    parentId: "16",
    parentName: "Men's Clothing",
    level: 2,
    isActive: true,
    createdAt: "2024-01-10",
    fullPath: "Clothing > Men's Clothing > Nike",
  },
  {
    id: "18",
    name: "Adidas",
    slug: "adidas-mens",
    description: "Adidas men's clothing",
    productCount: 38,
    parentId: "16",
    parentName: "Men's Clothing",
    level: 2,
    isActive: true,
    createdAt: "2024-01-09",
    fullPath: "Clothing > Men's Clothing > Adidas",
  },
  {
    id: "47",
    name: "Under Armour",
    slug: "under-armour",
    description: "Under Armour athletic wear",
    productCount: 32,
    parentId: "16",
    parentName: "Men's Clothing",
    level: 2,
    isActive: true,
    createdAt: "2024-01-08",
    fullPath: "Clothing > Men's Clothing > Under Armour",
  },
  {
    id: "48",
    name: "Levi's",
    slug: "levis",
    description: "Levi's jeans and denim",
    productCount: 41,
    parentId: "16",
    parentName: "Men's Clothing",
    level: 2,
    isActive: true,
    createdAt: "2024-01-07",
    fullPath: "Clothing > Men's Clothing > Levi's",
  },
];

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
  categories: Category[];
  level: 0 | 1 | 2;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter categories by level and search term
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesLevel = category.level === level;
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        category.parentName?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesLevel && matchesSearch;
    });
  }, [categories, level, searchTerm]);

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

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0:
        return <Folder className="h-4 w-4 text-primary" />;
      case 1:
        return <FolderTree className="h-4 w-4 text-blue-600" />;
      case 2:
        return <Building2 className="h-4 w-4 text-green-600" />;
      default:
        return <Folder className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLevelLabel = (level: number) => {
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
                {level > 0 && (
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
                      {getLevelIcon(category.level)}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="truncate">{category.name}</span>
                          <Badge variant="outline" className="text-xs w-fit">
                            {getLevelLabel(category.level)}
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
                      {category.level > 0 && (
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {category.fullPath}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  {level > 0 && (
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(category.level - 1)}
                        <span className="text-sm truncate">
                          {category.parentName}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount}
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
                        {level < 2 && (
                          <DropdownMenuItem>
                            <Plus className="h-4 w-4 mr-2" />
                            Add {level === 0 ? "Subcategory" : "Brand"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>View Products</DropdownMenuItem>
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
  const mainCategories = mockCategories.filter((cat) => cat.level === 0);
  const subcategories = mockCategories.filter((cat) => cat.level === 1);
  const brands = mockCategories.filter((cat) => cat.level === 2);

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
                {mainCategories.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {mainCategories.reduce((sum, cat) => sum + cat.productCount, 0)}{" "}
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
                {subcategories.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {subcategories.reduce((sum, cat) => sum + cat.productCount, 0)}{" "}
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
                {brands.length}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {brands.reduce((sum, cat) => sum + cat.productCount, 0)} total
                products
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
                    Main ({mainCategories.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="sub"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <FolderTree className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Sub ({subcategories.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="brand"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    Brands ({brands.length})
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                <CategoryTable categories={mockCategories} level={0} />
              </TabsContent>

              <TabsContent value="sub" className="mt-6">
                <CategoryTable categories={mockCategories} level={1} />
              </TabsContent>

              <TabsContent value="brand" className="mt-6">
                <CategoryTable categories={mockCategories} level={2} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
