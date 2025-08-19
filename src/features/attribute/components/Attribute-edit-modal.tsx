import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useUpdateAttribute } from "../api/mutations";
import SubmitBtn from "@/components/actions/SubmitBtn";
import { typeOfAttribute } from "../type";

interface CreateAttributeFormData {
  name: string;
  values: string;
}

export default function AttributeEditModal({
  attribute,
}: {
  attribute: typeOfAttribute;
}) {
  const { mutate, isPending, isSuccess } = useUpdateAttribute();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAttributeFormData>({
    mode: "onChange",
    defaultValues: {
      name: attribute?.name || "",
      values: attribute?.values?.map((v) => v.value).join(",") || "",
    },
  });

  const onSubmit = async (data: CreateAttributeFormData) => {
    try {
      const valuesList = data.values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
        .map((value, index) => ({
          id: `${Date.now()}-${index}`,
          value,
        }));

      await mutate({
        id: attribute.id,
        data: {
          name: data.name,
          values: valuesList,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleDialogClose(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <SquarePen size={20} className=" cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Attribute</DialogTitle>
          <DialogDescription>
            Add a new attribute like Color, Size, or Material with its values.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className=" space-y-1">
            <Label htmlFor="attribute-name">Attribute Name</Label>
            <Input
              id="attribute-name"
              placeholder="e.g., Color, Size, Material"
              {...register("name", {
                required: "Attribute name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className=" space-y-1">
            <Label htmlFor="attribute-values">Values (comma-separated)</Label>
            <Textarea
              id="attribute-values"
              placeholder="e.g., Red, Blue, Green, Yellow"
              {...register("values", {
                required: "At least one value is required",
                validate: (value) => {
                  const values = value
                    .split(",")
                    .map((v) => v.trim())
                    .filter((v) => v.length > 0);
                  return values.length > 0 || "At least one value is required";
                },
              })}
              rows={3}
            />
            {errors.values && (
              <p className="text-sm text-red-600 mt-1">
                {errors.values.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Enter values separated by commas. You can add more values later.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
            >
              Cancel
            </Button>
            <SubmitBtn isPending={isPending} title="Update" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
