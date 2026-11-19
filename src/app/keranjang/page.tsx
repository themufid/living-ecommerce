import { CartView } from "@/components/cart-view"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Keranjang" }

export default function Page() {
  return <CartView />
}
