export interface Product {
  id: number;
  code: string;
  name: string;
  type: "PRODUCT" | "SERVICE";
  description?: string;
  price: number;
}

import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product Name is required"),

  code: z.string().min(1, "Product Code is required"),

  type: z.string().min(1, "Type is required"),

  description: z.string().optional(),

  price: z.number().min(2, "Price is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
