export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function formatCurrencyInput(value: number | string) {
  if (!value) return "";

  return Number(value).toLocaleString("id-ID");
}

export function parseCurrencyInput(value: string) {
  return Number(value.replaceAll(".", ""));
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
