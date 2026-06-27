"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Invoice,
  InvoiceStatus,
  invoiceSchema,
  InvoiceFormData,
} from "@/types/invoice";
import { getCustomers } from "@/services/customer.service";
import { getProducts } from "@/services/product.service";
import { formatCurrency } from "@/lib/format";
import { InvoicePdf } from "../pdf/invoice-pdf-review";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePdfExport } from "../pdf/invoice-pdf-export";

type InvoiceItemField = {
  productId: number;
  productName: string;
  productCode: string;
  qty: number;
  price: number;
  amount: number;
};

type InvoiceFormValues = Omit<InvoiceFormData, "items"> & {
  items: InvoiceItemField[];
};

type Props = {
  invoice?: Invoice;
  onSubmit: (data: InvoiceFormData) => void;
  isSubmitting?: boolean;
};

const STATUS_OPTIONS: InvoiceStatus[] = [
  "DRAFT",
  "SENT",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

export function getToday(): string {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const local = new Date(today.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
}

export function InvoiceFormPage({ invoice, onSubmit, isSubmitting }: Props) {
  const router = useRouter();
  const isEdit = !!invoice;

  const { data: customersData } = useQuery({
    queryKey: ["customers-all"],
    queryFn: () => getCustomers(1, 100),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => getProducts(1, 100),
  });

  const customers = customersData?.data ?? [];
  const products = productsData?.data ?? [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: invoice?.customer?.id ?? 0,
      issueDate: invoice?.issueDate
        ? invoice.issueDate.slice(0, 10)
        : getToday(),
      dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
      status: invoice?.status ?? "DRAFT",
      notes: invoice?.notes ?? "",
      items:
        invoice?.items?.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productCode: item.product.code ?? "",
          qty: item.qty,
          price: Number(item.price),
          amount: Number(item.amount),
        })) ?? [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const watchedValues = useWatch({ control });
  const { customerId, issueDate, dueDate, status, notes, items } =
    watchedValues;

  const selectedCustomer = customers.find((c) => c.id === Number(customerId));
  const selectedProductIds = (items ?? [])
    .map((item) => item.productId)
    .filter((id) => id !== 0);

  const subtotal = (items ?? []).reduce(
    (sum, item) => sum + (item?.amount ?? 0),
    0,
  );
  const total = subtotal;

  function handleAddItem() {
    append({
      productId: 0,
      productName: "",
      productCode: "",
      qty: 1,
      price: 0,
      amount: 0,
    });
  }

  function handleProductChange(index: number, productId: number) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentQty = items?.[index]?.qty ?? 1;
    const price = Number(product.price);

    update(index, {
      productId: product.id,
      productName: product.name,
      productCode: product.code ?? "",
      qty: currentQty,
      price,
      amount: price * currentQty,
    });
  }

  function handleQtyChange(index: number, qty: number) {
    const current = items?.[index];
    if (!current) return;

    update(index, {
      ...current,
      qty,
      amount: current.price * qty,
    });
  }

  function onFormSubmit(values: InvoiceFormValues) {
    onSubmit({
      customerId: values.customerId,
      issueDate: values.issueDate,
      dueDate: values.dueDate,
      status: values.status,
      notes: values.notes || undefined,
      items: values.items.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    });
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b py-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => router.push("/invoices")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {isEdit ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-xs text-gray-500">
              {isEdit
                ? `Editing ${invoice.invoiceNumber}`
                : "Fill in the details below to create a new invoice."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isEdit && (
            <PDFDownloadLink
              document={<InvoicePdfExport invoice={invoice} />}
              fileName={`${invoice.invoiceNumber}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => router.push("/invoices")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="cursor-pointer"
              disabled={isSubmitting}
              onClick={handleSubmit(onFormSubmit)}
            >
              {isSubmitting ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-[1400px] mx-auto">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              Invoice Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">
                  Customer <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={customerId ? String(customerId) : undefined}
                  onValueChange={(val) =>
                    setValue("customerId", Number(val), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                        {c.companyName ? ` (${c.companyName})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && (
                  <p className="text-xs text-red-500">
                    {errors.customerId.message}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Select the customer for this invoice
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-700">
                    Issue Date <span className="text-red-500">*</span>
                  </Label>
                  <Input type="date" {...register("issueDate")} />
                  {errors.issueDate && (
                    <p className="text-xs text-red-500">
                      {errors.issueDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-700">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Input type="date" min={issueDate} {...register("dueDate")} />
                  {errors.dueDate && (
                    <p className="text-xs text-red-500">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) =>
                    setValue("status", val as InvoiceStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">Notes</Label>
                <Textarea
                  placeholder="Optional notes for this invoice"
                  rows={3}
                  {...register("notes")}
                />
                <p className="text-xs text-gray-400">
                  Optional notes for this invoice
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              Invoice Items
            </h2>

            <div className="space-y-3">
              {fields.length > 0 && (
                <div className="grid grid-cols-[1fr_80px_120px_120px_40px] gap-3 text-xs font-medium text-gray-500 pb-1 border-b border-gray-100">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Amount</span>
                  <span />
                </div>
              )}

              {fields.map((field, index) => {
                const currentItem = items?.[index];

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_80px_120px_120px_40px] gap-3 items-center"
                  >
                    <div>
                      <Select
                        value={
                          currentItem?.productId
                            ? String(currentItem.productId)
                            : undefined
                        }
                        onValueChange={(val) =>
                          handleProductChange(index, Number(val))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id.toString()}
                              disabled={
                                selectedProductIds.includes(p.id) &&
                                p.id !== currentItem?.productId
                              }
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {currentItem?.productCode && (
                        <p className="text-xs text-gray-400 mt-0.5 pl-1">
                          {currentItem.productCode}
                        </p>
                      )}
                      {errors.items?.[index]?.productId && (
                        <p className="text-xs text-red-500 mt-0.5 pl-1">
                          {errors.items[index].productId?.message}
                        </p>
                      )}
                    </div>

                    <Input
                      type="number"
                      min={1}
                      value={currentItem?.qty ?? 1}
                      onChange={(e) =>
                        handleQtyChange(index, Number(e.target.value))
                      }
                      className="text-center"
                    />

                    <div className="text-right text-sm text-gray-600">
                      {formatCurrency(currentItem?.price ?? 0)}
                    </div>

                    <div className="text-right text-sm font-medium text-gray-900">
                      {formatCurrency(currentItem?.amount ?? 0)}
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {errors.items?.root && (
                <p className="text-xs text-red-500">
                  {errors.items.root.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer mt-2"
                onClick={handleAddItem}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pb-8">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.push("/invoices")}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              disabled={isSubmitting}
              onClick={handleSubmit(onFormSubmit)}
            >
              {isSubmitting ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0 print-area">
          <InvoicePdf
            invoiceNumber={invoice?.invoiceNumber}
            customer={selectedCustomer}
            issueDate={issueDate}
            dueDate={dueDate}
            status={status}
            notes={notes}
            items={items ?? []}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
