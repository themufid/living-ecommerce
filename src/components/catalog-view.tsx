"use client"

import { ProductCard } from "@/components/product-card"
import { Button, EmptyState, PageIntro, SelectInput, TextInput } from "@/components/ui"
import { rupiah } from "@/lib/format"
import { flashActive, useStore } from "@/lib/store"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

const sorts = [
  { id: "populer", label: "Popularitas" },
  { id: "baru", label: "Terbaru" },
  { id: "harga-naik", label: "Harga terendah" },
  { id: "harga-turun", label: "Harga tertinggi" },
  { id: "rating", label: "Rating" },
]

export function CatalogView() {
  const store = useStore()
  const params = useSearchParams()
  const router = useRouter()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const q = params.get("q") ?? ""
  const category = params.get("kategori") ?? ""
  const sort = params.get("urut") ?? "populer"
  const min = params.get("min") ?? ""
  const max = params.get("max") ?? ""
  const badge = params.get("tandai") ?? ""
  const stock = params.get("stok") ?? ""

  const setParams = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString())
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) next.delete(key)
      else next.set(key, value)
    })
    router.replace(`/koleksi?${next.toString()}`, { scroll: false })
  }

  const products = useMemo(() => {
    const minValue = Number(min) || 0
    const maxValue = Number(max) || 0
    const categoryId = store.categories.find((item) => item.slug === category)?.id
    const live = flashActive(store.flashEndsAt)
    const filtered = store.products.filter((product) => {
      const price = store.priceOf(product)
      const haystack = `${product.name} ${product.material} ${product.description}`.toLowerCase()
      if (q && !haystack.includes(q.toLowerCase())) return false
      if (categoryId && product.categoryId !== categoryId) return false
      if (minValue && price < minValue) return false
      if (maxValue && price > maxValue) return false
      if (badge === "baru" && !product.isNew) return false
      if (badge === "laris" && !product.isBestSeller) return false
      if (badge === "flash" && !(product.flashPrice && live)) return false
      if (stock === "tersedia" && product.stock <= 0) return false
      return true
    })
    const sorted = [...filtered]
    sorted.sort((a, b) => {
      if (sort === "harga-naik") return store.priceOf(a) - store.priceOf(b)
      if (sort === "harga-turun") return store.priceOf(b) - store.priceOf(a)
      if (sort === "baru") return +new Date(b.createdAt) - +new Date(a.createdAt)
      if (sort === "rating") return b.rating - a.rating
      return b.popularity - a.popularity
    })
    return sorted
  }, [store, q, category, sort, min, max, badge, stock])

  const filters = (
    <div className="space-y-5">
      <label className="block text-sm">
        Cari
        <TextInput className="mt-2" value={q} onChange={(event) => setParams({ q: event.target.value })} placeholder="Nama, bahan, atau deskripsi" />
      </label>
      <div>
        <p className="text-sm">Kategori</p>
        <div className="mt-2 flex flex-col gap-1">
          <FilterButton active={!category} onClick={() => setParams({ kategori: "" })}>
            Semua ruang
          </FilterButton>
          {store.categories.map((item) => (
            <FilterButton key={item.id} active={category === item.slug} onClick={() => setParams({ kategori: item.slug })}>
              {item.name}
            </FilterButton>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          Harga min
          <TextInput className="mt-2" inputMode="numeric" value={min} onChange={(event) => setParams({ min: event.target.value.replace(/\D/g, "") })} placeholder="0" />
        </label>
        <label className="text-sm">
          Harga maks
          <TextInput className="mt-2" inputMode="numeric" value={max} onChange={(event) => setParams({ max: event.target.value.replace(/\D/g, "") })} placeholder="30000000" />
        </label>
      </div>
      <div>
        <p className="text-sm">Koleksi</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterButton active={!badge} onClick={() => setParams({ tandai: "" })}>
            Semua
          </FilterButton>
          <FilterButton active={badge === "baru"} onClick={() => setParams({ tandai: "baru" })}>
            New arrivals
          </FilterButton>
          <FilterButton active={badge === "laris"} onClick={() => setParams({ tandai: "laris" })}>
            Best sellers
          </FilterButton>
          <FilterButton active={badge === "flash"} onClick={() => setParams({ tandai: "flash" })}>
            Flash sale
          </FilterButton>
        </div>
      </div>
      <FilterButton active={stock === "tersedia"} onClick={() => setParams({ stok: stock === "tersedia" ? "" : "tersedia" })}>
        Hanya yang tersedia
      </FilterButton>
      <button type="button" className="text-sm text-walnut" onClick={() => router.replace("/koleksi")}>
        Atur ulang filter
      </button>
    </div>
  )

  return (
    <div className="pb-16">
      <PageIntro eyebrow="Koleksi" title="Furnitur untuk rumah yang tenang." text="Saring menurut ruang, harga, popularitas, atau kedatangan terbaru." />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[250px_1fr] md:px-8">
        <aside className="hidden md:block">{filters}</aside>
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">{products.length} produk</p>
            <div className="flex gap-2">
              <Button variant="line" className="md:hidden" onClick={() => setFiltersOpen(true)}>
                Filter
              </Button>
              <SelectInput aria-label="Urutkan" value={sort} onChange={(event) => setParams({ urut: event.target.value })} className="w-48">
                {sorts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>
          {products.length === 0 ? (
            <EmptyState title="Tidak ada yang cocok" text="Longgarkan harga atau ganti kata pencarian." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {(min || max) && (
            <p className="mt-6 text-xs text-muted">
              Rentang harga {min ? rupiah(Number(min)) : "Rp0"} – {max ? rupiah(Number(max)) : "tanpa batas"}
            </p>
          )}
        </div>
      </div>
      {filtersOpen ? (
        <div className="fixed inset-0 z-50 bg-ivory md:hidden">
          <div className="flex items-center justify-between border-b border-sand px-4 py-3">
            <h2 className="font-serif text-3xl">Filter</h2>
            <button type="button" className="min-h-11 px-3" onClick={() => setFiltersOpen(false)}>
              Tutup
            </button>
          </div>
          <div className="overflow-auto px-4 py-5">{filters}</div>
        </div>
      ) : null}
    </div>
  )
}

function FilterButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 px-3 text-left text-sm ${active ? "bg-charcoal text-ivory" : "bg-paper text-charcoal"}`}
    >
      {children}
    </button>
  )
}
