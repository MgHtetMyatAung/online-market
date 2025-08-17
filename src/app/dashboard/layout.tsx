import DashboardSectionLayout from "@/components/layout/dashboard-section-layout";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <DashboardSectionLayout>{children}</DashboardSectionLayout>
    </DashboardLayout>
  );
}
