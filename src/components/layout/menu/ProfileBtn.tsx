"use client";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function ProfileBtn() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-9 w-9 rounded-lg">
          <AvatarImage
            src={"/user.png"}
            alt={"user"}
            className=" cursor-pointer"
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white mt-3"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className=" cursor-pointer">
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuSeparator /> */}
        {/* <LogoutBtn /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
