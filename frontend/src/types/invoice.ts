import { z } from "zod";
import { Customer } from "./customer";
import { Product } from "./product";

export interface InvoiceItem {
  id: number;
  qty: number;
  price: number;
  amount: number;

  product: Product;
}

export const invoiceStatusEnum = z.enum([
  "DRAFT",
  "SENT",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);

const invoiceItemSchema = z.object({
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
  id: number;
  invoiceNumber: string;

  customer: Customer;

  issueDate: string;
  dueDate: string;

  status: InvoiceStatus;
  notes?: string;

  subtotal: number;
  total: number;
  totalAmount: number;

  user: {
    id: number;
    name: string;
  };

  items: InvoiceItem[];
}
