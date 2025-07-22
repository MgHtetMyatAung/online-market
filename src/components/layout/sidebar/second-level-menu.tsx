"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SecondLevelMenu({ items }: { items: any }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!items?.items) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild className=" py-5">
          <Link href={items.url} className=" text-gray-400 hover:text-gray-100">
            <span>{items.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }
  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsibletwo"
      >
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton className="py-5 ">
              <span className="text-gray-400">{items.title}</span>
              <ChevronRight
                className={cn(
                  "ml-auto transition-transform duration-200 group-data-[state=open]/collapsibletwo:rotate-90"
                )}
              />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.items?.map((subItem: any) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild className=" py-5">
                    <Link href={subItem.url} className="text-gray-400">
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    </>
  );
}
