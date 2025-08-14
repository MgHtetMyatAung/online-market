"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Upload } from "lucide-react";

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface Attribute {
  id: string;
  name: string;
  values: string[];
}

// Mock data - in real app, these would come from your database
const mockCategories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Home & Garden" },
  { id: "4", name: "Sports & Outdoors" },
];

const mockBrands = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Samsung" },
  { id: "3", name: "Nike" },
  { id: "4", name: "Adidas" },
];

const mockPromotions = [
  { id: "1", name: "Summer Sale - 20% Off", active: true },
  { id: "2", name: "Black Friday - 50% Off", active: false },
  { id: "3", name: "New Customer - 10% Off", active: true },
];

const mockAttributes: Attribute[] = [
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
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    basePrice: "",
    categoryId: "",
    brandId: "",
    description: "",
    howToUse: "",
    youtubeVideo: "",
    specification: "",
    promotionId: "",
    isActive: true,
    isFeatured: false,
  });

  const [hasVariants, setHasVariants] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleAttributeToggle = (attributeId: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attributeId)
        ? prev.filter((id) => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const generateVariants = () => {
    if (selectedAttributes.length === 0) return;

    const attributeData = selectedAttributes.map(
      (id) => mockAttributes.find((attr) => attr.id === id)!
    );

    const combinations: Record<string, string>[] = [];

    const generateCombinations = (
      index: number,
      current: Record<string, string>
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

    const newVariants: ProductVariant[] = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      sku: `${formData.slug || "product"}-${Object.values(combo)
        .join("-")
        .toLowerCase()}`,
      price: Number.parseFloat(formData.basePrice) || 0,
      stock: 0,
      attributes: combo,
    }));

    setVariants(newVariants);
  };

  const updateVariant = (
    variantId: string,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload these to your storage service
      const newUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const productData = {
      ...formData,
      basePrice: Number.parseFloat(formData.basePrice),
      imageUrls,
      variants: hasVariants ? variants : [],
      attributes: selectedAttributes,
    };

    console.log("Product data:", productData);
    // Here you would submit to your API
    alert("Product created successfully! (Check console for data)");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-3">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
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
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Product Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="product-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        basePrice: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select
                    value={formData.brandId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, brandId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
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
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Detailed product description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howToUse">How to Use</Label>
                  <Textarea
                    id="howToUse"
                    value={formData.howToUse}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        howToUse: e.target.value,
                      }))
                    }
                    placeholder="Instructions on how to use the product"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeVideo">YouTube Video URL</Label>
                  <Input
                    id="youtubeVideo"
                    value={formData.youtubeVideo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        youtubeVideo: e.target.value,
                      }))
                    }
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specification">Specifications</Label>
                  <Textarea
                    id="specification"
                    value={formData.specification}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        specification: e.target.value,
                      }))
                    }
                    placeholder="Technical specifications and details"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Configure different variations of your product (colors, sizes,
                etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-variants"
                  checked={hasVariants}
                  onCheckedChange={setHasVariants}
                />
                <Label htmlFor="has-variants">This product has variants</Label>
              </div>

              {hasVariants && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Select Attributes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mockAttributes.map((attribute) => (
                        <div key={attribute.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`attr-${attribute.id}`}
                              checked={selectedAttributes.includes(
                                attribute.id
                              )}
                              onChange={() =>
                                handleAttributeToggle(attribute.id)
                              }
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`attr-${attribute.id}`}>
                              {attribute.name}
                            </Label>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {attribute.values.map((value) => (
                              <Badge
                                key={value}
                                variant="outline"
                                className="text-xs"
                              >
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedAttributes.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          Variant Combinations
                        </h4>
                        <Button
                          type="button"
                          onClick={generateVariants}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Generate Variants
                        </Button>
                      </div>

                      {variants.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-muted p-3 grid grid-cols-12 gap-2 text-sm font-medium">
                            <div className="col-span-3">SKU</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Stock</div>
                            <div className="col-span-5">Attributes</div>
                          </div>
                          {variants.map((variant) => (
                            <div
                              key={variant.id}
                              className="p-3 border-t grid grid-cols-12 gap-2 items-center"
                            >
                              <div className="col-span-3">
                                <Input
                                  value={variant.sku}
                                  onChange={(e) =>
                                    updateVariant(
                                      variant.id,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={variant.price}
                                  onChange={(e) =>
                                    updateVariant(
                                      variant.id,
                                      "price",
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) =>
                                    updateVariant(
                                      variant.id,
                                      "stock",
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="text-sm"
                                />
                              </div>
                              <div className="col-span-5 flex flex-wrap gap-1">
                                {Object.entries(variant.attributes).map(
                                  ([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {key}: {value}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
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
                <Select
                  value={formData.promotionId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, promotionId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select promotion (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPromotions.map((promotion) => (
                      <SelectItem
                        key={promotion.id}
                        value={promotion.id}
                        disabled={!promotion.active}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{promotion.name}</span>
                          {promotion.active ? (
                            <Badge variant="default" className="ml-2">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-2">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publishing" className="space-y-6">
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
                <Switch
                  id="is-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
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
                <Switch
                  id="is-featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
