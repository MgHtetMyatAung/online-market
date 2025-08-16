import DashboardSectionLayout from "@/components/layout/dashboard-section-layout";
import React from "react";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardSectionLayout>{children}</DashboardSectionLayout>;
}
