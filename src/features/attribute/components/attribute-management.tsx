/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";

import { useGetAttributes } from "../api/queries";
import DataTable from "@/components/table/DataTable";
import { Attribute } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { ROUTE_PATH } from "@/constants/router";
import DeleteConfirmBtn from "@/components/actions/DeleteConfirmBtn";
import AttributeCreateModal from "./attribute-create-modal";
import { useMemo } from "react";
import { typeOfAttribute } from "../type";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useDeleteAttribute } from "../api/mutations";
import { Badge } from "@/components/ui/badge";
import AttributeEditModal from "./Attribute-edit-modal";

export function AttributeManagement() {
  const { data: attributes, isLoading } = useGetAttributes();
  const { mutate, isPending, isSuccess } = useDeleteAttribute();
  const columns = useMemo<ColumnDef<typeOfAttribute>[]>(
    () => [
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
        accessorKey: "values",
        header: "Values",
        cell: ({ row }) => (
          <div className="text-gray-700 space-x-2">
            {row.original.values?.map((value) => (
              <Badge variant={"secondary"} key={value.value}>
                {value.value}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "count",
        header: "Count",
        cell: ({ row }) => `${Number(row.original._count.values)}`,
      },
    ],
    [],
  );

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Attributes</h2>
      <DataTable
        tableId="attribute"
        label="Attributes"
        data={attributes || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No attributes found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={(attribute: typeOfAttribute) => (
          <div className="flex gap-3 justify-end">
            <AttributeEditModal attribute={attribute} />
            <DeleteConfirmBtn
              title="Attribute"
              targetId={attribute.id}
              onDelete={mutate}
              isPending={isPending}
              isSuccess={isSuccess}
            >
              <Trash2 size={20} />
            </DeleteConfirmBtn>
          </div>
        )}
        topRightComponent={<AttributeCreateModal />}
      />
    </div>
  );
}
