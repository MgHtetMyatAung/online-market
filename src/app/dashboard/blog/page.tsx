import { BlogsManagement } from "@/features/blog/components/blogs-management";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <BlogsManagement />
      </div>
    </div>
  );
}
