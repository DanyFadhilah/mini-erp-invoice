"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getInvoices } from "@/services/invoice.service";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";
import { useDebounce } from "@/hooks/use-debounce";
import { useDeleteInvoice } from "@/hooks/mutations/use-invoice-mutation";
import { DeleteDialog } from "@/components/common/delete-dialog";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Pagination } from "@/components/common/pagination";
import { Loading } from "@/components/common/loading";
import { DataTable, DataTableColumn } from "@/components/common/data-table";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_COLOR = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
} as const;

export default function InvoicePage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();

  const deleteMutation = useDeleteInvoice();
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page, limit, debouncedSearch],
    queryFn: () => getInvoices(page, limit, debouncedSearch),
  });

  const columns: DataTableColumn<Invoice>[] = [
    {
      header: "Invoice Number",
      accessor: "invoiceNumber",
      sortable: true,
    },
    {
      header: "Customer",
      render: (invoice) => invoice.customer.name,
      sortable: true,
    },
    {
      header: "Type",
      render: (invoice) => invoice.user.name,
      sortable: true,
    },
    {
      header: "Status",
      accessor: "status",
      render: (invoice) => (
        <Badge className={STATUS_COLOR[invoice.status]}>{invoice.status}</Badge>
      ),
      sortable: true,
    },
    {
      header: "Issue Date",
      accessor: "issueDate",
      render: (invoice) => formatDate(invoice.issueDate),
      sortable: true,
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      render: (invoice) => formatDate(invoice.dueDate),
      sortable: true,
    },
    {
      header: "Total",
      accessor: "total",
      render: (invoice) => formatCurrency(invoice.total),
      sortable: true,
    },
    {
      header: "Action",
      render: (invoice) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              setSelectedInvoice(invoice);
              setOpenDelete(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading invoices..." />;
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Manage invoice information"
        action={
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/invoices/create")}
          >
            <Plus /> Add Invoice
          </Button>
        }
      />

      <SearchInput
        value={search}
        placeholder="Search invoice (name or code)"
        onChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        emptyMessage="No invoice found."
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

      <DeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Invoice?"
        description={`Are you sure you want to delete invoice "${selectedInvoice?.invoiceNumber}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedInvoice) return;

          deleteMutation.mutate(selectedInvoice.id, {
            onSuccess: () => setOpenDelete(false),
          });
        }}
      />
    </div>
  );
}
