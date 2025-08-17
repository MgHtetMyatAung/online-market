import ProductListTable from "@/features/product/components/ProductListTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <ProductListTable />
    </div>
  );
}
