import { ProductCreationForm } from "@/features/product/components/product-creation-form";

export default function ProductCreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Create Product</h2>
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
