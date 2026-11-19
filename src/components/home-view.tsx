"use client"

import { Newsletter } from "@/components/newsletter"
import { Photo } from "@/components/photo"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui"
import { useCanRender3D } from "@/components/use-3d"
import { designImage, heroImage, promoImage, storyImage } from "@/lib/catalog"
import { flashActive, useStore } from "@/lib/store"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"

const HeroCanvas = dynamic(() => import("@/components/visuals").then((mod) => mod.HeroCanvas), { ssr: false })

function Countdown({ end }: { end: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  if (now === null) return <p className="text-sm tracking-[0.18em]">—</p>
  const diff = Math.max(0, new Date(end).getTime() - now)
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  const pad = (value: number) => String(value).padStart(2, "0")
  return (
    <p className="font-serif text-3xl tabular-nums">
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </p>
  )
}

export function HomeView() {
  const store = useStore()
  const can3d = useCanRender3D()
  const live = flashActive(store.flashEndsAt)
  const flash = store.products.filter((product) => product.flashPrice && live).slice(0, 3)
  const bestsellers = [...store.products].sort((a, b) => b.popularity - a.popularity).slice(0, 4)
  const arrivals = [...store.products].filter((product) => product.isNew).slice(0, 4)
  return (
    <div>
      <section className="grid min-h-[calc(100svh-64px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col justify-center px-5 py-14 md:px-12 lg:px-16">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xs tracking-[0.32em] text-walnut uppercase">
            Atelier Living
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-xl font-serif text-5xl leading-[1.02] md:text-7xl"
          >
            Create a Space That Feels Like Home.
          </motion.h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted md:text-lg">
            Thoughtfully designed furniture to transform your living experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/koleksi">
              <Button className="w-full sm:w-auto">Explore Collection</Button>
            </Link>
            <Link href="/desain">
              <Button variant="line" className="w-full sm:w-auto">
                Discover Our Design
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative min-h-[70vw] bg-sand lg:min-h-full">
          <Photo src={heroImage} alt="Ruang duduk dengan cahaya sore" priority sizes="(min-width: 1024px) 55vw, 100vw" />
          {can3d ? (
            <div className="pointer-events-none absolute right-4 bottom-4 h-48 w-40 overflow-hidden border border-white/50 shadow-xl md:right-8 md:bottom-8 md:h-64 md:w-52">
              <HeroCanvas />
              <p className="absolute bottom-2 left-2 text-[10px] tracking-[0.16em] text-charcoal/80 uppercase">Ruang 3D</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-charcoal text-ivory">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-8 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs tracking-[0.22em] text-brass uppercase">White glove minggu ini</p>
            <p className="mt-2 max-w-xl font-serif text-3xl">Pengiriman dan perakitan untuk pesanan ruang keluarga di Jabodetabek.</p>
          </div>
          <Link href="/promo">
            <Button variant="line" className="border-white/30 text-ivory">
              Lihat promo
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.22em] text-walnut uppercase">Ruang</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">Pilih dari ruang yang sedang Anda tata.</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {store.categories.map((category) => (
            <Link key={category.id} href={`/koleksi?kategori=${category.slug}`} className="group relative block min-h-64 overflow-hidden bg-sand">
              <Photo src={category.image} alt={category.name} className="transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-5 text-ivory">
                <h3 className="font-serif text-3xl">{category.name}</h3>
                <p className="mt-1 text-sm text-white/80">{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {flash.length > 0 ? (
        <section className="bg-bark text-ivory">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs tracking-[0.22em] text-brass uppercase">Flash sale</p>
                <h2 className="mt-2 font-serif text-4xl">Harga yang diturunkan untuk beberapa potong saja.</h2>
              </div>
              <Countdown end={store.flashEndsAt} />
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {flash.map((product) => (
                <div key={product.id} className="bg-ivory p-3 text-charcoal">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:px-8">
        <div className="relative min-h-80 bg-sand">
          <Photo src={storyImage} alt="Sudut ruang dengan material kayu dan linen" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div>
          <p className="text-xs tracking-[0.22em] text-walnut uppercase">Cerita bahan</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Kayu yang dibiarkan terlihat, kain yang tidak berteriak.</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Setiap potong dipilih supaya tetap tenang di foto dan di rumah. Serat kayu, linen, kuningan sikat, dan wol tenun menjadi bahasa visual yang sama di seluruh koleksi.
          </p>
          <Link href="/desain" className="mt-6 inline-block">
            <Button variant="line">Discover Our Design</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-6 md:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-4xl">Paling diminati</h2>
          <Link href="/koleksi?tandai=laris" className="text-sm text-walnut">
            Lihat semua
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="font-serif text-4xl">Baru tiba di studio</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="relative mx-5 min-h-[420px] overflow-hidden bg-sand md:mx-8">
        <Photo src={promoImage} alt="Interior dengan palet hangat" sizes="100vw" />
        <div className="absolute inset-0 bg-charcoal/35" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-ivory md:p-12">
          <p className="text-xs tracking-[0.22em] uppercase">Ruang tamu, disusun ulang</p>
          <h2 className="mt-2 max-w-xl font-serif text-4xl md:text-6xl">Satu sofa, satu meja, satu lampu. Sisanya adalah cahaya.</h2>
          <Link href="/koleksi?kategori=living-room" className="mt-6">
            <Button variant="line" className="border-white/40 text-ivory">
              Explore Collection
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-8 bg-walnut px-6 py-10 text-ivory md:grid-cols-[1.2fr_1fr] md:px-10">
          <div>
            <p className="text-xs tracking-[0.22em] text-sand uppercase">Surat studio</p>
            <h2 className="mt-3 font-serif text-4xl">Catatan koleksi baru, tanpa jadwal yang berisik.</h2>
          </div>
          <Newsletter dark />
        </div>
      </section>
    </div>
  )
}
