"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Edit, MoreHorizontal, Plus, Search, Building2 } from "lucide-react";
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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useBrands, useDeleteBrand } from "@/hooks/api/use-brands";
import DeleteConfirmBtn from "@/components/actions/DeleteConfirmBtn";

// interface Brand {
//   id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   logo?: string;
//   website?: string;
//   productCount: number;
//   isActive: boolean;
//   createdAt: string;
// }

// const mockBrands: Brand[] = [
//   {
//     id: "1",
//     name: "Apple",
//     slug: "apple",
//     description: "Technology company known for innovative products",
//     logo: "/placeholder.svg?height=40&width=40",
//     website: "https://apple.com",
//     productCount: 45,
//     isActive: true,
//     createdAt: "2024-01-15",
//   },
//   {
//     id: "2",
//     name: "Samsung",
//     slug: "samsung",
//     description: "Electronics and technology manufacturer",
//     logo: "/placeholder.svg?height=40&width=40",
//     website: "https://samsung.com",
//     productCount: 67,
//     isActive: true,
//     createdAt: "2024-01-10",
//   },
//   {
//     id: "3",
//     name: "Nike",
//     slug: "nike",
//     description: "Athletic footwear and apparel",
//     logo: "/placeholder.svg?height=40&width=40",
//     website: "https://nike.com",
//     productCount: 123,
//     isActive: true,
//     createdAt: "2024-01-08",
//   },
//   {
//     id: "4",
//     name: "Adidas",
//     slug: "adidas",
//     description: "Sports clothing and accessories",
//     logo: "/placeholder.svg?height=40&width=40",
//     website: "https://adidas.com",
//     productCount: 89,
//     isActive: true,
//     createdAt: "2024-01-05",
//   },
//   {
//     id: "5",
//     name: "Sony",
//     slug: "sony",
//     description: "Electronics and entertainment",
//     logo: "/placeholder.svg?height=40&width=40",
//     website: "https://sony.com",
//     productCount: 34,
//     isActive: false,
//     createdAt: "2024-01-03",
//   },
// ];

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // const [brands] = useState(mockBrands);
  const { data: brands, isLoading } = useBrands();
  const { mutate, isPending, isSuccess } = useDeleteBrand();

  const filteredBrands = brands?.data?.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>Loading ...</p>;
  if (!brands?.data) return <p>Data not found</p>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className=" space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
            <p className="text-muted-foreground">
              Manage your product brands and manufacturers
            </p>
          </div>
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/brand/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands?.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center">
                      {brand.image ? (
                        <Image
                          src={brand.image || "/placeholder.svg"}
                          alt={brand.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{brand.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {brand.description || "No description"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{brand._count.products}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={brand.isActive ? "default" : "secondary"}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(brand.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/brand/edit/${brand.id}`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/brand/products/${brand.id}`}>
                        <DropdownMenuItem>View Products</DropdownMenuItem>
                      </Link>
                      <DeleteConfirmBtn
                        title="Brand"
                        targetId={brand.id}
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
  );
}
