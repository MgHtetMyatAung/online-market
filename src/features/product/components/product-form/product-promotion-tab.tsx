import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod"; // Assuming schema is in lib/schemas
import { productSchema } from "@/lib/validations/product";
import { Badge } from "@/components/ui/badge";
import { promotionTypes } from "@/constants/data/promotion";
import { Promotion } from "@prisma/client";

type FormData = z.infer<typeof productSchema>;

interface PromotionsTabProps {
  form: UseFormReturn<FormData>;
  promotions: Promotion[];
}

export const PromotionsTab: React.FC<PromotionsTabProps> = ({
  form,
  promotions,
}) => {
  const { control } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotions</CardTitle>
        <CardDescription>
          Link this product to active promotions and discounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="promotion">Select Promotion</Label>
          <Controller
            control={control}
            name="promotionId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select promotion (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {promotions?.map((promotion) => (
                    <SelectItem key={promotion.id} value={promotion.id}>
                      <div className="flex items-center justify-between w-full space-x-3">
                        <span className="font-medium text-blue-600">
                          {promotion.name}
                        </span>
                        <Badge variant="secondary" className=" text-green-500">
                          {
                            promotionTypes.find(
                              (t) => t.value === promotion.type,
                            )?.label
                          }
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
