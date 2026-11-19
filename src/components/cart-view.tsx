"use client"

import { Photo } from "@/components/photo"
import { ProductCard } from "@/components/product-card"
import { Button, EmptyState, TextInput } from "@/components/ui"
import { rupiah } from "@/lib/format"
import { voucherResult } from "@/lib/commerce"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { useState } from "react"

export function CartView() {
  const store = useStore()
  const [code, setCode] = useState(store.voucherCode ?? "")
  const [error, setError] = useState("")
  const lines = store.cart.map((line) => ({
    line,
    product: store.products.find((item) => item.id === line.productId),
  }))
  const selected = lines.filter((item) => item.line.selected && item.product)
  const subtotal = selected.reduce((sum, item) => sum + store.priceOf(item.product!) * item.line.qty, 0)
  const voucher = voucherResult(store.voucherCode, subtotal)
  const allSelected = lines.length > 0 && lines.every((item) => item.line.selected)
  const suggested = [...store.products].sort((a, b) => b.popularity - a.popularity).slice(0, 4)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <EmptyState
          title="Keranjang masih kosong"
          text="Pilih potongan dari koleksi. Keranjang tersimpan di peramban ini."
          action={
            <Link href="/koleksi">
              <Button>Explore Collection</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1fr_320px] md:px-8">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-5xl">Keranjang</h1>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={allSelected} onChange={(event) => store.setAllSelected(event.target.checked)} />
            Pilih semua
          </label>
        </div>
        <div className="mt-6 divide-y divide-sand border-y border-sand">
          {lines.map(({ line, product }) => (
            <div key={line.id} className="grid grid-cols-[28px_96px_1fr] gap-3 py-5 sm:grid-cols-[28px_120px_1fr]">
              <input
                type="checkbox"
                className="mt-2 h-5 w-5"
                checked={line.selected}
                onChange={() => store.toggleLine(line.id)}
                aria-label={`Pilih ${product?.name ?? "produk"}`}
              />
              <div className="relative h-28 bg-sand sm:h-32">
                {product ? <Photo src={product.images[0] ?? ""} alt="" sizes="120px" /> : null}
              </div>
              <div>
                {product ? (
                  <Link href={`/produk/${product.slug}`} className="font-serif text-2xl">
                    {product.name}
                  </Link>
                ) : (
                  <p>Produk sudah tidak ada</p>
                )}
                <p className="text-sm text-muted">{line.color}</p>
                <p className="mt-1 text-sm">{product ? rupiah(store.priceOf(product)) : "—"}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" className="h-11 w-11 border border-sand" onClick={() => store.setQty(line.id, line.qty - 1)}>
                    −
                  </button>
                  <span className="w-8 text-center">{line.qty}</span>
                  <button type="button" className="h-11 w-11 border border-sand" onClick={() => store.setQty(line.id, line.qty + 1)}>
                    +
                  </button>
                  <button type="button" className="ml-auto text-sm text-muted" onClick={() => store.removeLine(line.id)}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h2 className="font-serif text-3xl">Mungkin Anda butuh ini</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {suggested.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <aside className="h-fit border border-sand bg-paper p-5">
        <h2 className="font-serif text-3xl">Ringkasan</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal terpilih</dt>
            <dd>{rupiah(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Voucher</dt>
            <dd>{voucher.discount ? `−${rupiah(voucher.discount)}` : "—"}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Ongkir</dt>
            <dd>Dihitung di checkout</dd>
          </div>
          <div className="flex justify-between border-t border-sand pt-3 text-base">
            <dt>Perkiraan</dt>
            <dd>{rupiah(Math.max(0, subtotal - voucher.discount))}</dd>
          </div>
        </dl>
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            const result = store.applyVoucher(code)
            setError(result.ok ? "" : result.error)
            if (result.ok) store.notify("Voucher dipakai.")
          }}
        >
          <TextInput value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Kode voucher" aria-label="Kode voucher" />
          {error ? <p className="text-sm text-bark">{error}</p> : null}
          {store.voucherCode ? <p className="text-sm text-walnut">Kode {store.voucherCode} aktif.</p> : null}
          <div className="flex gap-2">
            <Button type="submit" variant="line" className="flex-1">
              Pakai
            </Button>
            {store.voucherCode ? (
              <Button
                variant="ghost"
                onClick={() => {
                  store.clearVoucher()
                  setCode("")
                }}
              >
                Hapus
              </Button>
            ) : null}
          </div>
        </form>
        <Link href="/checkout" className={`mt-4 block ${selected.length === 0 ? "pointer-events-none opacity-40" : ""}`}>
          <Button className="w-full">Lanjut checkout</Button>
        </Link>
        <p className="mt-3 text-xs leading-5 text-muted">Hanya barang yang dicentang yang masuk ke pesanan. Keranjang tetap ada setelah halaman dimuat ulang.</p>
      </aside>
    </div>
  )
}
