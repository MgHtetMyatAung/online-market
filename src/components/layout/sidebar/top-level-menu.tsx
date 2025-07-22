/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import SecondLevelMenu from "./second-level-menu";
import Link from "next/link";

export default function TopLevelMenu({ items }: { items: any }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!items?.items) {
    return (
      <SidebarMenuItem key={items.title}>
        <SidebarMenuButton asChild tooltip={items.title} className=" py-5">
          <Link href={items.url} className=" text-gray-400 hover:text-gray-100">
            <items.icon />
            <span className=" font-medium">{items.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={items.title}
              className="py-5 text-gray-400 hover:text-gray-100 group-data-[state=open]/collapsible:text-gray-100"
            >
              {items?.icon && <items.icon />}
              <span className=" font-medium ">{items.title}</span>
              <ChevronRight
                className={cn(
                  "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.items?.map((subItem: any) => (
                <SecondLevelMenu items={subItem} key={subItem.title} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}
