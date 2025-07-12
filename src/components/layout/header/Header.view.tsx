import Link from "next/link";
import React from "react";

export default function HeaderView() {
  return (
    <header className=" shadow">
      <nav className=" container mx-auto flex justify-between items-center h-[70px]">
        <h3>Online Market</h3>
        <ul className=" flex items-center gap-5">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
