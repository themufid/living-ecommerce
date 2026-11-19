import { ProfileView } from "@/components/account-views"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Akun" }

export default function Page() {
  return <ProfileView />
}
