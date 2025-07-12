import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export default function LinkButton({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Button>
        {icon} {children}
      </Button>
    </Link>
  );
}
