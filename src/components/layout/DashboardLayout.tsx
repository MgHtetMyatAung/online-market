import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/AppSideBar";
import DashboardMenu from "./menu/DashboardMenu";
import BrandMark from "./BrandMark";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" w-full relative scroll-bar-fit bg-gray-100">
        <DashboardMenu />
        {children}
        <BrandMark />
      </main>
    </SidebarProvider>
  );
}
