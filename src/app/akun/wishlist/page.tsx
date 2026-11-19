import { WishlistView } from "@/components/account-views"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Wishlist" }

export default function Page() {
  return <WishlistView />
}
