import { LoginView } from "@/components/account-views"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = { title: "Masuk" }

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" />}>
      <LoginView />
    </Suspense>
  )
}
