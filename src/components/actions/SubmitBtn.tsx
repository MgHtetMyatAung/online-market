import React from "react";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubmitBtn({
  isPending,
  title,
}: {
  isPending?: boolean;
  title?: string;
}) {
  return (
    <Button type="submit" className=" min-w-[100px]">
      {isPending ? (
        <LoaderCircle size={18} className=" animate-spin" />
      ) : (
        title || "Submit"
      )}
    </Button>
  );
}
