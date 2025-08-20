/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "@/lib/validations/product";

type FormData = z.infer<typeof productSchema>;

interface VariantsTabProps {
  form: UseFormReturn<FormData>;
  hasVariants: boolean;
  setHasVariants: (checked: boolean) => void;
  generateVariants: () => void;
  handleAttributeToggle: (attributeId: string) => void;
  mockAttributes: any[];
  selectedVariantIds: string[];
  handleVariantCheckboxChange: (variantId: string) => void;
  handleSelectAllVariants: (data: [] | string[]) => void;
}

export const VariantsTab: React.FC<VariantsTabProps> = ({
  form,
  hasVariants,
  setHasVariants,
  generateVariants,
  handleAttributeToggle,
  mockAttributes,
  selectedVariantIds,
  handleVariantCheckboxChange,
  handleSelectAllVariants,
}) => {
  const [checkAll, setCheckAll] = useState(false);
  const { register, control, watch, setValue } = form;
  const selectedAttributes = watch("selectedAttributes") || [];

  const { fields: variantFields } = useFieldArray({
    control,
    name: "variants",
  });

  console.log(variantFields, "variantFields");

  const chooseAllVariants = () => {
    if (checkAll) {
      setCheckAll(false);
      handleSelectAllVariants([]);
    } else {
      setCheckAll(true);
      const allVariantIds = variantFields.map((field) => field.id);
      handleSelectAllVariants(allVariantIds);
    }
  };

  useEffect(() => {
    if (!hasVariants) {
      setValue("variants", []);
    }
  }, [hasVariants, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Configure different variations of your product (colors, sizes, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="has-variants"
            checked={hasVariants}
            onCheckedChange={setHasVariants}
          />
          <Label htmlFor="has-variants">This product has variants</Label>
        </div>

        {hasVariants && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Select Attributes</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockAttributes.map((attribute) => (
                  <div key={attribute.id} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`attr-${attribute.id}`}
                        checked={selectedAttributes.includes(attribute.id)}
                        onChange={() => handleAttributeToggle(attribute.id)}
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`attr-${attribute.id}`}
                        className=" text-blue-700"
                      >
                        {attribute.name}
                      </Label>
                    </div>
                    <div className="flex flex-wrap gap-2 ps-4">
                      {attribute.values.map((value: any) => (
                        <Badge
                          key={value.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {value.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedAttributes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Variant Combinations</h4>
                  <Button type="button" onClick={generateVariants} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Variants
                  </Button>
                </div>

                {variantFields.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3 grid grid-cols-12 gap-2 text-sm font-medium">
                      <div className="col-span-3 flex gap-3">
                        <input
                          type="checkbox"
                          // checked={selectedVariantIds.includes(field.id)}
                          onChange={chooseAllVariants}
                          className="rounded border-gray-300"
                        />{" "}
                        SKU
                      </div>
                      <div className="col-span-3">Price</div>
                      <div className="col-span-3">Stock</div>
                      <div className="col-span-3">Attributes</div>
                    </div>
                    {variantFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-3 border-t grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-3 flex gap-3">
                          <input
                            type="checkbox"
                            checked={selectedVariantIds.includes(field.id)}
                            onChange={() =>
                              handleVariantCheckboxChange(field.id)
                            }
                            className="rounded border-gray-300"
                          />
                          <Input
                            {...register(`variants.${index}.sku`)}
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`variants.${index}.price`, {
                              valueAsNumber: true,
                            })}
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            {...register(`variants.${index}.stock`, {
                              valueAsNumber: true,
                            })}
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-3 flex flex-wrap gap-1">
                          {field?.attributes?.map((attribute) => (
                            <Badge
                              key={attribute.attributeId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {`${attribute.value}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
