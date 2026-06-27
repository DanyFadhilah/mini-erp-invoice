"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCustomers } from "@/services/customer.service";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/mutations/use-customer-mutation";
import { CustomerForm } from "@/components/customers/customer-form";
import { DeleteDialog } from "@/components/common/delete-dialog";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Pagination } from "@/components/common/pagination";
import { Loading } from "@/components/common/loading";
import { DataTable, DataTableColumn } from "@/components/common/data-table";
import { Plus } from "lucide-react";

export default function CustomerPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, limit, debouncedSearch],
    queryFn: () => getCustomers(page, limit, debouncedSearch),
  });

  const columns: DataTableColumn<Customer>[] = [
    {
      header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      header: "Phone",
      accessor: "phone",
      sortable: true,
    },
    {
      header: "Company",
      accessor: "companyName",
      sortable: true,
    },
    {
      header: "Address",
      accessor: "address",
      sortable: true,
    },
    {
      header: "Action",
      render: (customer) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedCustomer(customer);
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
              setSelectedCustomer(customer);
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
    return <Loading text="Loading customers..." />;
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage customer information"
        action={
          <Button
            className="cursor-pointer"
            onClick={() => {
              setSelectedCustomer(undefined);
              setOpenForm(true);
            }}
          >
            <Plus /> Add Customer
          </Button>
        }
      />

      <SearchInput
        value={search}
        placeholder="Search customer (name, email or company name)"
        onChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
      ></SearchInput>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        emptyMessage="No customer found."
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

      <CustomerForm
        open={openForm}
        onOpenChange={setOpenForm}
        customer={selectedCustomer}
        onSubmit={(data) => {
          if (selectedCustomer) {
            updateMutation.mutate({
              id: selectedCustomer.id,
              data,
            });
          } else {
            createMutation.mutate(data);
          }

          setOpenForm(false);
        }}
      />

      <DeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Customer?"
        description={`Are you sure you want to delete "${selectedCustomer?.name}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedCustomer) return;

          deleteMutation.mutate(selectedCustomer.id, {
            onSuccess: () => {
              setOpenDelete(false);
            },
          });
        }}
      />
    </div>
  );
}
