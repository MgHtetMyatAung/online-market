/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table/DataTable";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Package } from "lucide-react";
import Link from "next/link";
import { ROUTE_PATH } from "@/constants/router";
import Image from "next/image";
import { useGetProducts } from "@/features/product/api/queries";
import { typeOfProduct } from "@/features/product/type";
import { checkStock } from "@/lib/util/checkStock";
import { Product } from "@prisma/client";
import { useGetCategoryById } from "../api/queries";

export default function ProductListTableByCategory({
  categoryId,
}: {
  categoryId: string;
}) {
  const { data: products, isLoading } = useGetProducts({ categoryId });
  const { data: categoryDetail } = useGetCategoryById(categoryId);

  const columns = useMemo<ColumnDef<typeOfProduct>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info) => (
          <Image
            src={"/image/default.png"}
            alt="Product"
            width={100}
            height={100}
            className="h-10 w-10 object-cover rounded"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "name",
        header: "Product Name",
        cell: (info) => (
          <span className="font-medium text-blue-600">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-gray-700">
            {String(row.original.category.name)}
          </span>
        ),
      },
      {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => (
          <span className="text-gray-700">
            {String(row.original?.brand?.name || "")}
          </span>
        ),
      },
      {
        accessorKey: "basePrice",
        header: "Price",
        cell: (info) => `${Number(info.getValue()).toFixed(2)} MMK`,
        meta: {
          style: {
            textAlign: "right",
          },
        },
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: (info) => <>{checkStock(Number(info.getValue()), 10)}</>,
        meta: {
          style: {
            textAlign: "right",
          },
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="">
      <DataTable
        tableId="products"
        label="Products"
        data={products || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={(product: Product) => (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${ROUTE_PATH.PRODUCT.EDIT}${product.id}`}>
                    Edit product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        topRightComponent={<Button>Add Product</Button>}
        dataNotFoundComponent={
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {`${categoryDetail?.name} doesn't have any products yet.`}{" "}
              <span> Add First Product</span>
            </p>
            {/* <Button asChild>
              <Link href={ROUTE_PATH.PRODUCT.CREATE}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Product
              </Link>
            </Button> */}
          </div>
        }
      />
    </div>
  );
}
