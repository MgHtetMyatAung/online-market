"use client";
import { AttributeManagement } from "@/features/attribute/components/attribute-management";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AttributesPage() {
  return (
    <div className="min-h-screen bg-background">
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

        <AttributeManagement />
      </div>
    </div>
  );
}
