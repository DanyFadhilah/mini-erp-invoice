"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProducts } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/mutations/use-product-mutation";
import { ProductForm } from "@/components/products/product-form";
import { DeleteDialog } from "@/components/common/delete-dialog";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Pagination } from "@/components/common/pagination";
import { Loading } from "@/components/common/loading";
import { DataTable, DataTableColumn } from "@/components/common/data-table";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, limit, debouncedSearch],
    queryFn: () => getProducts(page, limit, debouncedSearch),
  });

  const columns: DataTableColumn<Product>[] = [
    {
      header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      header: "Code",
      accessor: "code",
      sortable: true,
    },
    {
      header: "Type",
      accessor: "type",
      sortable: true,
    },
    {
      header: "Description",
      accessor: "description",
      sortable: true,
    },
    {
      header: "Price",
      render: (product) => formatCurrency(product.price),
      sortable: true,
    },
    {
      header: "Action",
      render: (product) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedProduct(product);
              setOpenForm(true);
            }}
            className="cursor-pointer"
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setSelectedProduct(product);
              setOpenDelete(true);
            }}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading products..." />;
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage product information"
        action={
          <Button
            className="cursor-pointer"
            onClick={() => {
              setSelectedProduct(undefined);
              setOpenForm(true);
            }}
          >
            <Plus /> Add Product
          </Button>
        }
      />

      <SearchInput
        value={search}
        placeholder="Search product (name or code)"
        onChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
      ></SearchInput>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        emptyMessage="No product found."
      />

      <Pagination
        page={page}
        totalPages={data?.meta.totalPages}
        total={data?.meta.total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      <ProductForm
        open={openForm}
        onOpenChange={setOpenForm}
        product={selectedProduct}
        onSubmit={(data) => {
          const payload = {
            ...data,
            price: Number(data.price),
          };

          if (selectedProduct) {
            updateMutation.mutate({
              id: selectedProduct.id,
              data: payload,
            });
          } else {
            createMutation.mutate(payload);
          }

          setOpenForm(false);
        }}
      />

      <DeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Product?"
        description={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedProduct) return;

          deleteMutation.mutate(selectedProduct.id, {
            onSuccess: () => {
              setOpenDelete(false);
            },
          });
        }}
      />
    </div>
  );
}
