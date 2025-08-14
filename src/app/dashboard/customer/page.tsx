// import CategoryListTable from "@/features/category/components/CategoryListTable";
import { CustomersManagement } from "@/features/customer/components/customers-management";
import React from "react";

export default function CustomerPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <CustomersManagement />
      </div>
    </div>
  );
}
