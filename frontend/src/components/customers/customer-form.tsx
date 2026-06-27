"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormData, customerSchema, Customer } from "@/types/customer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => void;
}

export function CustomerForm({
  open,
  onOpenChange,
  customer,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        companyName: customer.companyName ?? "",
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      });
    } else {
      reset({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [customer, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col gap-0"
        >
          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Customer Name<span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Name" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">Company Name</Label>
            <Input placeholder="Company Name" {...register("companyName")} />
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Email<span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Email" {...register("email")} />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Phone<span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Phone" {...register("phone")} />

            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="flex gap-0">
              Customer Address<span className="text-red-500">*</span>
            </Label>
            <Textarea placeholder="Address" {...register("address")} />

            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
