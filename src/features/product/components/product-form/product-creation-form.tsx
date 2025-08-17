"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Assuming a new directory structure
import { BasicDetailsTab } from "./product-basic-tab";
import { VariantsTab } from "./product-variant-tab";
import { PromotionsTab } from "./product-promotion-tab";
import { PublishingTab } from "./product-publish-tab";
import { productSchema } from "@/lib/validations/product";
import SubmitBtn from "@/components/actions/SubmitBtn";
import { useCreateProduct } from "../../api/mutations";

type FormData = z.infer<typeof productSchema>;

const mockAttributes = [
  {
    id: "1",
    name: "Color",
    values: ["Red", "Blue", "Green", "Black", "White"],
  },
  { id: "2", name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
  {
    id: "3",
    name: "Material",
    values: ["Cotton", "Polyester", "Wool", "Silk"],
  },
];

export function ProductCreationForm() {
  const { mutate, isPending, isSuccess } = useCreateProduct();
  const form = useForm<FormData>({
    resolver: zodResolver(productSchema) as Resolver<FormData>,
    defaultValues: {
      name: "",
      slug: "product-name",
      basePrice: 0,
      categoryId: "",
      brandId: "",
      description: "",
      howToUse: "",
      youtubeVideo: "",
      specification: "",
      promotionId: "",
      isActive: true,
      isFeatured: false,
      imageUrls: [],
      variants: [],
      selectedAttributes: [],
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const nameValue = watch("name");
  const slugValue = watch("slug");
  const basePriceValue = watch("basePrice");
  const selectedAttributes = watch("selectedAttributes") || [];

  const [hasVariants, setHasVariants] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Automatically generate slug on name change
  useEffect(() => {
    if (nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [nameValue, setValue]);

  const handleAttributeToggle = (attributeId: string) => {
    const currentAttributes = selectedAttributes || [];
    const newAttributes = currentAttributes.includes(attributeId)
      ? currentAttributes.filter((id) => id !== attributeId)
      : [...currentAttributes, attributeId];
    setValue("selectedAttributes", newAttributes);
  };

  const generateVariants = () => {
    if (selectedAttributes.length === 0) {
      setValue("variants", []);
      return;
    }

    const attributeData = selectedAttributes.map(
      (id) => mockAttributes.find((attr) => attr.id === id)!,
    );

    const combinations: Record<string, string>[] = [];
    const generateCombinations = (
      index: number,
      current: Record<string, string>,
    ) => {
      if (index === attributeData.length) {
        combinations.push({ ...current });
        return;
      }
      const attribute = attributeData[index];
      for (const value of attribute.values) {
        current[attribute.name] = value;
        generateCombinations(index + 1, current);
      }
    };
    generateCombinations(0, {});

    const newVariants = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      sku: `${slugValue || "product"}-${Object.values(combo)
        .join("-")
        .toLowerCase()}`,
      price: Number(basePriceValue) || 0,
      stock: 0,
      attributes: combo,
    }));
    setValue(
      "variants",
      newVariants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributes: Object.entries(variant.attributes).map(([name, value]) => ({
          value,
          attributeId:
            mockAttributes.find((attr) => attr.name === name)?.id || "",
        })),
      })),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    await mutate(data);
  };

  console.log(errors, "errors");

  useEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <BasicDetailsTab
            form={form}
            imageUrls={imageUrls}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <VariantsTab
            form={form}
            hasVariants={hasVariants}
            setHasVariants={setHasVariants}
            generateVariants={generateVariants}
            handleAttributeToggle={handleAttributeToggle}
            mockAttributes={mockAttributes}
          />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <PromotionsTab form={form} />
        </TabsContent>

        <TabsContent value="publishing" className="space-y-6">
          <PublishingTab form={form} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <SubmitBtn title="Create" isPending={isPending} />
      </div>
    </form>
  );
}
