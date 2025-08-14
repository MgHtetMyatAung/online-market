"use client";
import { Button } from "@/components/ui/button";
import { AttributeManagement } from "@/features/attribute/components/attribute-management";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AttributesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-3">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <AttributeManagement />
      </div>
    </div>
  );
}
