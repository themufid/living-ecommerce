import { AboutView } from "@/components/content-views"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Studio" }

export default function Page() {
  return <AboutView />
}
