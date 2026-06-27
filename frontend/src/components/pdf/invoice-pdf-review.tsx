import { Customer } from "@/types/customer";
import { InvoiceStatus } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/lib/format";

type InvoiceItem = {
  productId: number;
  productName: string;
  productCode: string;
  qty: number;
  price: number;
  amount: number;
};

interface InvoicePdfProps {
  invoiceNumber?: string;
  customer?: Customer;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
}

const STATUS_BADGE_CLASS = {
  DRAFT: "bg-slate-100 text-slate-700 border border-slate-300",
  SENT: "bg-blue-100 text-blue-700 border border-blue-300",
  PAID: "bg-green-100 text-green-700 border border-green-300",
  OVERDUE: "bg-red-100 text-red-700 border border-red-300",
  CANCELLED: "bg-gray-100 text-gray-600 border border-gray-300",
} as const;

export function InvoicePdf({
  invoiceNumber,
  customer,
  issueDate,
  dueDate,
  status,
  notes,
  items,
  subtotal,
  total,
}: InvoicePdfProps) {
  return (
    <div className="md:sticky top-[73px]">
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-2xl font-black tracking-tight text-gray-900">
              INVOICE
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-sm">
              Mini ERP Invoice
            </p>
            <p className="text-xs text-gray-500 mt-1">Jl. Parungkuda No. 123</p>
            <p className="text-xs text-gray-500">Sukabumi, Indonesia</p>
            <p className="text-xs text-gray-500">
              Email: info@minierpinvoice.com
            </p>
            <p className="text-xs text-gray-500">Telp: 082174767768</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-5" />

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Bill To:</p>
            {customer ? (
              <>
                <p className="font-semibold text-gray-900 text-sm">
                  {customer.name}
                </p>
                {customer.companyName && (
                  <p className="text-xs text-gray-600">
                    {customer.companyName}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Email: {customer.email}
                </p>
                <p className="text-xs text-gray-500">Telp: {customer.phone}</p>
                {customer.address && (
                  <p className="text-xs text-gray-500">
                    Address: {customer.address}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No customer selected
              </p>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice Number</span>
              <span className="font-medium text-gray-900">
                {invoiceNumber ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issue Date</span>
              <span className="font-medium text-gray-900">
                {issueDate ? formatDate(issueDate) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Due Date</span>
              <span className="font-medium text-gray-900">
                {dueDate ? formatDate(dueDate) : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_BADGE_CLASS[status]}`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        <table className="w-full text-xs mb-4">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="text-left py-2 px-3 font-medium rounded-tl-md">
                No.
              </th>
              <th className="text-left py-2 px-3 font-medium">Product</th>
              <th className="text-center py-2 px-3 font-medium">Qty</th>
              <th className="text-right py-2 px-3 font-medium">Price</th>
              <th className="text-right py-2 px-3 font-medium rounded-tr-md">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-400 italic"
                >
                  No items added yet
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 text-gray-500">{index + 1}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-medium text-gray-900">
                      {item.productName || "—"}
                    </p>
                    {item.productCode && (
                      <p className="text-gray-400">{item.productCode}</p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center text-gray-700">
                    {item.qty}
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-700">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-56 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-white bg-gray-900 px-2 py-1.5 rounded">
              <span>Total</span>
              <span className="text-white">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-1">Notes</p>
            <p className="text-xs text-gray-500">{notes}</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs font-semibold text-gray-700">
            Thank you for your business!
          </p>
          <p className="text-[10px] text-gray-400">
            This is a computer generated invoice.
          </p>
        </div>
      </div>
    </div>
  );
}
