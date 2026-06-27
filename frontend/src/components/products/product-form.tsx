"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ProductFormData, productSchema, Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
}

export function ProductForm({ open, onOpenChange, product, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        code: product.code,
        type: product.type,
        description: product.description,
        price: Number(product.price),
      });
    } else {
      reset({
        name: "",
        code: "",
        type: "PRODUCT",
        description: "",
        price: 0,
      });
    }
  }, [product, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col gap-0"
        >
          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Product Name<span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Product Name" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Product Code<span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Product Code" {...register("code")} />

            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Product Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="PRODUCT">Product</SelectItem>

                    <SelectItem value="SERVICE">Service</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">Description Product</Label>
            <Textarea
              placeholder="Description Product"
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Price <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rp</span>

                    <Input
                      {...field}
                      placeholder="Price"
                      value={formatCurrencyInput(field.value)}
                      onChange={(e) =>
                        field.onChange(parseCurrencyInput(e.target.value))
                      }
                    />
                  </div>

                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
