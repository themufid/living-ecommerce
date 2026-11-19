import { CheckoutView } from "@/components/checkout-view"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Checkout" }

export default function Page() {
  return <CheckoutView />
}
