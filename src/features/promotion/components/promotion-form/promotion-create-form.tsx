"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { promotionSchema } from "@/lib/validations/promotion";
import { useCreatePromotion } from "../../api/mutations";
import SubmitBtn from "@/components/actions/SubmitBtn";

type PromotionFormData = z.infer<typeof promotionSchema>;

const promotionTypes = [
  { value: "PERCENTAGE_DISCOUNT", label: "Percentage Discount" },
  { value: "FIXED_AMOUNT_DISCOUNT", label: "Fixed Amount Discount" },
  { value: "FREE_SHIPPING", label: "Free Shipping" },
];

export default function PromotionCreateForm() {
  const { mutate, isSuccess, isPending } = useCreatePromotion();
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema) as Resolver<PromotionFormData>,
    defaultValues: {
      name: "",
      description: "",
      type: "PERCENTAGE_DISCOUNT",
      value: 0,
      minOrderAmount: 0,
      maxQuantity: 0,
      minQuantity: 0,
      imageUrl: "",
      couponCode: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: PromotionFormData) => {
    await mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        field.onChange(Number.parseFloat(e.target.value))
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
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Quantity (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Quantity (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
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
                  <FormLabel className="text-base">Active Status</FormLabel>
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
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <SubmitBtn isPending={isPending} title="Create Promotion" />
          </div>
        </form>
      </Form>
    </div>
  );
}
