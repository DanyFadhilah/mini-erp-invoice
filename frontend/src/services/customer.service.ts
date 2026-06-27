import { api } from "@/lib/axios";
import { CustomerFormData } from "@/types/customer";

export async function getCustomers(page = 1, limit = 10, search = "") {
  const response = await api.get("/customers", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
}

export async function createCustomer(data: CustomerFormData) {
  const response = await api.post("/customers", data);

  return response.data;
}

export async function updateCustomer(id: number, data: CustomerFormData) {
  const response = await api.patch(`/customers/${id}`, data);

  return response.data;
}

export async function deleteCustomer(id: number) {
  const response = await api.delete(`/customers/${id}`);

  return response.data;
}
