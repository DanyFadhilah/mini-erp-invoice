import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/services/invoice.service";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,

    onSuccess: () => {
      toast.success("Invoice created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },

    onError: (error: any) => {
      const message = error.response?.data?.message;

      toast.error("Validation Error", {
        description: Array.isArray(message)
          ? message.map((m: string) => `• ${m}`).join("\n")
          : message,
        className: "whitespace-pre-line",
      });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => updateInvoice(id, data),

    onSuccess: () => {
      toast.success("Invoice updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },

    onError: (error: any) => {
      const message = error.response?.data?.message;

      toast.error("Validation Error", {
        description: Array.isArray(message)
          ? message.map((m: string) => `• ${m}`).join("\n")
          : message,
        className: "whitespace-pre-line",
      });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,

    onSuccess: () => {
      toast.success("Invoice deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },

    onError: (error: any) => {
      const message = error.response?.data?.message;

      toast.error("Validation Error", {
        description: Array.isArray(message)
          ? message.map((m: string) => `• ${m}`).join("\n")
          : message,
        className: "whitespace-pre-line",
      });
    },
  });
}
