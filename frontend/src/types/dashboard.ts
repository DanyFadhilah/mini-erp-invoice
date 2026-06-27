export interface DashboardSummary {
  stats: DashboardStats;
  invoiceStatus: InvoiceStatusSummary;
  recentInvoices: RecentInvoice[];
  monthlyRevenue: MonthlyRevenue[];
  topCustomers: TopCustomer[];
  topProducts: TopProduct[];
}

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalInvoices: number;
  totalRevenue: number;
}

export interface InvoiceStatusSummary {
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  cancelled: number;
}

export interface RecentInvoice {
  id: number;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  subtotal: string;
  total: string;
  notes: string | null;

  customer: {
    id: number;
    name: string;
    companyName: string;
  };
}

export interface MonthlyRevenue {
  issueDate: string;

  _sum: {
    total: string | null;
  };
}

export interface TopCustomer {
  id: number;
  name: string;
  companyName: string;
  total: number;
}

export interface TopProduct {
  id: number;
  name: string;
  code: string;
  qty: number;
}
