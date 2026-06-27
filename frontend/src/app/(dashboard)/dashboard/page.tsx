"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, Package, FileText, Wallet, Clock3, Trophy } from "lucide-react";

import { getDashboardSummary } from "@/services/dashboard.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { Loading } from "@/components/common/loading";
import { useProfile } from "@/hooks/queries/use-profile";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  const { data: profile } = useProfile();

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  function StatusBadge({ status }: { status: string }) {
    switch (status) {
      case "DRAFT":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Draft
          </Badge>
        );

      case "SENT":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Sent
          </Badge>
        );

      case "PAID":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        );

      case "OVERDUE":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Overdue
          </Badge>
        );

      case "CANCELLED":
        return (
          <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">
            Cancelled
          </Badge>
        );

      default:
        return <Badge>{status}</Badge>;
    }
  }

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 15) return "Good Afternoon";
    if (hour < 18) return "Good Evening";

    return "Good Night";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`${getGreeting()}, ${profile.role}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/customers">
          <Card className="transition hover:shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {data?.stats.totalCustomers}
                </h2>
              </div>

              <Users className="h-10 w-10 text-blue-500" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/products">
          <Card className="transition hover:shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {data?.stats.totalProducts}
                </h2>
              </div>

              <Package className="h-10 w-10 text-green-500" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/invoices">
          <Card className="transition hover:shadow-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <h2 className="mt-2 text-3xl font-bold">
                  {data?.stats.totalInvoices}
                </h2>
              </div>

              <FileText className="h-10 w-10 text-orange-500" />
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>

              <h2 className="mt-2 text-2xl font-bold">
                Rp {Number(data?.stats.totalRevenue).toLocaleString("id-ID")}
              </h2>
            </div>

            <Wallet className="h-10 w-10 text-emerald-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {Object.entries(data?.invoiceStatus ?? {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key}</span>

                <Badge>{value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.recentInvoices.map((invoice) => (
              <Link
                href={`/invoices/${invoice.id}/edit`}
                key={invoice.id}
                className="flex justify-between border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-sm"
              >
                <div>
                  <p className="font-semibold">{invoice.invoiceNumber}</p>

                  <p className="text-sm text-muted-foreground">
                    {invoice.customer.name}
                  </p>
                </div>

                <div className="text-right">
                  <StatusBadge status={invoice.status} />

                  <p className="mt-1 text-sm font-semibold">
                    Rp {Number(invoice.total).toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />

            <CardTitle>Top Customers</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.topCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-semibold">{customer.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {customer.companyName}
                  </p>
                </div>

                <span className="font-semibold">
                  Rp {customer.total.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock3 className="h-5 w-5 text-blue-500" />

            <CardTitle>Top Products</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.topProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {product.code}
                  </p>
                </div>

                <Badge>{product.qty} Sold</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
