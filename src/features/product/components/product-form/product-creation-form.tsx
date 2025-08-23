"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BasicDetailsTab } from "./product-basic-tab";
import { VariantsTab } from "./product-variant-tab";
import { PromotionsTab } from "./product-promotion-tab";
import { PublishingTab } from "./product-publish-tab";
import { productSchema } from "@/lib/validations/product";
import SubmitBtn from "@/components/actions/SubmitBtn";
import { useCreateProduct } from "../../api/mutations";
import {
  useGetAttributes,
  useGetVariants,
} from "@/features/attribute/api/queries";

type FormData = z.infer<typeof productSchema>;

export function ProductCreationForm() {
  const { mutate, isPending, isSuccess } = useCreateProduct();
  const { data: attributes } = useGetAttributes();
  const { data: variants } = useGetVariants();
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
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);

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

    const attributeData = selectedAttributes.map((id) => {
      const attribute = attributes?.find((attr) => attr.id === id);
      if (!attribute) {
        throw new Error(`Attribute with id ${id} not found`);
      }
      return attribute;
    });

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
        current[attribute.name] = value.value;
        generateCombinations(index + 1, current);
      }
    };
    generateCombinations(0, {});

    const newVariants = combinations.map((combo, index) => ({
      id: `variant-${index}-${Date.now()}`, // Ensure unique ID
      sku: `${slugValue || "product"}-${Object.values(combo)
        .join("-")
        .toLowerCase()}`,
      price: Number(basePriceValue) || 0,
      stock: 0,
      attributes: combo,
    }));

    // Reset selected variant IDs when new variants are generated
    // setSelectedVariantIds(newVariants.map((v) => v.id));

    setValue(
      "variants",
      newVariants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributes: Object.entries(variant.attributes).map(([name, value]) => ({
          value,
          attributeId: attributes?.find((attr) => attr.name === name)?.id || "",
          attributeValueId:
            variants?.find((item) => item.value === value)?.id || "",
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

  const handleVariantCheckboxChange = (variantId: string, indx: number) => {
    setSelectedVariantIds((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId],
    );
    setSelectedIndex((prev) =>
      prev.includes(indx) ? prev.filter((id) => id !== indx) : [...prev, indx],
    );
  };

  const handleSelectAllVariants = (data: string[], num: number[]) => {
    setSelectedVariantIds(data);
    setSelectedIndex(num);
  };

  const onSubmit = async (data: FormData) => {
    // Filter the variants based on the selectedVariantIds state
    const selectedVariants = selectedIndex?.map((id) =>
      data?.variants?.find((_, idx) => idx === id),
    );

    const filteredData = {
      ...data,
      variants: selectedVariants || data.variants,
    };
    await mutate({
      ...filteredData,
      variants:
        filteredData.variants?.map((variant) => ({
          stock: variant?.stock || 0,
          sku: variant?.sku || "",
          price: variant?.price || 0,
          attributes: variant?.attributes || [],
          id: variant?.id,
        })) || [],
    });
  };

  console.log(errors, "errors");

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setSelectedVariantIds([]); // Reset selected IDs on success
      setSelectedIndex([]);
    }
  }, [isSuccess, form]);

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
            mockAttributes={attributes || []}
            selectedVariantIds={selectedVariantIds}
            handleVariantCheckboxChange={handleVariantCheckboxChange}
            handleSelectAllVariants={handleSelectAllVariants}
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
