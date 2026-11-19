import { ProductView } from "@/components/product-view"
import { seedProducts } from "@/lib/catalog"
import type { Metadata } from "next"

export function generateStaticParams() {
  return seedProducts.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = seedProducts.find((item) => item.slug === slug)
  return { title: product?.name ?? "Produk" }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductView slug={slug} />
}
