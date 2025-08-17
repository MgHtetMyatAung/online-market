import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod"; // Assuming schema is in lib/schemas
import { productSchema } from "@/lib/validations/product";

type FormData = z.infer<typeof productSchema>;

interface PublishingTabProps {
  form: UseFormReturn<FormData>;
}

export const PublishingTab: React.FC<PublishingTabProps> = ({ form }) => {
  const { control } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing & Status</CardTitle>
        <CardDescription>
          Control the visibility and status of your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="is-active">Active Product</Label>
            <p className="text-sm text-muted-foreground">
              Make this product visible and available for purchase
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field: { onChange, value } }) => (
              <Switch
                id="is-active"
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="is-featured">Featured Product</Label>
            <p className="text-sm text-muted-foreground">
              Highlight this product in featured sections
            </p>
          </div>
          <Controller
            control={control}
            name="isFeatured"
            render={({ field: { onChange, value } }) => (
              <Switch
                id="is-featured"
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
