"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function DeleteConfirmBtn({
  targetId,
  onDelete,
  isPending,
  isSuccess,
  title,
  children,
}: {
  targetId: string;
  onDelete: (id: string) => void;
  isPending: boolean;
  isSuccess: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    try {
      await onDelete(targetId);
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess, title]);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger
        className=" w-fit text-sm text-start text-red-500 pb-2 hover:text-red-700"
        onClick={() => setOpen(true)}
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className=" bg-red-500 hover:bg-red-500 w-[100px]"
            onClick={handleDelete}
          >
            {isPending ? (
              <LoaderCircle size={18} className=" animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
