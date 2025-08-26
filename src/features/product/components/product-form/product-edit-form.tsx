"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PublishingTab } from "./product-publish-tab";
import { productSchema } from "@/lib/validations/product";
import SubmitBtn from "@/components/actions/SubmitBtn";
import { useUpdateProduct } from "../../api/mutations";
import {
  useGetAttributes,
  useGetVariants,
} from "@/features/attribute/api/queries";
import { useProductIndexStore } from "../hook/use-product-index";
import { useGetProductById } from "../../api/queries";
import { BasicDetailsTabEdit } from "./product-basic-tab-edit";
import { EditPromotionsTab } from "./edit-product-promotion-tab";
import { useGetCategories } from "@/features/category/api/queries";
import { useGetBrands } from "@/features/brand/api/queries";
import { useGetPromotions } from "@/features/promotion/api/queries";
import { EditVariantsTab } from "./edit-product-variant-tab";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof productSchema>;

export function ProductEditForm({ productId }: { productId: string }) {
  const navigate = useRouter();
  const { data: productDetail, isLoading: productLoading } =
    useGetProductById(productId);
  console.log(productDetail, "product-detail");
  const isFormInitialized = useRef(false);
  const { mutate, isPending, isSuccess } = useUpdateProduct();
  const { data: attributes, isLoading: attributeLoading } = useGetAttributes();
  const { data: variants, isLoading: variantLoading } = useGetVariants();
  const { data: categories, isLoading: categoryLoading } = useGetCategories();
  const { data: brands, isLoading: brandLoading } = useGetBrands();
  const { data: promotions, isLoading: promotionLoading } = useGetPromotions();
  const isLoading =
    productLoading ||
    attributeLoading ||
    variantLoading ||
    categoryLoading ||
    brandLoading ||
    promotionLoading;
  const form = useForm<FormData>({
    resolver: zodResolver(productSchema) as Resolver<FormData>,
    defaultValues: {
      name: productDetail?.name || "",
      slug: productDetail?.slug || "",
      basePrice: productDetail?.basePrice ? Number(productDetail.basePrice) : 0,
      categoryId: productDetail?.categoryId || "",
      brandId: productDetail?.brandId || "",
      description: productDetail?.description || "",
      howToUse: productDetail?.howToUse || "",
      youtubeVideo: productDetail?.youtubeVideo || "",
      specification: productDetail?.specification || "",
      promotionId: productDetail?.promotionId || "",
      isActive: productDetail?.isActive || true,
      isFeatured: productDetail?.isFeatured || false,
      imageUrls: [],
      variants: [],
      selectedAttributes: [],
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
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
      console.log(attribute, "attribute");
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

  console.log(selectedIndex, "selectedIndex");

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
    // if (selectedVariantIds?.includes(variantId)) {
    //   setSelectedVariantIds(
    //     selectedVariantIds.filter((id) => id !== variantId)
    //   );
    // } else {
    //   setSelectedVariantIds([...selectedVariantIds, variantId]);
    // }
    if (selectedIndex?.includes(sku)) {
      setSelectedIndex(selectedIndex.filter((id) => id !== sku));
    } else {
      setSelectedIndex([...selectedIndex, sku]);
    }
    // setSelectedIndex((prev) =>
    //   prev.includes(indx) ? prev.filter((id) => id !== indx) : [...prev, indx],
    // );
  };

  const handleSelectAllVariants = (skus: string[]) => {
    setSelectedIndex(skus);
  };

  const onSubmit = async (data: FormData) => {
    if (!isDirty) {
      return;
    }
    // Filter the variants based on the selectedVariantIds state
    const selectedVariants = selectedIndex?.map((id) =>
      data?.variants?.find((item) => item.sku === id),
    );

    const filteredData = {
      ...data,
      variants: selectedVariants || data.variants,
    };
    await mutate({
      id: productId,
      data: {
        ...filteredData,
        variants:
          filteredData.variants?.map((variant) => ({
            stock: variant?.stock || 0,
            sku: variant?.sku || "",
            price: variant?.price || 0,
            attributes: variant?.attributes || [],
            id: variant?.id,
          })) || [],
      },
    });
  };

  // const getAttributes = () => {
  //   const attributes = productDetail?.variants?.map((variant) =>
  //     variant?.attributes?.map((attr) => attr.attributeId)
  //   );
  //   setValue(
  //     "selectedAttributes",
  //     attributes?.flat().filter((id) => id !== null) || []
  //   );
  // };

  // const getVariants = () => {
  //   if (productDetail?.variants && productDetail?.variants?.length > 0) {
  //     setHasVariants(true);
  //     const variants = productDetail.variants.map((variant) => variant.sku);
  //     setSelectedIndex(variants);
  //   }
  // };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setSelectedIndex([]);
      setHasVariants(false);
      setImageUrls([]);
      setSelectedIndex([]);
      isFormInitialized.current = false;
      navigate.back();
    }
    return () => {
      // setSelectedIndex([]);
    };
  }, [isSuccess, form]);

  useEffect(() => {
    if (productDetail && !isFormInitialized.current) {
      setValue("name", productDetail.name);
      setValue("slug", productDetail.slug);
      setValue("basePrice", Number(productDetail.basePrice));
      setValue("stock", Number(productDetail.stock));
      setValue("categoryId", productDetail.categoryId);
      setValue("brandId", productDetail?.brandId || "");
      setValue("description", productDetail.description || "");
      setValue("howToUse", productDetail.howToUse || "");
      setValue("youtubeVideo", productDetail.youtubeVideo || "");
      setValue("specification", productDetail.specification || "");
      setValue("promotionId", productDetail.promotionId || "");
      setValue("isActive", productDetail.isActive || true);
      setValue("isFeatured", productDetail.isFeatured || false);
      setValue("variants", productDetail.variants || []);

      if (productDetail.variants) {
        const attributesFromVariants = productDetail?.variants
          .flatMap((variant) => variant.attributes)
          .map((attr) => attr.attributeId)
          .filter(Boolean); // Filters out any undefined or null values

        // Use a Set to get unique attribute IDs before setting the value
        const uniqueAttributes = [...new Set(attributesFromVariants)];
        setValue("selectedAttributes", uniqueAttributes);
      }

      if (productDetail.variants && productDetail.variants.length > 0) {
        setHasVariants(true);
        const variants = productDetail.variants.map((variant) => variant.sku);
        setSelectedIndex(variants);
      }

      isFormInitialized.current = true;
    }
  }, [productDetail, setValue, setHasVariants, setSelectedIndex]);

  if (isLoading) return <p>Loading ...</p>;
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
          <BasicDetailsTabEdit
            form={form}
            imageUrls={imageUrls}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            brands={brands || []}
            categories={categories || []}
          />
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <EditVariantsTab
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
          <EditPromotionsTab form={form} promotions={promotions || []} />
        </TabsContent>

        <TabsContent value="publishing" className="space-y-6">
          <PublishingTab form={form} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <SubmitBtn title="Update" isPending={isPending} />
      </div>
    </form>
  );
}
