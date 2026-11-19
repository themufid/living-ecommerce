import { zoneOf } from "@/lib/regions"
import type { CartLine, Product, Voucher } from "@/lib/types"

export const vouchers: Voucher[] = [
  {
    code: "RUMAH10",
    type: "percent",
    amount: 10,
    maxDiscount: 2_000_000,
    minSubtotal: 5_000_000,
    label: "10% untuk pembelian di atas Rp5.000.000, maksimal Rp2.000.000",
  },
  {
    code: "LIVING15",
    type: "percent",
    amount: 15,
    maxDiscount: 3_500_000,
    minSubtotal: 12_000_000,
    label: "15% untuk belanja di atas Rp12.000.000, maksimal Rp3.500.000",
  },
  {
    code: "STUDIO500",
    type: "flat",
    amount: 500_000,
    maxDiscount: 500_000,
    minSubtotal: 8_000_000,
    label: "Potongan Rp500.000 untuk belanja di atas Rp8.000.000",
  },
]

export const paymentMethods = [
  {
    id: "transfer" as const,
    name: "Transfer bank",
    description: "BCA, Mandiri, atau BNI. Nomor rekening ditampilkan sebagai simulasi.",
  },
  {
    id: "qris" as const,
    name: "QRIS",
    description: "Kode QR digambar di halaman ini dan tidak terhubung ke jaringan pembayaran.",
  },
  {
    id: "va" as const,
    name: "Virtual account",
    description: "Nomor virtual account dibuat di peramban, bukan dari bank.",
  },
  {
    id: "kartu" as const,
    name: "Kartu debit / kredit",
    description: "Formulir hanya memeriksa format. Tidak ada otorisasi kartu.",
  },
]

export function saleIsLive(flashEndsAt: string, now = Date.now()) {
  return new Date(flashEndsAt).getTime() > now
}

export function unitPrice(product: Product, flashEndsAt: string, now = Date.now()) {
  if (product.flashPrice && saleIsLive(flashEndsAt, now)) return product.flashPrice
  return product.price
}

export function voucherResult(code: string | null, subtotal: number) {
  if (!code) return { discount: 0, error: null as string | null, voucher: null as Voucher | null }
  const voucher = vouchers.find((item) => item.code === code.trim().toUpperCase())
  if (!voucher) return { discount: 0, error: "Kode voucher tidak dikenal.", voucher: null }
  if (subtotal < voucher.minSubtotal) {
    return {
      discount: 0,
      error: `Voucher berlaku untuk belanja minimal ${voucher.minSubtotal.toLocaleString("id-ID")}.`,
      voucher,
    }
  }
  const raw = voucher.type === "percent" ? Math.round((subtotal * voucher.amount) / 100) : voucher.amount
  return { discount: Math.min(raw, voucher.maxDiscount, subtotal), error: null, voucher }
}

export type ShippingOption = {
  id: string
  name: string
  eta: string
  cost: number
  detail: string
}

export function shippingOptions(province: string, subtotal: number): ShippingOption[] {
  const zone = zoneOf(province)
  const regular = zone === 1 ? 85_000 : zone === 2 ? 165_000 : 245_000
  const freeRegular = subtotal >= 15_000_000
  return [
    {
      id: "white-glove",
      name: "Atelier White Glove",
      eta: zone === 1 ? "5–8 hari kerja" : "8–14 hari kerja",
      cost: 350_000 + (zone - 1) * 120_000,
      detail: "Pengiriman, perakitan, dan penempatan oleh tim studio.",
    },
    {
      id: "regular",
      name: "Ekspedisi reguler",
      eta: zone === 1 ? "2–4 hari kerja" : zone === 2 ? "4–7 hari kerja" : "6–10 hari kerja",
      cost: freeRegular ? 0 : regular,
      detail: freeRegular
        ? "Ongkir reguler kami tanggung untuk pesanan di atas Rp15.000.000."
        : "Pengiriman standar dengan asuransi kerusakan.",
    },
    {
      id: "express",
      name: "Ekspedisi ekspres",
      eta: zone === 1 ? "1–2 hari kerja" : "2–4 hari kerja",
      cost: Math.round(regular * 1.85),
      detail: "Prioritas keberangkatan dari gudang studio.",
    },
    {
      id: "pickup",
      name: "Ambil di studio",
      eta: "Siap dalam 2 hari kerja",
      cost: 0,
      detail: "Studio Atelier Living, Kebayoran Baru, Jakarta Selatan.",
    },
  ]
}

export function selectedLines(cart: CartLine[]) {
  return cart.filter((line) => line.selected)
}
