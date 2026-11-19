"use client"

import { Photo } from "@/components/photo"
import { PriceTag, Stars, StockNote } from "@/components/ui"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import Link from "next/link"

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const store = useStore()
  const category = store.categories.find((item) => item.id === product.categoryId)
  const saved = store.wishlist.includes(product.id)
  const price = store.priceOf(product)
  const onSale = product.flashPrice !== null && price === product.flashPrice
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Link href={`/produk/${product.slug}`} className="absolute inset-0">
          <Photo
            src={product.images[0] ?? ""}
            alt={product.name}
            priority={priority}
            className="transition duration-700 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-2">
          {onSale ? <span className="bg-charcoal px-2 py-1 text-[10px] tracking-[0.16em] text-ivory uppercase">Flash sale</span> : null}
          {product.isNew ? <span className="bg-paper/90 px-2 py-1 text-[10px] tracking-[0.16em] uppercase">Baru</span> : null}
        </div>
        <button
          type="button"
          aria-label={saved ? "Hapus dari simpanan" : "Simpan produk"}
          onClick={() => store.toggleWishlist(product.id)}
          className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center bg-paper/90 text-lg"
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="pt-4">
        <p className="text-[11px] tracking-[0.18em] text-muted uppercase">{category?.name}</p>
        <h3 className="mt-1 font-serif text-2xl leading-tight">
          <Link href={`/produk/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="mt-2">
          <Stars value={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-2">
          <PriceTag product={product} price={price} />
        </div>
        <div className="mt-1">
          <StockNote stock={product.stock} />
        </div>
        <Link href={`/produk/${product.slug}`} className="mt-3 inline-flex min-h-11 items-center text-sm tracking-wide text-walnut">
          Lihat detail
        </Link>
      </div>
    </article>
  )
}
