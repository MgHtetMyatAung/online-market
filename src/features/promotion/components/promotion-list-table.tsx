"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product, Promotion } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Package, Search } from "lucide-react";
import Link from "next/link";
import { ROUTE_PATH } from "@/constants/router";
import { useGetPromotions } from "../api/queries";
import { Badge } from "@/components/ui/badge";
import { typeOfPromotion } from "../type";
import { Input } from "@/components/ui/input";
import { useGetProducts } from "@/features/product/api/queries";
import { Checkbox } from "@/components/ui/checkbox";
import LinkButton from "@/components/actions/LinkButton";
import { promotionTypes } from "@/constants/data/promotion";

export default function PromotionListTable() {
  const { data: promotions, isLoading, refetch } = useGetPromotions();
  const { data: products } = useGetProducts();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(
    null,
  );
  const [selectProducts, setProducts] = useState<Product[]>();
  const columns = useMemo<ColumnDef<typeOfPromotion>[]>(
    () => [
      //   {
      //     accessorKey: "imageUrl",
      //     header: "Image",
      //     cell: (info) => (
      //       <Image
      //         src={"/image/default.png"}
      //         alt="Product"
      //         width={100}
      //         height={100}
      //         className="h-10 w-10 object-cover rounded"
      //       />
      //     ),
      //     enableSorting: false,
      //     enableColumnFilter: false,
      //   },
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
        accessorKey: "type",
        header: "Discount Type",
        cell: (info) => (
          <Badge variant="outline">
            {
              promotionTypes.find((t) => t.value === info.row.original.type)
                ?.label
            }
          </Badge>
        ),
      },
      {
        accessorKey: "amount",
        header: "Discount",
        cell: ({ row }) => (
          <span className=" text-green-600 font-medium">
            {row.original.type === "PERCENTAGE_DISCOUNT" &&
              `${row.original.value} %`}
            {row.original.type === "FIXED_AMOUNT_DISCOUNT" &&
              `${row.original.value} MMK`}
            {row.original.type === "CASHBACK" && `${row.original.value} MMK`}
            {row.original.type === "FREE_SHIPPING" && "Free Shipping"}
            {row.original.type === "BUY_X_GET_Y" && `Gift`}
          </span>
        ),
      },
      {
        accessorKey: "couponCode",
        header: "Code",
        cell: (info) => (
          <>
            {info.getValue() ? (
              <Badge variant="secondary">{String(info.getValue())}</Badge>
            ) : (
              <span className="text-gray-400">Auto-applied</span>
            )}
          </>
        ),
      },
      {
        accessorKey: "period",
        header: "Period",
        cell: ({ row }) => (
          <div className="text-sm">
            <div>{new Date(row.original.startDate).toLocaleDateString()}</div>
            <div className="text-gray-500">
              to {new Date(row.original.endDate).toLocaleDateString()}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPromotion(row.original.id);
              setIsProductDialogOpen(true);
            }}
          >
            <Package className="w-4 h-4 mr-1" />
            {row.original._count.products}
          </Button>
        ),
      },
    ],
    [],
  );

  const toggleProductPromotion = (productId: string) => {
    if (!selectedPromotion) return;

    setProducts(
      selectProducts?.map((product) =>
        product.id === productId
          ? {
              ...product,
              promotionId:
                product.promotionId === selectedPromotion
                  ? null
                  : selectedPromotion,
            }
          : product,
      ),
    );
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Promotions</h2>
      <DataTable
        tableId="orders"
        label="Orders"
        data={promotions || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No promotions found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={(order: Promotion) => (
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
                  <Link href={`${ROUTE_PATH.ORDER.EDIT}${order.id}`}>
                    Edit promotion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Delete promotion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        topRightComponent={
          <LinkButton href={ROUTE_PATH.PROMOTION.CREATE}>
            Add Promotion
          </LinkButton>
        }
      />
      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Manage Products for{" "}
              {promotions?.find((p) => p.id === selectedPromotion)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={product.promotionId === selectedPromotion}
                          onCheckedChange={() =>
                            toggleProductPromotion(product.id)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>${Number(product.basePrice)}</TableCell>
                      <TableCell>
                        {product.promotionId === selectedPromotion ? (
                          <Badge>In Promotion</Badge>
                        ) : product.promotionId ? (
                          <Badge variant="outline">Other Promotion</Badge>
                        ) : (
                          <span className="text-gray-400">No Promotion</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsProductDialogOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
