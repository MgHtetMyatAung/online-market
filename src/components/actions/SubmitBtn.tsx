import React from "react";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubmitBtn({
  isPending,
  title,
  className,
}: {
  isPending?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <Button type="submit" className={` min-w-[100px] ${className}`}>
      {isPending ? (
        <LoaderCircle size={18} className=" animate-spin" />
      ) : (
        title || "Submit"
      )}
    </Button>
  );
}
