import { CatalogView } from "@/components/catalog-view"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = { title: "Koleksi" }

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <CatalogView />
    </Suspense>
  )
}
