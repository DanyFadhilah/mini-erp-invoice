import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product.service";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      toast.success("Product created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
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

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => updateProduct(id, data),

    onSuccess: () => {
      toast.success("Product updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
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

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      toast.success("Product deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
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
