import { InvoiceStatus } from "@/types/invoice";
import { z } from "zod";

export const invoiceStatusEnum = z.enum([
  "DRAFT",
  "SENT",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);

export const invoiceItemSchema = z.object({
  productId: z.number().min(1, "Product is required"),

  qty: z.number().min(1, "Quantity must be at least 1"),
});

export const invoiceSchema = z
  .object({
    customerId: z.number().min(1, "Customer is required"),

    issueDate: z.string().min(1, "Issue date is required"),

    dueDate: z.string().min(1, "Due date is required"),

    status: invoiceStatusEnum,

    notes: z.string().optional(),

    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.issueDate), {
    message: "Due date cannot be earlier than issue date",
    path: ["dueDate"],
  });

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export interface InvoiceFormItem {
  productId: number;
  qty: number;
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Invoice {
  customerId: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  items: InvoiceFormItem[];
}
