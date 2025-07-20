/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table/DataTable";
import Image from "next/image";
import { Brand } from "@prisma/client";
import { useGetBrands } from "../api/queries";
import { typeOfBrand } from "../type";
import { sliceString } from "@/lib/util/sliceString";
import LinkButton from "@/components/actions/LinkButton";
import { ROUTE_PATH } from "@/constants/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import DeleteConfirmBtn from "@/components/actions/DeleteConfirmBtn";
import { useDeleteBrand } from "../api/mutations";

function BrandListTable() {
  const { data: brands, isLoading } = useGetBrands();
  const { mutate, isPending, isSuccess } = useDeleteBrand();

  const columns = useMemo<ColumnDef<typeOfBrand>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Logo",
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
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-blue-600">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => (
          <span className="text-gray-700">
            {sliceString(String(info.getValue()), 20)}
          </span>
        ),
      },
      {
        accessorKey: "product",
        header: "Products",
        cell: ({ row }) => `${Number(row.original._count.products)}`,
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
    []
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <DataTable
        tableId="brand"
        label="Brands"
        data={brands || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={(brand: Brand) => (
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
                <DropdownMenuItem asChild>
                  <Link href={`${ROUTE_PATH.BRAND.VIEW}${brand.id}`}>
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${ROUTE_PATH.BRAND.EDIT}${brand.id}`}>
                    Edit brand
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <DeleteConfirmBtn
                    title="Brand"
                    targetId={brand.id}
                    onDelete={mutate}
                    isPending={isPending}
                    isSuccess={isSuccess}
                  >
                    Delete brand
                  </DeleteConfirmBtn>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        topRightComponent={
          <LinkButton href={ROUTE_PATH.BRAND.CREATE}>Add Brand</LinkButton>
        }
      />
    </div>
  );
}

export default BrandListTable;
