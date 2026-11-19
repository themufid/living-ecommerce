import { SiteShell } from "@/components/chrome"
import { StoreProvider } from "@/lib/store"
import type { Metadata } from "next"
import { Cormorant_Garamond, Outfit } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
})

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: {
    default: "Atelier Living",
    template: "%s — Atelier Living",
  },
  description: "Thoughtfully designed furniture to transform your living experience.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="min-h-full bg-ivory font-sans text-charcoal antialiased">
        <a href="#isi" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2">
          Loncat ke isi
        </a>
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  )
}
