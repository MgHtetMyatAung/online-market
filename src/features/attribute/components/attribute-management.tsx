"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface CreateAttributeFormData {
  name: string;
  values: string;
}

export function AttributeManagement() {
  const [attributes, setAttributes] = useState<Attribute[]>([
    {
      id: "1",
      name: "Color",
      values: [
        { id: "1", value: "Red" },
        { id: "2", value: "Blue" },
        { id: "3", value: "Green" },
      ],
    },
    {
      id: "2",
      name: "Size",
      values: [
        { id: "4", value: "Small" },
        { id: "5", value: "Medium" },
        { id: "6", value: "Large" },
      ],
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAttributeFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      values: "",
    },
  });

  const onSubmit = (data: CreateAttributeFormData) => {
    const valuesList = data.values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
      .map((value, index) => ({
        id: `${Date.now()}-${index}`,
        value,
      }));

    const newAttribute: Attribute = {
      id: Date.now().toString(),
      name: data.name.trim(),
      values: valuesList,
    };

    setAttributes([...attributes, newAttribute]);
    reset();
    setIsCreateDialogOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  const deleteAttribute = (attributeId: string) => {
    setAttributes(attributes.filter((attr) => attr.id !== attributeId));
  };

  const deleteValue = (attributeId: string, valueId: string) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === attributeId
          ? { ...attr, values: attr.values.filter((val) => val.id !== valueId) }
          : attr
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Attribute Management
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage product attributes that will be available for
            variant creation
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Attribute</DialogTitle>
              <DialogDescription>
                Add a new attribute like Color, Size, or Material with its
                values.
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
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className=" space-y-1">
                <Label htmlFor="attribute-values">
                  Values (comma-separated)
                </Label>
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
                      return (
                        values.length > 0 || "At least one value is required"
                      );
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
                  Enter values separated by commas. You can add more values
                  later.
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
                <Button type="submit" disabled={!isValid}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {attributes.length === 0 ? (
        <Alert>
          <AlertDescription>
            No attributes created yet. Click &ldquo;Create Attribute&rdquo; to
            get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attribute Name</TableHead>
                <TableHead>Values</TableHead>
                <TableHead>Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributes.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell className="font-medium">
                    {attribute.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {attribute.values.map((value) => (
                        <Badge
                          key={value.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {value.value}
                          <button
                            onClick={() => deleteValue(attribute.id, value.id)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{attribute.values.length}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteAttribute(attribute.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
