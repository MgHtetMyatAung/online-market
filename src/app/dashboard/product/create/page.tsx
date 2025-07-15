/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Package,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductVariation {
  id: string;
  name: string;
  values: string[];
}

interface VariationCombination {
  id: string;
  attributes: { [key: string]: string };
  sku: string;
  price: number;
  stock: number;
  enabled: boolean;
}

interface ProductFormData {
  // General
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  status: string;
  outOfStock: boolean;
  images: ProductImage[];

  // Advanced
  sku: string;
  barcode: string;
  quantity: number;
  allowBackorders: boolean;
  variations: ProductVariation[];
  variationCombinations: VariationCombination[];
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Fitness",
  "Kitchen",
  "Books",
  "Toys & Games",
  "Beauty & Health",
];

const brands = [
  "TechCorp",
  "EcoWear",
  "HydroLife",
  "ProtectTech",
  "FitLife",
  "BrewMaster",
  "StyleCo",
  "GreenTech",
  "PowerMax",
  "ComfortZone",
];

const statuses = ["Active", "Draft", "Inactive"];

export default function ProductCreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showVariationDialog, setShowVariationDialog] = useState(false);
  const [newVariation, setNewVariation] = useState({ name: "", values: [""] });

  const [formData, setFormData] = useState<ProductFormData>({
    // General
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    status: "Draft",
    outOfStock: false,
    images: [],

    // Advanced
    sku: "",
    barcode: "",
    quantity: 0,
    allowBackorders: false,
    variations: [],
    variationCombinations: [],
  });

  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // General validation
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.brand) newErrors.brand = "Brand is required";

    // Advanced validation
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ProductImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: e.target?.result as string,
          alt: file.name,
          isPrimary: formData.images.length === 0, // First image is primary
        };
        updateFormData("images", [...formData.images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId: string) => {
    const updatedImages = formData.images.filter((img) => img.id !== imageId);
    // If we removed the primary image, make the first remaining image primary
    if (
      updatedImages.length > 0 &&
      !updatedImages.some((img) => img.isPrimary)
    ) {
      updatedImages[0].isPrimary = true;
    }
    updateFormData("images", updatedImages);
  };

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = formData.images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    updateFormData("images", updatedImages);
  };

  const addVariation = () => {
    if (!newVariation.name.trim() || newVariation.values.some((v) => !v.trim()))
      return;

    const variation: ProductVariation = {
      id: Date.now().toString(),
      name: newVariation.name,
      values: newVariation.values.filter((v) => v.trim()),
    };

    updateFormData("variations", [...formData.variations, variation]);
    generateVariationCombinations([...formData.variations, variation]);
    setNewVariation({ name: "", values: [""] });
    setShowVariationDialog(false);
  };

  const removeVariation = (variationId: string) => {
    const updatedVariations = formData.variations.filter(
      (v) => v.id !== variationId
    );
    updateFormData("variations", updatedVariations);
    generateVariationCombinations(updatedVariations);
  };

  const generateVariationCombinations = (variations: ProductVariation[]) => {
    if (variations.length === 0) {
      updateFormData("variationCombinations", []);
      return;
    }

    const combinations: VariationCombination[] = [];
    const generateCombos = (
      index: number,
      current: { [key: string]: string }
    ) => {
      if (index === variations.length) {
        const combo: VariationCombination = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          attributes: { ...current },
          sku:
            formData.sku + "-" + Object.values(current).join("-").toUpperCase(),
          price: formData.price,
          stock: 0,
          enabled: true,
        };
        combinations.push(combo);
        return;
      }

      const variation = variations[index];
      variation.values.forEach((value) => {
        generateCombos(index + 1, { ...current, [variation.name]: value });
      });
    };

    generateCombos(0, {});
    updateFormData("variationCombinations", combinations);
  };

  const updateVariationCombination = (
    comboId: string,
    field: string,
    value: any
  ) => {
    const updatedCombinations = formData.variationCombinations.map((combo) =>
      combo.id === comboId ? { ...combo, [field]: value } : combo
    );
    updateFormData("variationCombinations", updatedCombinations);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Switch to the tab with errors
      if (
        errors.name ||
        errors.description ||
        errors.price ||
        errors.category ||
        errors.brand
      ) {
        setActiveTab("general");
      } else {
        setActiveTab("advanced");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate SKU if not provided
      if (!formData.sku) {
        const generatedSku = `${formData.brand
          .substring(0, 3)
          .toUpperCase()}-${Date.now().toString().slice(-6)}`;
        updateFormData("sku", generatedSku);
      }

      console.log("Product created:", formData);
      router.push("/");
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges =
      formData.name ||
      formData.description ||
      formData.price > 0 ||
      formData.category ||
      formData.brand ||
      formData.images.length > 0;

    if (hasChanges) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmCancel) return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                <h1 className="text-lg font-semibold">Create New Product</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="general"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  General
                  {(errors.name ||
                    errors.description ||
                    errors.price ||
                    errors.category ||
                    errors.brand) && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Advanced
                  {(errors.sku || errors.quantity) && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Upload product images. The first image will be the primary
                      image.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Image Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload images or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </label>
                      </div>

                      {/* Image Preview */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.images.map((image) => (
                            <div key={image.id} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.alt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {image.isPrimary && (
                                <Badge className="absolute top-2 left-2 text-xs">
                                  Primary
                                </Badge>
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(image.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              {!image.isPrimary && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPrimaryImage(image.id)}
                                  className="absolute bottom-2 left-2 text-xs h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Set Primary
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic product details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="Enter product name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        placeholder="Enter product description"
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Price ($) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            updateFormData(
                              "price",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                          className={errors.price ? "border-red-500" : ""}
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500">{errors.price}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            updateFormData("category", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.category ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-red-500">
                            {errors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand">
                          Brand <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.brand}
                          onValueChange={(value) =>
                            updateFormData("brand", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.brand ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.brand && (
                          <p className="text-sm text-red-500">{errors.brand}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            updateFormData("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="out-of-stock"
                        checked={formData.outOfStock}
                        onCheckedChange={(checked) =>
                          updateFormData("outOfStock", checked)
                        }
                      />
                      <Label htmlFor="out-of-stock">Mark as out of stock</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                {/* Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>
                      Manage stock and inventory settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          SKU <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) =>
                            updateFormData("sku", e.target.value)
                          }
                          placeholder="Enter SKU"
                          className={errors.sku ? "border-red-500" : ""}
                        />
                        {errors.sku && (
                          <p className="text-sm text-red-500">{errors.sku}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                          id="barcode"
                          value={formData.barcode}
                          onChange={(e) =>
                            updateFormData("barcode", e.target.value)
                          }
                          placeholder="Enter barcode"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) =>
                          updateFormData(
                            "quantity",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        className={errors.quantity ? "border-red-500" : ""}
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-500">
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow-backorders"
                        checked={formData.allowBackorders}
                        onCheckedChange={(checked) =>
                          updateFormData("allowBackorders", checked)
                        }
                      />
                      <Label htmlFor="allow-backorders">Allow backorders</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Variations */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Product Variations</CardTitle>
                        <CardDescription>
                          Add variations like size, color, etc.
                        </CardDescription>
                      </div>
                      <Dialog
                        open={showVariationDialog}
                        onOpenChange={setShowVariationDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Variation
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Product Variation</DialogTitle>
                            <DialogDescription>
                              Create a new variation attribute for this product.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="variation-name">
                                Variation Name
                              </Label>
                              <Input
                                id="variation-name"
                                value={newVariation.name}
                                onChange={(e) =>
                                  setNewVariation((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                placeholder="e.g., Size, Color, Material"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Values</Label>
                              {newVariation.values.map((value, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    value={value}
                                    onChange={(e) => {
                                      const newValues = [
                                        ...newVariation.values,
                                      ];
                                      newValues[index] = e.target.value;
                                      setNewVariation((prev) => ({
                                        ...prev,
                                        values: newValues,
                                      }));
                                    }}
                                    placeholder="Enter value"
                                  />
                                  {newVariation.values.length > 1 && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newValues =
                                          newVariation.values.filter(
                                            (_, i) => i !== index
                                          );
                                        setNewVariation((prev) => ({
                                          ...prev,
                                          values: newValues,
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setNewVariation((prev) => ({
                                    ...prev,
                                    values: [...prev.values, ""],
                                  }))
                                }
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Value
                              </Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowVariationDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={addVariation}>
                              Add Variation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {formData.variations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No variations added yet</p>
                        <p className="text-sm">
                          Add variations to create different product options
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.variations.map((variation) => (
                          <div
                            key={variation.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{variation.name}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeVariation(variation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {variation.values.map((value, index) => (
                                <Badge key={index} variant="secondary">
                                  {value}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Variation Combinations */}
                        {formData.variationCombinations.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-4">
                              Variation Combinations
                            </h4>
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Combination</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Enabled</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {formData.variationCombinations.map(
                                    (combo) => (
                                      <TableRow key={combo.id}>
                                        <TableCell>
                                          <div className="flex flex-wrap gap-1">
                                            {Object.entries(
                                              combo.attributes
                                            ).map(([key, value]) => (
                                              <Badge
                                                key={key}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {key}: {value}
                                              </Badge>
                                            ))}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            value={combo.sku}
                                            onChange={(e) =>
                                              updateVariationCombination(
                                                combo.id,
                                                "sku",
                                                e.target.value
                                              )
                                            }
                                            className="h-8"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            value={combo.price}
                                            onChange={(e) =>
                                              updateVariationCombination(
                                                combo.id,
                                                "price",
                                                Number.parseFloat(
                                                  e.target.value
                                                ) || 0
                                              )
                                            }
                                            className="h-8 w-20"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            type="number"
                                            value={combo.stock}
                                            onChange={(e) =>
                                              updateVariationCombination(
                                                combo.id,
                                                "stock",
                                                Number.parseInt(
                                                  e.target.value
                                                ) || 0
                                              )
                                            }
                                            className="h-8 w-16"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Switch
                                            checked={combo.enabled}
                                            onCheckedChange={(checked) =>
                                              updateVariationCombination(
                                                combo.id,
                                                "enabled",
                                                checked
                                              )
                                            }
                                          />
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {formData.images.length > 0 ? (
                      <img
                        src={
                          formData.images.find((img) => img.isPrimary)?.url ||
                          formData.images[0].url
                        }
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">
                      {formData.name || "Product Name"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formData.category || "Category"}
                    </p>
                    <p className="text-sm font-semibold">
                      ${formData.price || "0.00"}
                    </p>
                    <Badge
                      variant={
                        formData.status === "Active"
                          ? "default"
                          : formData.status === "Draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs mt-1"
                    >
                      {formData.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Form Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">General Info</span>
                    {formData.name &&
                    formData.description &&
                    formData.price > 0 &&
                    formData.category &&
                    formData.brand ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Advanced Settings</span>
                    {formData.sku ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Images</span>
                    {formData.images.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Images:</span>
                  <span>{formData.images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Variations:</span>
                  <span>{formData.variations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Combinations:</span>
                  <span>{formData.variationCombinations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Stock:</span>
                  <span>
                    {formData.variationCombinations.length > 0
                      ? formData.variationCombinations.reduce(
                          (sum, combo) => sum + combo.stock,
                          0
                        )
                      : formData.quantity}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
