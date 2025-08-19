import GoBackBtn from "@/components/actions/GoBackBtn";
import { ROUTE_PATH } from "@/constants/router";
import PromotionCreateForm from "@/features/promotion/components/promotion-form/promotion-create-form";

export default function CreatePromotionPage() {
  return (
    <div>
      <GoBackBtn href={ROUTE_PATH.PROMOTION.LIST} label="Back" />
      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-bold tracking-tight">Create Promotion</h2>
      </div>
      <PromotionCreateForm />
    </div>
  );
}
