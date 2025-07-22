"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SideBarHeading from "./side-bar-heading";
import {
  applicationMenuItems,
  controlMenuItems,
  supportMenuItems,
} from "./data";
import TopLevelMenu from "./top-level-menu";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className=" bg-[#202B46]">
      <SidebarHeader className=" bg-[#202B46]">
        <SideBarHeading title="Online Market" />
      </SidebarHeader>
      <SidebarContent className=" scroll-bar-fit gap-0 bg-[#202B46]">
        <SidebarGroup>
          <SidebarGroupLabel className=" text-gray-500">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" gap-0">
              {applicationMenuItems.map((item) => (
                <TopLevelMenu items={item} key={item.title} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className=" text-gray-500">
            Control
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" gap-0">
              {controlMenuItems.map((item) => (
                <TopLevelMenu items={item} key={item.title} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className=" text-gray-500">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" gap-0">
              {supportMenuItems.map((item) => (
                <TopLevelMenu items={item} key={item.title} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" bg-[#202B46]" />
    </Sidebar>
  );
}
