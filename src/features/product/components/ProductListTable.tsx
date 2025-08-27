/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ROUTE_PATH } from "@/constants/router";
import { useGetProducts } from "../api/queries";
import { Product } from "@prisma/client";
import { typeOfProduct } from "../type";
import { checkStock } from "./checkStock";
import LinkButton from "@/components/actions/LinkButton";
import DeleteConfirmBtn from "@/components/actions/DeleteConfirmBtn";
import { useDeleteProduct } from "../api/mutations";

function ProductListTable() {
  const { data: products, isLoading } = useGetProducts();
  const { mutate, isPending, isSuccess } = useDeleteProduct();

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
        accessorKey: "totalStock",
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
      <h2 className="text-2xl font-bold mb-4">Products</h2>
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
          <div className="flex gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`${ROUTE_PATH.PRODUCT.LIST}/${product.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${ROUTE_PATH.PRODUCT.LIST}/${product.id}/edit`}>
                    Edit Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`${ROUTE_PATH.PRODUCT.CREATE}?duplicateId=${product.id}`}
                  >
                    Duplicate Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteConfirmBtn
                    title="Product"
                    targetId={product.id}
                    onDelete={mutate}
                    isPending={isPending}
                    isSuccess={isSuccess}
                  >
                    Delete Product
                  </DeleteConfirmBtn>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        topRightComponent={
          <LinkButton href={ROUTE_PATH.PRODUCT.CREATE}>Add Product</LinkButton>
        }
      />
    </div>
  );
}

export default ProductListTable;
