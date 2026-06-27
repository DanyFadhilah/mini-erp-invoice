"use client";

import { useRouter } from "next/navigation";
import { useCreateInvoice } from "@/hooks/mutations/use-invoice-mutation";
import { InvoiceFormPage } from "@/components/invoices/invoice-form";

export default function CreateInvoicePage() {
  const router = useRouter();
  const createMutation = useCreateInvoice();

  return (
    <InvoiceFormPage
      isSubmitting={createMutation.isPending}
      onSubmit={(data) => {
        createMutation.mutate(data, {
          onSuccess: () => router.push("/invoices"),
        });
      }}
    />
  );
}
