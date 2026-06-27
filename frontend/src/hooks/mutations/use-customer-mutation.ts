import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customer.service";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      toast.success("Customer created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
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

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => updateCustomer(id, data),

    onSuccess: () => {
      toast.success("Customer updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
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

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: () => {
      toast.success("Customer deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
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
