import Link from "next/link";
import React from "react";

export default function BrandMark() {
  return (
    <div className=" py-3">
      <p className=" text-sm text-center text-gray-800 space-x-2 font-medium">
        <span className=" text-gray-400">2025@</span>{" "}
        <Link href={""} className=" hover:text-blue-600">
          iT CORNER
        </Link>
      </p>
    </div>
  );
}
