"use client";

import { useState, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";

// Define the Zod schema for collection validation
const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Infer the TypeScript type from the Zod schema
type CollectionFormData = z.infer<typeof collectionSchema>;

// Define the full type for a Collection object, which includes a generated ID and other data
type Collection = CollectionFormData & {
  id: string;
  productCount: number;
  productIds: string[];
};

// Mock data to simulate an API response
const mockCollections: Collection[] = [
  {
    id: "1",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest products added to our catalog",
    isActive: true,
    productCount: 12,
    productIds: ["p1", "p2", "p3"],
  },
  {
    id: "2",
    name: "Winter Sale",
    slug: "winter-sale",
    description: "Special winter collection with discounted items",
    isActive: false,
    productCount: 8,
    productIds: ["p4", "p5"],
  },
  // Added a mock collection with an optional description to demonstrate type compatibility
  {
    id: "3",
    name: "Summer Essentials",
    slug: "summer-essentials",
    isActive: true,
    productCount: 0,
    productIds: [],
  },
];

const mockProducts = [
  { id: "p1", name: "Premium T-Shirt", price: 29.99 },
  { id: "p2", name: "Denim Jeans", price: 79.99 },
  { id: "p3", name: "Sneakers", price: 129.99 },
  { id: "p4", name: "Winter Jacket", price: 199.99 },
  { id: "p5", name: "Wool Sweater", price: 89.99 },
  { id: "p6", name: "Casual Shirt", price: 49.99 },
];

export default function CollectionsManagement() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema) as Resolver<CollectionFormData>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  // Auto-generate slug from name
  const watchName = form.watch("name");

  useEffect(() => {
    if (watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug, { shouldDirty: true });
    }
  }, [watchName, form]);

  const onSubmit = (data: CollectionFormData) => {
    // Ensure all fields are correctly typed, using a fallback for optional fields
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      isActive: data.isActive,
      productCount: 0,
      productIds: [],
    };

    setCollections([...collections, newCollection]);
    form.reset();
    setIsCreateDialogOpen(false);
    console.log("Created collection:", newCollection);
  };

  const toggleCollectionStatus = (id: string) => {
    setCollections(
      collections.map((collection) =>
        collection.id === id
          ? { ...collection, isActive: !collection.isActive }
          : collection
      )
    );
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter((collection) => collection.id !== id));
  };

  const openProductDialog = (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (collection) {
      setSelectedCollection(collectionId);
      setSelectedProducts(collection.productIds);
      setIsProductDialogOpen(true);
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const saveProductSelection = () => {
    if (selectedCollection) {
      setCollections(
        collections.map((collection) =>
          collection.id === selectedCollection
            ? {
                ...collection,
                productIds: selectedProducts,
                productCount: selectedProducts.length,
              }
            : collection
        )
      );
    }
    setIsProductDialogOpen(false);
    setSelectedCollection(null);
    setSelectedProducts([]);
  };

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Collections</h2>
          <p className="text-gray-600">Manage your product collections</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New Arrivals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="new-arrivals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this collection..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Active Status</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Collection</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{collection.name}</div>
                      {collection.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {collection.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {collection.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {collection.productCount} products
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={collection.isActive}
                        onCheckedChange={() =>
                          toggleCollectionStatus(collection.id)
                        }
                      />
                      <Badge
                        variant={collection.isActive ? "default" : "secondary"}
                      >
                        {collection.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProductDialog(collection.id)}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Manage Products
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCollection(collection.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Collection Products</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() =>
                            handleProductToggle(product.id)
                          }
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-600">
                {selectedProducts.length} products selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveProductSelection}>Save Selection</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
