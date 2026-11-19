"use client"

import { Newsletter } from "@/components/newsletter"
import { Photo } from "@/components/photo"
import { Button } from "@/components/ui"
import { rupiah } from "@/lib/format"
import { useOptionalStore, useStore } from "@/lib/store"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

const nav = [
  { href: "/koleksi", label: "Koleksi" },
  { href: "/desain", label: "Desain" },
  { href: "/promo", label: "Promo" },
  { href: "/tentang", label: "Studio" },
]

export function SiteShell({ children }: { children: ReactNode }) {
  const store = useOptionalStore()
  const pathname = usePathname()
  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="text-xs tracking-[0.32em] text-muted">ATELIER LIVING</p>
      </div>
    )
  }
  if (pathname.startsWith("/admin")) return <AdminShell>{children}</AdminShell>
  return (
    <>
      <Header />
      <main id="isi" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}

function Header() {
  const store = useStore()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const count = store.cart.reduce((sum, line) => sum + line.qty, 0)
  return (
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-ivory/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-8">
        <button type="button" className="min-h-11 px-2 text-sm md:hidden" onClick={() => setOpen(true)} aria-label="Buka menu">
          Menu
        </button>
        <Link href="/" className="font-serif text-2xl tracking-[0.18em] md:text-3xl">
          ATELIER
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "text-walnut" : "text-sm text-ink"}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <form
            className="hidden lg:block"
            onSubmit={(event) => {
              event.preventDefault()
              router.push(`/koleksi?q=${encodeURIComponent(query)}`)
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari produk"
              aria-label="Cari produk"
              className="min-h-11 w-44 border border-sand bg-paper px-3 text-sm"
            />
          </form>
          <Link href="/akun/wishlist" className="inline-flex min-h-11 items-center px-2 text-sm" aria-label="Simpanan">
            ♡
          </Link>
          <Link href={store.user ? "/akun" : "/masuk"} className="inline-flex min-h-11 items-center px-2 text-sm">
            {store.user ? store.user.name.split(" ")[0] : "Masuk"}
          </Link>
          <button type="button" className="inline-flex min-h-11 items-center px-2 text-sm" onClick={() => document.dispatchEvent(new CustomEvent("atelier-cart"))}>
            Tas{count > 0 ? ` (${count})` : ""}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-ivory md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-serif text-2xl tracking-[0.18em]">ATELIER</p>
              <button type="button" className="min-h-11 px-3" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <div className="flex flex-col px-4">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-sand py-4 text-2xl font-serif">
                  {item.label}
                </Link>
              ))}
              <Link href="/koleksi" onClick={() => setOpen(false)} className="border-b border-sand py-4 text-2xl font-serif">
                Cari produk
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-serif text-4xl">Atelier Living</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Furnitur yang disusun pelan, untuk rumah yang ingin ditinggali lebih lama.
          </p>
          <div className="mt-6">
            <Newsletter />
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Kunjungi</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/koleksi">Koleksi</Link>
            <Link href="/desain">Desain</Link>
            <Link href="/promo">Promo</Link>
            <Link href="/keranjang">Keranjang</Link>
            <Link href="/akun">Akun</Link>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Studio</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Kebayoran Baru
            <br />
            Jakarta Selatan
            <br />
            Surat menyurat lewat formulir studio
          </p>
        </div>
      </div>
      <div className="border-t border-sand px-5 py-6 text-sm text-muted md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p>
            IT Partner by <span className="text-charcoal">HINAI Tech</span>
          </p>
         
            <p className="max-w-xl text-xs leading-5">
              Crafted for better living. ATELIER LIVING menghadirkan furnitur
              dengan perpaduan estetika, kenyamanan, dan kualitas untuk
              menyempurnakan setiap sudut hunian Anda.
            </p>

        </div>
      </div>
    </footer>
  )
}

function CartDrawer() {
  const store = useStore()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const openDrawer = () => setOpen(true)
    document.addEventListener("atelier-cart", openDrawer)
    return () => document.removeEventListener("atelier-cart", openDrawer)
  }, [])
  const lines = store.cart
    .map((line) => ({ line, product: store.products.find((item) => item.id === line.productId) }))
    .filter((item) => item.product)
  const subtotal = lines.reduce((sum, item) => sum + (item.line.selected ? store.priceOf(item.product!) * item.line.qty : 0), 0)
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Tutup keranjang"
            className="fixed inset-0 z-50 bg-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed top-0 right-0 z-50 flex h-full w-[min(100%,420px)] flex-col bg-ivory shadow-2xl"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <h2 className="font-serif text-3xl">Keranjang</h2>
              <button type="button" className="min-h-11 px-2" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-auto px-5 py-4">
              {lines.length === 0 ? <p className="text-sm text-muted">Keranjang masih kosong.</p> : null}
              {lines.map(({ line, product }) => (
                <div key={line.id} className="grid grid-cols-[84px_1fr] gap-3">
                  <div className="relative h-24 bg-sand">
                    <Photo src={product!.images[0] ?? ""} alt="" sizes="84px" />
                  </div>
                  <div>
                    <Link href={`/produk/${product!.slug}`} onClick={() => setOpen(false)} className="font-serif text-xl leading-tight">
                      {product!.name}
                    </Link>
                    <p className="text-xs text-muted">{line.color}</p>
                    <p className="mt-1 text-sm">{rupiah(store.priceOf(product!) * line.qty)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" className="h-9 w-9 border border-sand" onClick={() => store.setQty(line.id, line.qty - 1)}>
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{line.qty}</span>
                      <button type="button" className="h-9 w-9 border border-sand" onClick={() => store.setQty(line.id, line.qty + 1)}>
                        +
                      </button>
                      <button type="button" className="ml-auto text-xs text-muted" onClick={() => store.removeLine(line.id)}>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-sand px-5 py-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal terpilih</span>
                <span>{rupiah(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Ongkir dihitung setelah alamat diisi.</p>
              <Link href="/keranjang" onClick={() => setOpen(false)} className="mt-4 block">
                <Button className="w-full">Lihat keranjang</Button>
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

const adminLinks = [
  ["/admin", "Ringkasan"],
  ["/admin/produk", "Produk"],
  ["/admin/kategori", "Kategori"],
  ["/admin/pesanan", "Pesanan"],
  ["/admin/pelanggan", "Pelanggan"],
  ["/admin/pesan", "Pesan"],
  ["/admin/laporan", "Laporan"],
]

function AdminShell({ children }: { children: ReactNode }) {
  const store = useStore()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  if (!store.user || store.user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
        <p className="text-xs tracking-[0.22em] text-walnut uppercase">Pengelola</p>
        <h1 className="mt-3 font-serif text-5xl">Dasbor studio</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Masuk dengan akun pengelola untuk mengatur katalog, pesanan, dan pelanggan.</p>
        <Link href="/masuk?next=/admin" className="mt-6">
          <Button>Masuk sebagai pengelola</Button>
        </Link>
      </div>
    )
  }
  const unread = store.messages.filter((item) => !item.read).length
  return (
    <div className="min-h-screen bg-mist md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-sand bg-charcoal text-ivory md:min-h-screen md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin" className="font-serif text-2xl tracking-[0.14em]">
            ATELIER
          </Link>
          <button type="button" className="min-h-11 px-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? "Tutup" : "Menu"}
          </button>
        </div>
        <nav className={`${open ? "block" : "hidden"} px-3 pb-4 md:block`}>
          {adminLinks.map(([href, label]) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center justify-between px-3 text-sm ${active ? "bg-white/10" : "text-white/75"}`}
              >
                {label}
                {href === "/admin/pesan" && unread > 0 ? <span className="text-xs">{unread}</span> : null}
              </Link>
            )
          })}
          <Link href="/" className="flex min-h-11 items-center px-3 text-sm text-white/75">
            Lihat toko
          </Link>
          <button type="button" className="flex min-h-11 w-full items-center px-3 text-left text-sm text-white/75" onClick={() => store.logout()}>
            Keluar
          </button>
        </nav>
      </aside>
      <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  )
}
