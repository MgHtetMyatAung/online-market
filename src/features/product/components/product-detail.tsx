"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import Image from "next/image";

// Mock data based on the provided JSON
const productData = {
  id: "7d9e6a00-c9a4-4cf1-a538-291853740781",
  name: "Samsung A13",
  slug: "samsung-a13",
  description:
    "Experience the latest in mobile technology with the Samsung 13 Life. Featuring cutting-edge performance, stunning display, and advanced camera capabilities.",
  howToUse:
    "Simply power on your device and follow the setup wizard. The intuitive interface makes it easy to customize your experience and access all features.",
  youtubeVideo: "",
  specification:
    "Display: 6.7-inch Dynamic AMOLED\nProcessor: Snapdragon 8 Gen 2\nCamera: 108MP Triple Camera System\nBattery: 5000mAh with fast charging\nOS: Android 14 with One UI 6.0",
  basePrice: "4000000",
  stock: 20,
  imageUrls: [],
  isFeatured: true,
  isActive: true,
  category: {
    name: "Mobile",
    slug: "mobile",
  },
  brand: {
    name: "Samsung",
    slug: "samsung",
  },
  promotion: {
    name: "Summer Promotion",
    description: "Limited time offer",
    type: "FIXED_AMOUNT_DISCOUNT",
    value: "10000",
    startDate: "2025-08-12T00:00:00.000Z",
    endDate: "2025-08-19T00:00:00.000Z",
    isActive: true,
  },
  variants: [
    {
      id: "dc323464-e010-46be-bdd7-1acd1abc0d05",
      sku: "samsung-13-life-8gb-256gb-black",
      price: 4200000,
      stock: 40,
      attributes: [
        { value: "Black", attributeName: "Color" },
        { value: "256GB", attributeName: "Storage" },
        { value: "8GB", attributeName: "RAM" },
      ],
    },
    {
      id: "9158fb91-a21d-4321-b986-7f1590ea5aa1",
      sku: "samsung-13-life-8gb-512gb-blue",
      price: 4600000,
      stock: 30,
      attributes: [
        { value: "Blue", attributeName: "Color" },
        { value: "512GB", attributeName: "Storage" },
        { value: "8GB", attributeName: "RAM" },
      ],
    },
  ],
};

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  console.log(productId);
  const [selectedVariant, setSelectedVariant] = useState(
    productData.variants[0],
  );
  const [selectedAttributes, setSelectedAttributes] = useState({
    Color: "Black",
    Storage: "256GB",
    RAM: "8GB",
  });

  // Get unique attribute values
  const attributeOptions = {
    Color: [
      ...new Set(
        productData.variants.flatMap((v) =>
          v.attributes
            .filter((a) => a.attributeName === "Color")
            .map((a) => a.value),
        ),
      ),
    ],
    Storage: [
      ...new Set(
        productData.variants.flatMap((v) =>
          v.attributes
            .filter((a) => a.attributeName === "Storage")
            .map((a) => a.value),
        ),
      ),
    ],
    RAM: [
      ...new Set(
        productData.variants.flatMap((v) =>
          v.attributes
            .filter((a) => a.attributeName === "RAM")
            .map((a) => a.value),
        ),
      ),
    ],
  };

  // Update selected variant when attributes change
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variant
    const matchingVariant = productData.variants.find((variant) =>
      variant.attributes.every(
        (attr) =>
          newAttributes[attr.attributeName as keyof typeof newAttributes] ===
          attr.value,
      ),
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discountedPrice =
    selectedVariant.price - Number.parseInt(productData.promotion.value);
  const discountPercentage = Math.round(
    (Number.parseInt(productData.promotion.value) / selectedVariant.price) *
      100,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4 xl:col-span-5">
            <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
              <Image
                src="/image/show-case/samsung.png"
                alt={productData.name}
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white rounded border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-500"
                >
                  <Image
                    src={`/image/show-case/samsung-g${i}.png`}
                    alt={`${productData.name} view ${i}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 xl:col-span-7">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{productData.brand.name}</span>
                <span>•</span>
                <span>{productData.category.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  (4.8) • 1,234 reviews
                </span>
              </div>
              {productData.isFeatured && (
                <Badge variant="secondary" className="mb-4">
                  Featured Product
                </Badge>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(selectedVariant.price)}
                </span>
                <Badge variant="destructive" className="text-sm">
                  {discountPercentage}% OFF
                </Badge>
              </div>
              <p className="text-sm text-green-600 font-medium">
                🎉 {productData.promotion.name} - Save{" "}
                {formatPrice(Number.parseInt(productData.promotion.value))}
              </p>
            </div>

            {/* Variant Selection */}
            <div className="space-y-4">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Color:{" "}
                  <span className="font-normal">
                    {selectedAttributes.Color}
                  </span>
                </h3>
                <div className="flex gap-2">
                  {attributeOptions.Color.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleAttributeChange("Color", color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedAttributes.Color === color
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Storage:{" "}
                  <span className="font-normal">
                    {selectedAttributes.Storage}
                  </span>
                </h3>
                <div className="flex gap-2">
                  {attributeOptions.Storage.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => handleAttributeChange("Storage", storage)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedAttributes.Storage === storage
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {/* RAM Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  RAM:{" "}
                  <span className="font-normal">{selectedAttributes.RAM}</span>
                </h3>
                <div className="flex gap-2">
                  {attributeOptions.RAM.map((ram) => (
                    <button
                      key={ram}
                      onClick={() => handleAttributeChange("RAM", ram)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedAttributes.RAM === ram
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-gray-600">2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-xs text-gray-600">30 Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {productData.description ||
                      "Experience the latest in mobile technology with the Samsung 13 Life. This premium smartphone combines cutting-edge performance with elegant design, delivering an exceptional user experience for both work and entertainment."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="space-y-4">
                  {productData.specification ? (
                    productData.specification.split("\n").map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-900">
                          {spec.split(":")[0]}
                        </span>
                        <span className="text-gray-600">
                          {spec.split(":")[1]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Display
                        </span>
                        <span className="text-gray-600">
                          6.7-inch Dynamic AMOLED
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Processor
                        </span>
                        <span className="text-gray-600">
                          Snapdragon 8 Gen 2
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Camera
                        </span>
                        <span className="text-gray-600">
                          108MP Triple Camera System
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Battery
                        </span>
                        <span className="text-gray-600">
                          5000mAh with fast charging
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-900">
                          Operating System
                        </span>
                        <span className="text-gray-600">
                          Android 14 with One UI 6.0
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="how-to-use" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {productData.howToUse ||
                      "Getting started with your Samsung 13 Life is simple. Power on your device and follow the intuitive setup wizard. The user-friendly interface makes it easy to customize your experience, set up your accounts, and access all the advanced features this smartphone has to offer."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
