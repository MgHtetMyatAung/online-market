/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";

// Error boundaries must be Client Components
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <div className=" py-16">
      <div className=" text-center space-y-5">
        <Image
          src={"/image/error-message.png"}
          alt="error"
          width={150}
          height={150}
          className=" w-[100px] h-[100px] mx-auto"
        />
        <div className=" space-y-2">
          <h2 className=" text-red-500 text-xl font-semibold">
            Something went wrong!
          </h2>
          <button onClick={reset} className=" text-gray-500 underline">
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
