import { api } from "@/lib/axios";
import { InvoiceFormData } from "@/types/invoice";

export async function getInvoices(
  page = 1,
  limit = 10,
  search = "",
  type = "",
) {
  const response = await api.get("/invoices", {
    params: {
      page,
      limit,
      search,
      type,
    },
  });

  return response.data;
}

export async function getInvoiceById(id: number) {
  const response = await api.get(`/invoices/${id}`);

  return response.data;
}

export async function createInvoice(data: InvoiceFormData) {
  const response = await api.post("/invoices", data);

  return response.data;
}

export async function updateInvoice(id: number, data: InvoiceFormData) {
  const response = await api.patch(`/invoices/${id}`, data);

  return response.data;
}

export async function deleteInvoice(id: number) {
  const response = await api.delete(`/invoices/${id}`);

  return response.data;
}
