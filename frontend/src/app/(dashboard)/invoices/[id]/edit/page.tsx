"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getInvoiceById } from "@/services/invoice.service";
import { useUpdateInvoice } from "@/hooks/mutations/use-invoice-mutation";
import { InvoiceFormPage } from "@/components/invoices/invoice-form";
import { Loading } from "@/components/common/loading";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const { data, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });

  const updateMutation = useUpdateInvoice();

  if (isLoading) {
    return <Loading text="Loading invoice..." />;
  }

  const invoice = data?.data;

  return (
    <>
      <InvoiceFormPage
        invoice={invoice}
        isSubmitting={updateMutation.isPending}
        onSubmit={(formData) => {
          updateMutation.mutate(
            {
              id,
              data: formData,
            },
            {
              onSuccess: () => router.push("/invoices"),
            },
          );
        }}
      />
    </>
  );
}
