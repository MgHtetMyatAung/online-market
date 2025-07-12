import HeaderView from "@/components/layout/header/Header.view";

export default function ViewRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <HeaderView />
      {children}
    </main>
  );
}
