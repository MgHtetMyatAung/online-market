import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, X } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "@/lib/validations/product";
import Image from "next/image";
import { Brand, Category } from "@prisma/client";
// Assuming schema is in lib/schemas

type FormData = z.infer<typeof productSchema>;

interface BasicDetailsTabProps {
  form: UseFormReturn<FormData>;
  imageUrls: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  brands: Brand[];
  categories: Category[];
}

export const BasicDetailsTabEdit: React.FC<BasicDetailsTabProps> = ({
  form,
  imageUrls,
  handleImageUpload,
  removeImage,
  brands,
  categories,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const categoryId = watch("categoryId");
  const brandId = watch("brandId");

  useEffect(() => {
    if (categoryId) {
      form.setValue("categoryId", categoryId);
    }
    if (brandId) {
      form.setValue("brandId", brandId);
    }
  }, [form, categoryId, brandId]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Basic Product Information</CardTitle>
        <CardDescription>
          Enter the core details about your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Product Slug</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="product-slug"
              readOnly
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price *</Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              {...register("basePrice", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.basePrice && (
              <p className="text-sm text-red-500">{errors.basePrice.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseStock">Base Stock *</Label>
            <Input
              id="baseStock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={categoryId}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Controller
              control={control}
              name="brandId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={brandId}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="images">Product Images</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  Click to upload images
                </Label>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Detailed product description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="howToUse">How to Use</Label>
            <Textarea
              id="howToUse"
              {...register("howToUse")}
              placeholder="Instructions on how to use the product"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeVideo">YouTube Video URL</Label>
            <Input
              id="youtubeVideo"
              {...register("youtubeVideo")}
              placeholder="https://youtube.com/watch?v=..."
            />
            {errors.youtubeVideo && (
              <p className="text-sm text-red-500">
                {errors.youtubeVideo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specification">Specifications</Label>
            <Textarea
              id="specification"
              {...register("specification")}
              placeholder="Technical specifications and details"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
