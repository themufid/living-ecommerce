"use client"

import { Photo } from "@/components/photo"
import { ProductCard } from "@/components/product-card"
import { Button, EmptyState, PriceTag, Stars, StockNote } from "@/components/ui"
import { useCanRender3D } from "@/components/use-3d"
import { flashActive, useStore } from "@/lib/store"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const ProductCanvas = dynamic(() => import("@/components/visuals").then((mod) => mod.ProductCanvas), { ssr: false })

export function ProductView({ slug }: { slug: string }) {
  const store = useStore()
  const router = useRouter()
  const can3d = useCanRender3D()
  const product = store.products.find((item) => item.slug === slug)
  const [image, setImage] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const [show3d, setShow3d] = useState(false)
  const [showModel, setShowModel] = useState(false)
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <EmptyState title="Produk tidak ada" text="Potongan ini sudah dikeluarkan dari katalog." action={<Link href="/koleksi"><Button>Kembali ke koleksi</Button></Link>} />
      </div>
    )
  }
  const color = product.colors[colorIndex] ?? product.colors[0]
  const price = store.priceOf(product)
  const category = store.categories.find((item) => item.id === product.categoryId)
  const related = store.products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4)
  const relatedIds = new Set(related.map((item) => item.id))
  const recommended = store.products.filter((item) => item.id !== product.id && item.isBestSeller && !relatedIds.has(item.id)).slice(0, 4)
  const activeImage = product.images[image] ?? product.images[0] ?? ""
  const saved = store.wishlist.includes(product.id)

  const add = () => {
    const result = store.addToCart(product.id, color.name, qty)
    store.notify(result.ok ? `${product.name} masuk keranjang.` : result.error)
    return result.ok
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <p className="text-sm text-muted">
        <Link href="/koleksi">Koleksi</Link>
        {category ? (
          <>
            {" / "}
            <Link href={`/koleksi?kategori=${category.slug}`}>{category.name}</Link>
          </>
        ) : null}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <button type="button" className="relative block aspect-[4/5] w-full bg-sand" onClick={() => setZoom(true)}>
            <Photo src={activeImage} alt={product.name} priority sizes="(min-width: 1024px) 50vw, 100vw" />
            <span className="absolute right-3 bottom-3 bg-paper/90 px-3 py-2 text-xs tracking-wide">Perbesar</span>
          </button>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.map((src, index) => (
              <button key={src + index} type="button" className={`relative aspect-square bg-sand ${index === image ? "ring-1 ring-charcoal" : ""}`} onClick={() => setImage(index)}>
                <Photo src={src} alt="" sizes="120px" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.22em] text-walnut uppercase">{category?.name}</p>
          <h1 className="mt-2 font-serif text-5xl leading-tight">{product.name}</h1>
          <div className="mt-3">
            <Stars value={product.rating} count={product.reviewCount} />
          </div>
          <div className="mt-4 text-lg">
            <PriceTag product={product} price={price} />
          </div>
          {product.flashPrice && flashActive(store.flashEndsAt) ? <p className="mt-1 text-xs text-walnut">Harga flash sale sedang berlaku.</p> : null}
          <div className="mt-2">
            <StockNote stock={product.stock} />
          </div>
          <p className="mt-5 text-sm leading-7 text-muted">{product.description}</p>
          <div className="mt-6">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Warna</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setColorIndex(index)}
                  className={`flex min-h-11 items-center gap-2 border px-3 text-sm ${index === colorIndex ? "border-charcoal" : "border-sand"}`}
                >
                  <span className="h-4 w-4" style={{ background: item.hex }} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Jumlah</p>
            <button type="button" className="h-11 w-11 border border-sand" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Kurangi">
              −
            </button>
            <span className="w-8 text-center">{qty}</span>
            <button type="button" className="h-11 w-11 border border-sand" onClick={() => setQty((value) => Math.min(product.stock || 1, value + 1))} aria-label="Tambah">
              +
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" disabled={product.stock < 1} onClick={add}>
              Tambah ke keranjang
            </Button>
            <Button
              variant="brass"
              className="flex-1"
              disabled={product.stock < 1}
              onClick={() => {
                if (!add()) return
                store.selectOnly(product.id, color.name)
                router.push("/checkout")
              }}
            >
              Beli sekarang
            </Button>
          </div>
          <button type="button" className="mt-4 min-h-11 text-sm text-walnut" onClick={() => store.toggleWishlist(product.id)}>
            {saved ? "Tersimpan di wishlist" : "Simpan ke wishlist"}
          </button>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-sand pt-6 text-sm">
            <div>
              <dt className="text-xs tracking-[0.16em] text-muted uppercase">Bahan</dt>
              <dd className="mt-1">{product.material}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] text-muted uppercase">Dimensi</dt>
              <dd className="mt-1">{product.dimensions}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Deskripsi</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{product.details}</p>
          <h2 className="mt-8 font-serif text-3xl">Spesifikasi</h2>
          <dl className="mt-3 divide-y divide-sand border-y border-sand">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[140px_1fr] gap-3 py-3 text-sm">
                <dt className="text-muted">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-3xl">Visual 3D</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Sketsa bentuk untuk melihat proporsi. Foto di samping tetap menjadi acuan produk. {product.modelUrl ? "Model GLB kursi dapat dimuat terpisah." : "Model GLB tidak disertakan untuk potongan ini, jadi sketsa yang ditampilkan."}
              </p>
            </div>
          </div>
          {can3d && show3d ? (
            <div className="mt-4 h-[420px] bg-sand">
              <ProductCanvas kind={product.kind} color={color.hex} modelUrl={product.modelUrl} showModel={showModel} />
            </div>
          ) : (
            <div className="relative mt-4 aspect-[4/3] bg-sand">
              <Photo src={activeImage} alt={product.name} sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {can3d ? (
              <Button variant="line" onClick={() => setShow3d((value) => !value)}>
                {show3d ? "Tampilkan foto" : "Lihat sketsa 3D"}
              </Button>
            ) : (
              <p className="text-sm text-muted">Perangkat ini memakai foto supaya halaman tetap ringan.</p>
            )}
            {can3d && show3d && product.modelUrl ? (
              <Button variant="line" onClick={() => setShowModel(true)} disabled={showModel}>
                {showModel ? "Model GLB dimuat" : "Muat model GLB"}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-4xl">Dari ruang yang sama</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
      {recommended.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-4xl">Disarankan</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      {zoom ? (
        <div className="fixed inset-0 z-50 bg-charcoal/92" onClick={() => setZoom(false)}>
          <button type="button" className="absolute top-4 right-4 z-10 min-h-11 bg-ivory px-4 text-sm" onClick={() => setZoom(false)}>
            Tutup
          </button>
          <div
            className="absolute inset-6 bg-contain bg-no-repeat md:bg-center"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundSize: "140%",
              backgroundPosition: `${origin.x}% ${origin.y}%`,
            }}
            onClick={(event) => event.stopPropagation()}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              setOrigin({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              })
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
