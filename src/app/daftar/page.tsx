import { RegisterView } from "@/components/account-views"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Daftar" }

export default function Page() {
  return <RegisterView />
}
