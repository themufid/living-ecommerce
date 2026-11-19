import type { OrderStatus, PaymentMethod } from "@/lib/types"

export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export const statusLabel: Record<OrderStatus, string> = {
  menunggu_pembayaran: "Menunggu pembayaran",
  dibayar: "Pembayaran tercatat",
  diproses: "Sedang disiapkan",
  dikirim: "Dalam pengiriman",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

export const paymentLabel: Record<PaymentMethod, string> = {
  transfer: "Transfer bank",
  qris: "QRIS",
  va: "Virtual account",
  kartu: "Kartu debit / kredit",
}

export function orderStatusOptions(): OrderStatus[] {
  return [
    "menunggu_pembayaran",
    "dibayar",
    "diproses",
    "dikirim",
    "selesai",
    "dibatalkan",
  ]
}
