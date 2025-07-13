/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table/DataTable";
import Image from "next/image";
import { Category } from "@prisma/client";
import { useGetCategories } from "../api/queries";
import { typeOfCategory } from "../type";
import { dateFormat } from "@/lib/util/dateFormat";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { ROUTE_PATH } from "@/constants/router";
import { useDeleteCategory } from "../api/mutations";

function CategoryListTable({ type }: { type: "main" | "sub" | "last" }) {
  const {
    data: categories,
    isLoading,
    isFetching,
  } = useGetCategories({ type });

  const { mutate } = useDeleteCategory();

  const handleDeleteCategory = async (id: string) => {
    await mutate(id);
  };

  console.log(isFetching, isLoading, "loading");

  const columns = useMemo<ColumnDef<typeOfCategory>[]>(
    () => {
      const baseColumns: ColumnDef<typeOfCategory>[] = [
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
          accessorKey: "product",
          header: "Products",
          cell: ({ row }) => `${Number(row.original._count.products)}`,
          meta: {
            style: {
              textAlign: "left",
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
        {
          accessorKey: "createdAt",
          header: "Created At",
          cell: (info) => <span>{dateFormat(String(info.getValue()))}</span>,
        },
      ];

      // Only add description column if type is not 'main'
      if (type !== "main") {
        baseColumns.splice(2, 0, {
          accessorKey: "parent",
          header: "Parent",
          cell: ({ row }) => (
            <span className="text-gray-700">
              {String(row.original.parent?.name)}
            </span>
          ),
        });
      }

      return baseColumns;
    },
    [type] // Add type as a dependency since we're using it in the useMemo
  );

  return (
    <div className="p-4">
      <DataTable
        tableId={`category-${type}`}
        label="Categories"
        data={categories!}
        columns={columns}
        isLoading={isLoading || isFetching}
        emptyMessage="No categories found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={(category: Category) => (
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
                  {type !== "last" && (
                    <Link
                      href={
                        type === "main"
                          ? `/dashboard/category/create?level=sub&cateId=${category.id}`
                          : `/dashboard/category/create?level=last&cateId=${category.id}`
                      }
                    >
                      {/* <Plus className="h-4 w-4 mr-2" /> */}
                      Add {type === "main" ? "Subcategory" : "Brand"}
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${ROUTE_PATH.CATEGORY.EDIT}${category.id}`}>
                    Edit category
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" asChild>
                  <button onClick={() => handleDeleteCategory(category.id)}>
                    Delete category
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        // topRightComponent={
        //   <LinkButton href={ROUTE_PATH.BRAND.CREATE}>Add Brand</LinkButton>
        // }
      />
    </div>
  );
}

export default CategoryListTable;
