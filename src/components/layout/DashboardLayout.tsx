"use client";
import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex w-full h-screen">
      <div className="w-[200px] bg-gray-200 sticky top-0 left-0"></div>
      <div className=" p-5 w-full h-full overflow-y-auto">{children}</div>
    </div>
  );
}
