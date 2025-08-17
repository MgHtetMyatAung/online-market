import PromotionListTable from "@/features/promotion/components/promotion-list-table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PromotionsPage() {
  return (
    <div className="">
      <div className="">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* <PromotionsManagement /> */}
        <PromotionListTable />
      </div>
    </div>
  );
}
