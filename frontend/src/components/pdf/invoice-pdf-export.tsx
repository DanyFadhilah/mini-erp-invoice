import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { Invoice } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/lib/format";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    position: "relative",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  company: {
    textAlign: "right",
    fontSize: 10,
    color: "#666",
  },

  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  customer: {
    width: "55%",
  },

  info: {
    width: "40%",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111827",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  no: {
    width: "8%",
  },

  product: {
    width: "42%",
  },

  qty: {
    width: "10%",
    textAlign: "center",
  },

  price: {
    width: "20%",
    textAlign: "right",
  },

  amount: {
    width: "20%",
    textAlign: "right",
  },

  summary: {
    marginTop: 20,
    alignItems: "flex-end",
  },

  totalBox: {
    width: 180,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  total: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },

  totalRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#101828",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 6,
  },

  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },

  notes: {
    marginTop: 30,
    fontSize: 10,
    color: "#666",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#9CA3AF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
});

export function InvoicePdfExport({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>

          <View style={styles.company}>
            <Text>Mini ERP Invoice</Text>
            <Text>Jl. Parungkuda No.123</Text>
            <Text>Sukabumi</Text>
            <Text>info@minierpinvoice.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.customer}>
            <Text>Bill To</Text>

            <Text>{invoice.customer.name}</Text>

            {invoice.customer.companyName && (
              <Text>{invoice.customer.companyName}</Text>
            )}

            <Text>{invoice.customer.email}</Text>

            <Text>{invoice.customer.phone}</Text>

            <Text>{invoice.customer.address}</Text>
          </View>

          <View style={styles.info}>
            <View style={styles.row}>
              <Text>Invoice</Text>
              <Text>{invoice.invoiceNumber}</Text>
            </View>

            <View style={styles.row}>
              <Text>Issue</Text>
              <Text>{formatDate(invoice.issueDate)}</Text>
            </View>

            <View style={styles.row}>
              <Text>Due</Text>
              <Text>{formatDate(invoice.dueDate)}</Text>
            </View>

            <View style={styles.row}>
              <Text>Status</Text>
              <Text>{invoice.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.no}>No</Text>
          <Text style={styles.product}>Product</Text>
          <Text style={styles.qty}>Qty</Text>
          <Text style={styles.price}>Price</Text>
          <Text style={styles.amount}>Amount</Text>
        </View>

        {invoice.items.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.no}>{index + 1}</Text>

            <Text style={styles.product}>{item.product.name}</Text>

            <Text style={styles.qty}>{item.qty}</Text>

            <Text style={styles.price}>
              {formatCurrency(Number(item.price))}
            </Text>

            <Text style={styles.amount}>
              {formatCurrency(Number(item.amount))}
            </Text>
          </View>
        ))}

        <View style={styles.summary}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(invoice.subtotal)}</Text>
            </View>

            <View style={styles.totalRowHighlight}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.total)}
              </Text>
            </View>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>This is a computer generated invoice.</Text>
        </View>
      </Page>
    </Document>
  );
}
