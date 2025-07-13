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
import { LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DeleteConfirmBtn({
  targetId,
  onDelete,
  isPending,
  isSuccess,
  title,
}: {
  targetId: string;
  onDelete: (id: string) => void;
  isPending: boolean;
  isSuccess: boolean;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    try {
      await onDelete(targetId);
    } catch (err) {
      console.error("Error deleting brand:", err);
      toast.error(`Failed to ${title.toLocaleLowerCase()} brand.`);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success(`${title} deleted successfully!`);
    }
  }, [isSuccess, title]);
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger
        className=" flex gap-2 px-2 py-1 items-center w-full mb-1 hover:bg-gray-100 text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
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
            className=" bg-red-500 hover:bg-red-500 min-w-[90px]"
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
