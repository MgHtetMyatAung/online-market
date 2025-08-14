/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Promotion types
const promotionTypes = [
  { value: "PERCENTAGE_DISCOUNT", label: "Percentage Discount" },
  { value: "FIXED_AMOUNT_DISCOUNT", label: "Fixed Amount Discount" },
  { value: "FREE_SHIPPING", label: "Free Shipping" },
];

// Form schema
const promotionSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  description: z.string().optional(),
  type: z.enum([
    "PERCENTAGE_DISCOUNT",
    "FIXED_AMOUNT_DISCOUNT",
    "FREE_SHIPPING",
  ]),
  value: z.number().min(0, "Value must be positive"),
  minOrderAmount: z.number().min(0).optional(),
  couponCode: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().default(true),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

// Mock data
const mockPromotions = [
  {
    id: 1,
    name: "Holiday Sale",
    description: "Special holiday discount for all customers",
    type: "PERCENTAGE_DISCOUNT",
    value: 20,
    minOrderAmount: 50,
    couponCode: "HOLIDAY20",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    isActive: true,
    productCount: 15,
  },
  {
    id: 2,
    name: "Free Shipping Weekend",
    description: "Free shipping on all orders",
    type: "FREE_SHIPPING",
    value: 0,
    minOrderAmount: 25,
    couponCode: "",
    startDate: "2024-11-15",
    endDate: "2024-11-17",
    isActive: false,
    productCount: 0,
  },
];

const mockProducts = [
  { id: 1, name: "Classic T-Shirt", price: 29.99, promotionId: 1 },
  { id: 2, name: "Denim Jeans", price: 79.99, promotionId: null },
  { id: 3, name: "Sneakers", price: 129.99, promotionId: 1 },
  { id: 4, name: "Hoodie", price: 59.99, promotionId: null },
];

export function PromotionsManagement() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(
    null
  );
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema) as Resolver<PromotionFormData>,
    defaultValues: {
      name: "",
      description: "",
      type: "PERCENTAGE_DISCOUNT",
      value: 0,
      minOrderAmount: 0,
      couponCode: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  const onSubmit = (data: PromotionFormData) => {
    const newPromotion = {
      id: Date.now(),
      ...data,
      productCount: 0,
    };
    setPromotions([
      ...promotions,
      {
        ...newPromotion,
        description: newPromotion.description || "",
        minOrderAmount: newPromotion.minOrderAmount || 0,
        couponCode: newPromotion.couponCode || "",
      },
    ]);
    setIsCreateDialogOpen(false);
    form.reset();
    console.log("Created promotion:", newPromotion);
  };

  const togglePromotionStatus = (id: number) => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );
  };

  const deletePromotion = (id: number) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
    // Remove promotion from products
    setProducts(
      products.map((product) =>
        product.promotionId === id ? { ...product, promotionId: null } : product
      )
    );
  };

  const toggleProductPromotion = (productId: number) => {
    if (!selectedPromotion) return;

    setProducts(
      products.map((product) =>
        product.id === productId
          ? {
              ...product,
              promotionId:
                product.promotionId === selectedPromotion
                  ? null
                  : selectedPromotion,
            }
          : product
      )
    );
  };

  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPromotionDisplay = (promotion: any) => {
    switch (promotion.type) {
      case "PERCENTAGE_DISCOUNT":
        return `${promotion.value}% off`;
      case "FIXED_AMOUNT_DISCOUNT":
        return `$${promotion.value} off`;
      case "FREE_SHIPPING":
        return "Free shipping";
      default:
        return promotion.value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Promotions</h2>
          <p className="text-gray-600">Manage your product promotions</p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center my-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotion Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Holiday Sale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotion Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {promotionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Special holiday discount for all customers"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="20"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minOrderAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Order Amount (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="couponCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="HOLIDAY20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Enable this promotion immediately after creation
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Promotion</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{promotion.name}</div>
                        {promotion.description && (
                          <div className="text-sm text-gray-500">
                            {promotion.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {
                          promotionTypes.find((t) => t.value === promotion.type)
                            ?.label
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getPromotionDisplay(promotion)}
                    </TableCell>
                    <TableCell>
                      {promotion.couponCode ? (
                        <Badge variant="secondary">
                          {promotion.couponCode}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Auto-applied</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(promotion.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          to {new Date(promotion.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPromotion(promotion.id);
                          setIsProductDialogOpen(true);
                        }}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        {promotion.productCount}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={promotion.isActive}
                        onCheckedChange={() =>
                          togglePromotionStatus(promotion.id)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePromotion(promotion.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Product Selection Dialog */}
        <Dialog
          open={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Manage Products for{" "}
                {promotions.find((p) => p.id === selectedPromotion)?.name}
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
                    {products.map((product) => (
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
                        <TableCell>${product.price}</TableCell>
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
    </div>
  );
}
