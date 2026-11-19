import { OrdersView } from "@/components/account-views"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Pesanan saya" }

export default function Page() {
  return <OrdersView />
}
