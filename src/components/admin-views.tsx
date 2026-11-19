"use client"

import { Button, Field, SelectInput, TextArea, TextInput } from "@/components/ui"
import { formatDate, orderStatusOptions, rupiah, slugify, statusLabel } from "@/lib/format"
import { useStore } from "@/lib/store"
import type { Category, OrderStatus, Product, ProductKind } from "@/lib/types"
import Link from "next/link"
import { useMemo, useState } from "react"

export function DashboardView() {
  const store = useStore()
  const realOrders = store.orders.filter((order) => !order.illustration && order.status !== "dibatalkan")
  const illustrated = store.orders.filter((order) => order.illustration)
  const revenue = (orders: typeof store.orders) => orders.reduce((sum, order) => sum + order.total, 0)
  const customers = store.directory.filter((user) => user.role === "customer")
  return (
    <div>
      <h1 className="font-serif text-5xl">Ringkasan</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Angka ilustrasi berasal dari pesanan presentasi dan diberi tanda. Pesanan yang dibuat lewat checkout tercatat terpisah. Semua data ada di peramban ini, tanpa server database.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Produk" value={String(store.products.length)} />
        <Stat label="Pelanggan" value={String(customers.length)} />
        <Stat label="Pesanan sesi ini" value={String(realOrders.length)} hint={rupiah(revenue(realOrders))} />
        <Stat label="Ilustrasi" value={String(illustrated.length)} hint={rupiah(revenue(illustrated))} />
      </div>
      <div className="mt-8 border border-sand bg-paper p-5">
        <h2 className="font-serif text-3xl">Penjualan 6 bulan</h2>
        <SalesChart />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="line" onClick={() => store.exportData()}>
          Unduh data
        </Button>
        <label className="inline-flex min-h-11 cursor-pointer items-center border border-sand px-4 text-sm">
          Pulihkan berkas
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              const result = store.importData(await file.text())
              store.notify(result.ok ? "Data dipulihkan." : result.error)
            }}
          />
        </label>
        <Button
          variant="ghost"
          onClick={async () => {
            if (confirm("Katalog dan pesanan di peramban ini dikembalikan ke awal?")) {
              await store.resetStore()
              store.notify("Data awal dimuat kembali.")
            }
          }}
        >
          Muat ulang data awal
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="border border-sand bg-paper p-4">
      <p className="text-xs tracking-[0.16em] text-muted uppercase">{label}</p>
      <p className="mt-2 font-sans text-4xl tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </article>
  )
}

export function SalesChart() {
  const store = useStore()
  const [includeIllustration, setIncludeIllustration] = useState(true)
  const months = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const total = store.orders
        .filter((order) => (includeIllustration || !order.illustration) && order.status !== "dibatalkan")
        .filter((order) => {
          const created = new Date(order.createdAt)
          return `${created.getFullYear()}-${created.getMonth()}` === key
        })
        .reduce((sum, order) => sum + order.total, 0)
      return {
        key,
        label: date.toLocaleDateString("id-ID", { month: "short" }),
        total,
      }
    })
  }, [store.orders, includeIllustration])
  const max = Math.max(...months.map((month) => month.total), 1)
  return (
    <div>
      <label className="mt-2 flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={includeIllustration} onChange={(event) => setIncludeIllustration(event.target.checked)} />
        Sertakan ilustrasi
      </label>
      <div className="mt-4 flex h-52 items-end gap-3">
        {months.map((month) => (
          <div key={month.key} className="flex h-full flex-1 flex-col justify-end gap-2">
            <div className="bg-walnut" style={{ height: `${Math.max(4, (month.total / max) * 100)}%` }} />
            <p className="text-center text-xs text-muted">{month.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductsAdmin() {
  const store = useStore()
  const [q, setQ] = useState("")
  const products = store.products.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <h1 className="font-serif text-5xl">Produk</h1>
        <Link href="/admin/produk/baru">
          <Button>Tambah produk</Button>
        </Link>
      </div>
      <TextInput className="mt-5 max-w-sm" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Cari nama" aria-label="Cari produk" />
      <div className="mt-4 overflow-x-auto border border-sand bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-3 py-3">Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Rating</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-sand">
                <td className="px-3 py-3">
                  <p>{product.name}</p>
                  <p className="text-xs text-muted">{store.categories.find((item) => item.id === product.categoryId)?.name}</p>
                </td>
                <td>{rupiah(store.priceOf(product))}</td>
                <td>{product.stock}</td>
                <td>{product.rating.toFixed(1)}</td>
                <td className="px-3 text-right">
                  <Link href={`/admin/produk/${product.id}`} className="text-walnut">
                    Ubah
                  </Link>
                  <button
                    type="button"
                    className="ml-3 text-muted"
                    onClick={() => {
                      if (confirm(`Hapus ${product.name}?`)) store.deleteProduct(product.id)
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const kinds: ProductKind[] = ["sofa", "chair", "table", "bed", "lamp", "storage", "decor"]

function blankProduct(categoryId: string): Product {
  return {
    id: crypto.randomUUID(),
    slug: "",
    name: "",
    categoryId,
    price: 0,
    compareAtPrice: null,
    flashPrice: null,
    rating: 5,
    reviewCount: 0,
    stock: 1,
    popularity: 50,
    createdAt: new Date().toISOString(),
    isNew: true,
    isBestSeller: false,
    images: [""],
    description: "",
    details: "",
    material: "",
    dimensions: "",
    specs: [
      { label: "Bahan", value: "" },
      { label: "Dimensi", value: "" },
    ],
    colors: [{ name: "Walnut", hex: "#6b4f3a" }],
    sku: "",
    weightKg: 1,
    kind: "sofa",
    modelUrl: null,
  }
}

export function ProductEditor({ productId }: { productId?: string }) {
  const store = useStore()
  const existing = store.products.find((item) => item.id === productId)
  const [product, setProduct] = useState<Product>(existing ?? blankProduct(store.categories[0]?.id ?? ""))
  const [error, setError] = useState("")
  const set = (patch: Partial<Product>) => setProduct((current) => ({ ...current, ...patch }))
  return (
    <form
      className="grid max-w-3xl gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const result = store.saveProduct({
          ...product,
          slug: product.slug || slugify(product.name),
          specs: [
            { label: "SKU", value: product.sku },
            { label: "Bahan", value: product.material },
            { label: "Dimensi", value: product.dimensions },
            { label: "Berat kirim", value: `${product.weightKg} kg` },
          ],
        })
        setError(result.ok ? "" : result.error)
        if (result.ok) store.notify("Produk disimpan.")
      }}
    >
      <h1 className="font-serif text-5xl">{existing ? "Ubah produk" : "Produk baru"}</h1>
      <Field label="Nama">
        <TextInput
          value={product.name}
          onChange={(event) => set({ name: event.target.value, slug: product.slug || slugify(event.target.value) })}
        />
      </Field>
      <Field label="Slug">
        <TextInput value={product.slug} onChange={(event) => set({ slug: slugify(event.target.value) })} />
      </Field>
      <Field label="Kategori">
        <SelectInput value={product.categoryId} onChange={(event) => set({ categoryId: event.target.value })}>
          {store.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Harga">
          <TextInput type="number" value={product.price} onChange={(event) => set({ price: Number(event.target.value) })} />
        </Field>
        <Field label="Harga coret">
          <TextInput
            type="number"
            value={product.compareAtPrice ?? ""}
            onChange={(event) => set({ compareAtPrice: event.target.value ? Number(event.target.value) : null })}
          />
        </Field>
        <Field label="Harga flash">
          <TextInput
            type="number"
            value={product.flashPrice ?? ""}
            onChange={(event) => set({ flashPrice: event.target.value ? Number(event.target.value) : null })}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Stok">
          <TextInput type="number" value={product.stock} onChange={(event) => set({ stock: Number(event.target.value) })} />
        </Field>
        <Field label="Rating">
          <TextInput type="number" step="0.1" min={0} max={5} value={product.rating} onChange={(event) => set({ rating: Number(event.target.value) })} />
        </Field>
        <Field label="Popularitas">
          <TextInput type="number" value={product.popularity} onChange={(event) => set({ popularity: Number(event.target.value) })} />
        </Field>
      </div>
      <Field label="Bentuk 3D">
        <SelectInput value={product.kind} onChange={(event) => set({ kind: event.target.value as ProductKind })}>
          {kinds.map((kind) => (
            <option key={kind}>{kind}</option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Bahan">
        <TextInput value={product.material} onChange={(event) => set({ material: event.target.value })} />
      </Field>
      <Field label="Dimensi">
        <TextInput value={product.dimensions} onChange={(event) => set({ dimensions: event.target.value })} />
      </Field>
      <Field label="SKU">
        <TextInput value={product.sku} onChange={(event) => set({ sku: event.target.value })} />
      </Field>
      <Field label="Deskripsi singkat">
        <TextArea value={product.description} onChange={(event) => set({ description: event.target.value })} />
      </Field>
      <Field label="Deskripsi panjang">
        <TextArea value={product.details} onChange={(event) => set({ details: event.target.value })} />
      </Field>
      <Field label="URL gambar, satu per baris">
        <TextArea value={product.images.join("\n")} onChange={(event) => set({ images: event.target.value.split("\n") })} />
      </Field>
      <Field label="URL model GLB, opsional">
        <TextInput value={product.modelUrl ?? ""} onChange={(event) => set({ modelUrl: event.target.value || null })} />
      </Field>
      <div className="flex gap-4 text-sm">
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={product.isNew} onChange={(event) => set({ isNew: event.target.checked })} /> Baru
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={product.isBestSeller} onChange={(event) => set({ isBestSeller: event.target.checked })} /> Laris
        </label>
      </div>
      <div>
        <p className="text-xs tracking-[0.16em] text-muted uppercase">Warna</p>
        {product.colors.map((color, index) => (
          <div key={index} className="mt-2 grid grid-cols-[1fr_120px_auto] gap-2">
            <TextInput
              value={color.name}
              onChange={(event) => {
                const colors = product.colors.slice()
                colors[index] = { ...color, name: event.target.value }
                set({ colors })
              }}
            />
            <TextInput
              value={color.hex}
              onChange={(event) => {
                const colors = product.colors.slice()
                colors[index] = { ...color, hex: event.target.value }
                set({ colors })
              }}
            />
            <button type="button" className="min-h-11 px-2 text-sm" onClick={() => set({ colors: product.colors.filter((_, item) => item !== index) })}>
              Hapus
            </button>
          </div>
        ))}
        <button type="button" className="mt-2 text-sm text-walnut" onClick={() => set({ colors: [...product.colors, { name: "Baru", hex: "#c4a574" }] })}>
          Tambah warna
        </button>
      </div>
      {error ? <p className="text-sm text-bark">{error}</p> : null}
      <Button type="submit">Simpan produk</Button>
    </form>
  )
}

function CategoryRow({ category }: { category: Category }) {
  const store = useStore()
  const [draft, setDraft] = useState(category)
  return (
    <form
      className="grid gap-3 border border-sand bg-paper p-4 md:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault()
        const result = store.saveCategory({ ...draft, slug: slugify(draft.slug || draft.name) })
        store.notify(result.ok ? "Kategori disimpan." : result.error)
      }}
    >
      <TextInput value={draft.name} aria-label="Nama kategori" onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
      <TextInput value={draft.slug} aria-label="Slug" onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
      <TextInput value={draft.tagline} aria-label="Kalimat" onChange={(event) => setDraft({ ...draft, tagline: event.target.value })} />
      <div className="flex gap-2">
        <Button type="submit" variant="line">
          Simpan
        </Button>
        <button
          type="button"
          className="text-sm text-muted"
          onClick={() => {
            const result = store.deleteCategory(category.id)
            if (!result.ok) store.notify(result.error)
          }}
        >
          Hapus
        </button>
      </div>
    </form>
  )
}

export function CategoriesAdmin() {
  const store = useStore()
  const [draft, setDraft] = useState<Category>({ id: "", slug: "", name: "", tagline: "", image: "" })
  const [error, setError] = useState("")
  return (
    <div>
      <h1 className="font-serif text-5xl">Kategori</h1>
      <div className="mt-6 grid gap-3">
        {store.categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </div>
      <form
        className="mt-8 grid max-w-xl gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const result = store.saveCategory({ ...draft, id: crypto.randomUUID(), slug: draft.slug || slugify(draft.name) })
          setError(result.ok ? "" : result.error)
          if (result.ok) setDraft({ id: "", slug: "", name: "", tagline: "", image: "" })
        }}
      >
        <h2 className="font-serif text-3xl">Kategori baru</h2>
        <TextInput value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nama" aria-label="Nama kategori baru" />
        <TextInput value={draft.tagline} onChange={(event) => setDraft({ ...draft, tagline: event.target.value })} placeholder="Kalimat singkat" aria-label="Kalimat kategori" />
        <TextInput value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="URL gambar" aria-label="Gambar kategori" />
        {error ? <p className="text-sm text-bark">{error}</p> : null}
        <Button type="submit">Tambah kategori</Button>
      </form>
    </div>
  )
}

export function OrdersAdmin() {
  const store = useStore()
  return (
    <div>
      <h1 className="font-serif text-5xl">Pesanan</h1>
      <div className="mt-6 overflow-x-auto border border-sand bg-paper">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-3 py-3">Nomor</th>
              <th>Pembeli</th>
              <th>Total</th>
              <th>Tanda</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {store.orders.map((order) => (
              <tr key={order.id} className="border-t border-sand">
                <td className="px-3 py-3">
                  <Link href={`/pesanan/${order.id}`} className="text-walnut">
                    {order.number}
                  </Link>
                  <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                </td>
                <td>
                  {order.customer.name}
                  <p className="text-xs text-muted">{order.customer.email}</p>
                </td>
                <td>{rupiah(order.total)}</td>
                <td>{order.illustration ? "Ilustrasi" : "Sesi ini"}</td>
                <td className="px-3">
                  <select
                    className="min-h-11 border border-sand bg-ivory px-2"
                    value={order.status}
                    onChange={(event) => store.updateOrderStatus(order.id, event.target.value as OrderStatus)}
                  >
                    {orderStatusOptions().map((status) => (
                      <option key={status} value={status}>
                        {statusLabel[status]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CustomersAdmin() {
  const store = useStore()
  const customers = store.directory.filter((user) => user.role === "customer")
  return (
    <div>
      <h1 className="font-serif text-5xl">Pelanggan</h1>
      <div className="mt-6 divide-y divide-sand border-y border-sand bg-paper">
        {customers.map((customer) => {
          const orders = store.orders.filter((order) => order.userId === customer.id)
          return (
            <article key={customer.id} className="grid gap-1 px-4 py-4 text-sm md:grid-cols-4">
              <p className="font-medium">{customer.name}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <p className="text-muted">{orders.length} pesanan · sejak {formatDate(customer.createdAt)}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function MessagesAdmin() {
  const store = useStore()
  return (
    <div>
      <h1 className="font-serif text-5xl">Pesan</h1>
      <div className="mt-6 space-y-4">
        {store.messages.map((message) => (
          <article key={message.id} className="border border-sand bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-2xl">{message.topic}</h2>
              <span className="text-xs text-muted">{formatDate(message.createdAt)} · {message.read ? "dibaca" : "baru"}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {message.name} · {message.email}
            </p>
            <p className="mt-3 text-sm leading-6">{message.message}</p>
            {!message.read ? (
              <button type="button" className="mt-3 text-sm text-walnut" onClick={() => store.markMessageRead(message.id)}>
                Tandai dibaca
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}

export function ReportView() {
  const store = useStore()
  const [from, setFrom] = useState("2026-08-01")
  const [to, setTo] = useState("2026-12-31")
  const rows = store.orders.filter((order) => {
    const day = order.createdAt.slice(0, 10)
    return day >= from && day <= to && order.status !== "dibatalkan"
  })
  const total = rows.reduce((sum, order) => sum + order.total, 0)
  const download = () => {
    const header = ["nomor", "tanggal", "pembeli", "status", "total", "tanda"]
    const body = rows.map((order) => [order.number, order.createdAt, order.customer.name, statusLabel[order.status], String(order.total), order.illustration ? "ilustrasi" : "sesi"])
    const csv = [header, ...body].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "laporan-atelier.csv"
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div>
      <h1 className="font-serif text-5xl">Laporan</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Field label="Dari">
          <TextInput type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </Field>
        <Field label="Sampai">
          <TextInput type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </Field>
      </div>
      <p className="mt-4 text-sm">
        {rows.length} pesanan · {rupiah(total)} termasuk ilustrasi di rentang ini.
      </p>
      <div className="mt-4">
        <SalesChart />
      </div>
      <Button variant="line" className="mt-4" onClick={download}>
        Unduh CSV
      </Button>
      <h2 className="mt-10 font-serif text-3xl">Surat studio</h2>
      <ul className="mt-3 text-sm text-muted">
        {store.newsletter.map((email) => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </div>
  )
}
