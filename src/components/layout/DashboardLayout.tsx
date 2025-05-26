import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/AppSideBar";
import DashboardMenu from "./menu/DashboardMenu";

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
        <div className=" p-5 w-full h-full">
          <div className="">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
