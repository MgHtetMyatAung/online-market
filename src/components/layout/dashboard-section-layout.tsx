import React from "react";

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" w-full min-h-[80vh] bg-white p-10 rounded-md">
      {children}
    </section>
  );
}
