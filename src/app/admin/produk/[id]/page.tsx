import { ProductEditor } from "@/components/admin-views"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductEditor productId={id} />
}
