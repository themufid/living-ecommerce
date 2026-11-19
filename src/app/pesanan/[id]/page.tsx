import { OrderView } from "@/components/order-view"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Pesanan" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderView id={id} />
}
