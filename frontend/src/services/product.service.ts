import { api } from "@/lib/axios";
import { ProductFormData } from "@/types/product";

export async function getProducts(
  page = 1,
  limit = 10,
  search = "",
  type = "",
) {
  const response = await api.get("/products", {
    params: {
      page,
      limit,
      search,
      type,
    },
  });

  return response.data;
}

export async function createProduct(data: ProductFormData) {
  const response = await api.post("/products", data);

  return response.data;
}

export async function updateProduct(id: number, data: ProductFormData) {
  const response = await api.patch(`/products/${id}`, data);

  return response.data;
}

export async function deleteProduct(id: number) {
  const response = await api.delete(`/products/${id}`);

  return response.data;
}
