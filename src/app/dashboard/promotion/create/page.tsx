import PromotionCreateForm from "@/features/promotion/components/promotion-form/promotion-create-form";

export default function CreatePromotionPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Create Promotion</h2>
      </div>
      <PromotionCreateForm />
    </div>
  );
}
