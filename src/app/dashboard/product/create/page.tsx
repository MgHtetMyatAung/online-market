import { ProductCreationForm } from "@/features/product/components/product-creation-form";

export default function ProductCreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your catalog with variants, promotions, and
            detailed information.
          </p>
        </div>
        <ProductCreationForm />
      </div>
    </div>
  );
}
