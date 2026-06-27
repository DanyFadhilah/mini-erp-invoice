export interface Customer {
  id: number;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
}

import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),

  companyName: z.string().optional(),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  phone: z
    .string()
    .min(1, "Phone is required")
    .refine((value) => isValidPhoneNumber(value, "ID"), {
      message: "Invalid phone number",
    }),

  address: z.string().min(1, "Address is required"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
