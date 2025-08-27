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
import { useProductIndexStore } from "../hook/use-product-index";
import { useSearchParams } from "next/navigation";
import { useGetProductById } from "../../api/queries";
import { useGetCategories } from "@/features/category/api/queries";
import { useGetBrands } from "@/features/brand/api/queries";
import { useGetPromotions } from "@/features/promotion/api/queries";

type FormData = z.infer<typeof productSchema>;

export function ProductCreationForm() {
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicateId");

  // Fetch data for the product to be duplicated
  const { data: sourceProduct, isLoading: sourceProductLoading } =
    useGetProductById(duplicateId, {
      staleTime: Infinity, // Use cache to avoid re-fetching
    });

  const { mutate, isPending, isSuccess } = useCreateProduct();
  const { data: attributes, isLoading: attributeLoading } = useGetAttributes();
  const { data: variants, isLoading: variantLoading } = useGetVariants();
  const { data: categories, isLoading: categoryLoading } = useGetCategories();
  const { data: brands, isLoading: brandLoading } = useGetBrands();
  const { data: promotions, isLoading: promotionLoading } = useGetPromotions();

  const isLoading =
    attributeLoading ||
    variantLoading ||
    categoryLoading ||
    brandLoading ||
    promotionLoading;

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
    formState: {},
  } = form;

  const nameValue = watch("name");
  const slugValue = watch("slug");
  const basePriceValue = watch("basePrice");
  const selectedAttributes = watch("selectedAttributes") || [];

  const [hasVariants, setHasVariants] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { selectedIndex, setSelectedIndex } = useProductIndexStore();

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

    if (selectedIndex?.length > 0) {
      setSelectedIndex([]);
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

  const handleVariantCheckboxChange = (sku: string) => {
    if (selectedIndex?.includes(sku)) {
      setSelectedIndex(selectedIndex.filter((item) => item !== sku));
    } else {
      setSelectedIndex([...selectedIndex, sku]);
    }
  };

  const handleSelectAllVariants = (skus: string[]) => {
    setSelectedIndex(skus);
  };

  const onSubmit = async (data: FormData) => {
    // Filter the variants based on the selectedVariantIds state
    const selectedVariants = selectedIndex?.map((id) =>
      data?.variants?.find((item) => item.sku === id),
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

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setSelectedIndex([]);
    }
    return () => {
      setSelectedIndex([]);
    };
  }, [isSuccess, form]);

  useEffect(() => {
    if (sourceProduct) {
      setValue("name", `${sourceProduct.name} Copy`);
      setValue("slug", `${sourceProduct.slug}-copy`);
      setValue("basePrice", Number(sourceProduct.basePrice));
      setValue("stock", Number(sourceProduct.stock));
      setValue("categoryId", sourceProduct.categoryId);
      setValue("brandId", sourceProduct?.brandId || "");
      setValue("description", sourceProduct.description || "");
      setValue("howToUse", sourceProduct.howToUse || "");
      setValue("youtubeVideo", sourceProduct.youtubeVideo || "");
      setValue("specification", sourceProduct.specification || "");
      // setValue("promotionId", sourceProduct.promotionId || "");
      setValue("isActive", sourceProduct.isActive || true);
      setValue("isFeatured", sourceProduct.isFeatured || false);
    }
  }, [sourceProduct]);

  if (sourceProductLoading || isLoading) {
    return <div>Loading...</div>;
  }

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
            brands={brands || []}
            categories={categories || []}
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
            selectedIndex={selectedIndex}
            handleVariantCheckboxChange={handleVariantCheckboxChange}
            handleSelectAllVariants={handleSelectAllVariants}
          />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <PromotionsTab form={form} promotions={promotions || []} />
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
