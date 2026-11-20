
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

// ======================================================
// MENU ICONS
// ======================================================

type MenuIconName =
  | "grid"
  | "sofa"
  | "sparkles"
  | "tag"
  | "building"
  | "heart"
  | "user"
  | "shopping-bag"
  | "search"
  | "arrow"
  | "close"

function MenuIcon({
  name,
  size = 20,
}: {
  name: MenuIconName
  size?: number
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )

    case "sofa":
      return (
        <svg {...common}>
          <path d="M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
          <path d="M3 12a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6H3z" />
          <path d="M5 18v2M19 18v2M8 10v4M16 10v4" />
        </svg>
      )

    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
          <path d="m19 14 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1 1-2.5Z" />
        </svg>
      )

    case "tag":
      return (
        <svg {...common}>
          <path d="M20.5 13.5 13.5 20.5 3 10V3h7z" />
          <circle cx="7.5" cy="7.5" r="1" />
        </svg>
      )

    case "building":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l7-4 7 4v14" />
          <path d="M9 10h1M14 10h1M9 14h1M14 14h1M10 21v-4h4v4" />
        </svg>
      )

    case "heart":
      return (
        <svg {...common}>
          <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
        </svg>
      )

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )

    case "shopping-bag":
      return (
        <svg {...common}>
          <path d="M5 8h14l1 13H4L5 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
      )

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="7" />
          <path d="m16 16 5 5" />
        </svg>
      )

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )

    case "close":
      return (
        <svg {...common}>
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      )

    default:
      return null
  }
}

// ======================================================
// SITE SHELL
// ======================================================

export function SiteShell({ children }: { children: ReactNode }) {
  const store = useOptionalStore()
  const pathname = usePathname()

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-xs tracking-[0.32em] text-muted">
          ATELIER LIVING
        </p>
      </div>
    )
  }

  if (pathname.startsWith("/admin")) {
    return <AdminShell>{children}</AdminShell>
  }

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

// ======================================================
// HEADER & NAVIGATION
// ======================================================

function Header() {
  const store = useStore()
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const count = store.cart.reduce(
    (sum, line) => sum + line.qty,
    0
  )

  const closeMenu = () => setOpen(false)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const menuGroups = [
    {
      title: "Jelajahi",
      subtitle: "Temukan inspirasi untuk rumah Anda",
      items: [
        {
          href: "/koleksi",
          label: "Semua Koleksi",
          description: "Furnitur untuk setiap ruang",
          icon: "grid" as const,
        },
        {
          href: "/desain",
          label: "Inspirasi Desain",
          description: "Ide untuk ruang yang lebih baik",
          icon: "sparkles" as const,
        },
        {
          href: "/promo",
          label: "Penawaran Spesial",
          description: "Pilihan menarik untuk Anda",
          icon: "tag" as const,
        },
        {
          href: "/tentang",
          label: "Tentang Studio",
          description: "Cerita di balik Atelier Living",
          icon: "building" as const,
        },
      ],
    },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-sand bg-white">
        <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 md:px-8">

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka navigasi"
            aria-expanded={open}
            className="group flex size-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full transition hover:bg-stone-100 md:hidden"
          >
            <span className="h-[1.5px] w-6 bg-charcoal transition-all group-hover:w-5" />
            <span className="ml-3 h-[1.5px] w-4 bg-charcoal transition-all group-hover:ml-0 group-hover:w-6" />
            <span className="h-[1.5px] w-6 bg-charcoal transition-all" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-serif text-2xl tracking-[0.18em] text-charcoal md:text-3xl"
          >
            ATELIER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm transition-colors hover:text-walnut ${
                  isActive(item.href)
                    ? "font-medium text-walnut"
                    : "text-charcoal"
                }`}
              >
                {item.label}

                {isActive(item.href) && (
                  <span className="absolute right-0 bottom-0 left-0 h-px bg-walnut" />
                )}
              </Link>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-1">
            <form
              className="hidden lg:block"
              onSubmit={(event) => {
                event.preventDefault()
                router.push(
                  `/koleksi?q=${encodeURIComponent(query)}`
                )
              }}
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari produk"
                aria-label="Cari produk"
                className="min-h-11 w-40 border border-sand bg-white px-3 text-sm text-charcoal outline-none transition focus:border-walnut"
              />
            </form>

            <Link
              href="/akun/wishlist"
              aria-label="Simpanan"
              className="flex size-11 items-center justify-center text-charcoal transition hover:text-walnut"
            >
              <MenuIcon name="heart" size={19} />
            </Link>

            <Link
              href={store.user ? "/akun" : "/masuk"}
              aria-label="Akun"
              className="flex size-11 items-center justify-center text-charcoal transition hover:text-walnut"
            >
              <MenuIcon name="user" size={19} />
            </Link>

            <button
              type="button"
              aria-label="Buka keranjang"
              onClick={() =>
                document.dispatchEvent(
                  new CustomEvent("atelier-cart")
                )
              }
              className="relative flex size-11 items-center justify-center text-charcoal transition hover:text-walnut"
            >
              <MenuIcon name="shopping-bag" size={19} />

              {count > 0 && (
                <span className="absolute top-1 right-0 flex size-[17px] items-center justify-center rounded-full bg-charcoal text-[9px] text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] h-[100dvh] overflow-y-auto bg-white text-charcoal md:hidden"
            style={{
              backgroundColor: "#ffffff",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
          >
            {/* Top bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-sand bg-white px-5 py-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="font-serif text-2xl tracking-[0.18em] text-charcoal"
              >
                ATELIER
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em] text-muted">
                  MENU
                </span>

                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Tutup navigasi"
                  className="flex size-10 items-center justify-center rounded-full border border-sand bg-white transition hover:bg-stone-100"
                >
                  <MenuIcon name="close" size={20} />
                </button>
              </div>
            </div>

            <div className="mx-auto max-w-xl bg-white px-5 pb-12">

              {/* Welcome */}
              <div className="pt-9 pb-8">
                <p className="text-[10px] tracking-[0.28em] text-walnut uppercase">
                  Welcome to Atelier
                </p>

                <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
                  Make room for
                  <br />
                  <span className="italic">
                    better living.
                  </span>
                </h2>

                <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                  Temukan furnitur dan inspirasi untuk menciptakan
                  ruang yang terasa seperti rumah.
                </p>
              </div>

              {/* Search */}
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  closeMenu()
                  router.push(
                    `/koleksi?q=${encodeURIComponent(query)}`
                  )
                }}
                className="mb-9"
              >
                <div className="flex h-12 items-center gap-3 border border-sand bg-white px-4 transition focus-within:border-walnut">
                  <MenuIcon name="search" size={19} />

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari furnitur impian Anda..."
                    aria-label="Cari produk"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-muted"
                  />

                  <button
                    type="submit"
                    aria-label="Cari"
                    className="text-charcoal"
                  >
                    <MenuIcon name="arrow" size={19} />
                  </button>
                </div>
              </form>

              {/* Navigation Groups */}
              {menuGroups.map((group) => (
                <section key={group.title} className="mb-9">
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.22em] text-walnut uppercase">
                        {group.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {group.subtitle}
                      </p>
                    </div>

                    <MenuIcon name="grid" size={17} />
                  </div>

                  <div className="border-t border-sand">
                    {group.items.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.055,
                          duration: 0.25,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`group flex items-center gap-4 border-b border-sand py-4 transition-colors hover:bg-stone-50 ${
                            isActive(item.href)
                              ? "text-walnut"
                              : "text-charcoal"
                          }`}
                        >
                          <div className="flex size-11 shrink-0 items-center justify-center bg-stone-100 transition group-hover:bg-stone-200">
                            <MenuIcon name={item.icon} size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-xl">
                              {item.label}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {item.description}
                            </p>
                          </div>

                          <MenuIcon name="arrow" size={18} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}

              {/* Featured Collection */}
              <Link
                href="/koleksi"
                onClick={closeMenu}
                className="group relative block overflow-hidden bg-charcoal p-6 text-white"
              >
                <div className="relative z-10">
                  <p className="text-[9px] tracking-[0.25em] text-white/60 uppercase">
                    Discover your space
                  </p>

                  <h3 className="mt-3 max-w-[230px] font-serif text-3xl leading-tight">
                    Temukan koleksi pilihan kami.
                  </h3>

                  <div className="mt-5 inline-flex items-center gap-3 border-b border-white/50 pb-2 text-xs">
                    Jelajahi koleksi
                    <MenuIcon name="arrow" size={16} />
                  </div>
                </div>

                <div className="absolute -right-7 -bottom-12 size-40 rounded-full border border-white/10" />
                <div className="absolute -right-1 -bottom-6 size-24 rounded-full border border-white/10" />

                <div className="absolute top-5 right-6 text-white/20">
                  <MenuIcon name="sparkles" size={42} />
                </div>
              </Link>

              {/* Account Shortcuts */}
              <section className="mt-9">
                <p className="mb-4 text-[10px] tracking-[0.22em] text-walnut uppercase">
                  Layanan & Akun
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/akun/wishlist"
                    onClick={closeMenu}
                    className="flex min-h-20 items-center gap-3 border border-sand bg-white p-3 transition hover:bg-stone-50"
                  >
                    <MenuIcon name="heart" size={20} />
                    <span className="text-sm">
                      Simpanan
                    </span>
                  </Link>

                  <Link
                    href={store.user ? "/akun" : "/masuk"}
                    onClick={closeMenu}
                    className="flex min-h-20 items-center gap-3 border border-sand bg-white p-3 transition hover:bg-stone-50"
                  >
                    <MenuIcon name="user" size={20} />
                    <span className="text-sm">
                      {store.user ? "Akun Saya" : "Masuk"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      closeMenu()
                      document.dispatchEvent(
                        new CustomEvent("atelier-cart")
                      )
                    }}
                    className="col-span-2 flex min-h-14 items-center gap-3 border border-sand bg-white px-3 text-left transition hover:bg-stone-50"
                  >
                    <MenuIcon name="shopping-bag" size={20} />

                    <span className="flex-1 text-sm">
                      Keranjang Belanja
                    </span>

                    <span className="text-xs text-muted">
                      {count} item
                    </span>

                    <MenuIcon name="arrow" size={17} />
                  </button>
                </div>
              </section>

              {/* Branding */}
              <div className="mt-12 border-t border-sand pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-xl tracking-[0.15em]">
                      ATELIER
                    </p>
                    <p className="mt-1 text-[9px] tracking-[0.25em] text-muted">
                      CRAFTED FOR BETTER LIVING
                    </p>
                  </div>

                  <Link
                    href="/tentang"
                    onClick={closeMenu}
                    className="flex size-10 items-center justify-center rounded-full border border-sand"
                    aria-label="Tentang Atelier"
                  >
                    <MenuIcon name="arrow" size={18} />
                  </Link>
                </div>

                <p className="mt-5 text-[10px] text-muted">
                  © {new Date().getFullYear()} ATELIER LIVING
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ======================================================
// FOOTER
// ======================================================

export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-serif text-4xl">
            Atelier Living
          </p>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Furnitur yang disusun pelan, untuk rumah yang ingin
            ditinggali lebih lama.
          </p>

          <div className="mt-6">
            <Newsletter />
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            Kunjungi
          </p>

          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/koleksi">Koleksi</Link>
            <Link href="/desain">Desain</Link>
            <Link href="/promo">Promo</Link>
            <Link href="/keranjang">Keranjang</Link>
            <Link href="/akun">Akun</Link>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            Studio
          </p>

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
            IT Partner by{" "}
            <span className="text-charcoal">
              HINAI Tech
            </span>
          </p>

          <p className="max-w-xl text-xs leading-5">
            Crafted for better living. ATELIER LIVING menghadirkan
            furnitur dengan perpaduan estetika, kenyamanan, dan
            kualitas untuk menyempurnakan setiap sudut hunian Anda.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ======================================================
// CART DRAWER
// ======================================================

function CartDrawer() {
  const store = useStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openDrawer = () => setOpen(true)

    document.addEventListener("atelier-cart", openDrawer)

    return () => {
      document.removeEventListener("atelier-cart", openDrawer)
    }
  }, [])

  const lines = store.cart
    .map((line) => ({
      line,
      product: store.products.find(
        (item) => item.id === line.productId
      ),
    }))
    .filter((item) => item.product)

  const subtotal = lines.reduce(
    (sum, item) =>
      sum +
      (item.line.selected
        ? store.priceOf(item.product!) * item.line.qty
        : 0),
    0
  )

  return (
    <AnimatePresence>
      {open && (
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
            className="fixed top-0 right-0 z-50 flex h-full w-[min(100%,420px)] flex-col bg-white text-charcoal shadow-2xl"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-sand bg-white px-5 py-4">
              <h2 className="font-serif text-3xl">
                Keranjang
              </h2>

              <button
                type="button"
                className="min-h-11 bg-white px-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-auto bg-white px-5 py-4">
              {lines.length === 0 && (
                <p className="text-sm text-muted">
                  Keranjang masih kosong.
                </p>
              )}

              {lines.map(({ line, product }) => (
                <div
                  key={line.id}
                  className="grid grid-cols-[84px_1fr] gap-3"
                >
                  <div className="relative h-24 bg-sand">
                    <Photo
                      src={product!.images[0] ?? ""}
                      alt=""
                      sizes="84px"
                    />
                  </div>

                  <div>
                    <Link
                      href={`/produk/${product!.slug}`}
                      onClick={() => setOpen(false)}
                      className="font-serif text-xl leading-tight"
                    >
                      {product!.name}
                    </Link>

                    <p className="text-xs text-muted">
                      {line.color}
                    </p>

                    <p className="mt-1 text-sm">
                      {rupiah(
                        store.priceOf(product!) * line.qty
                      )}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-9 w-9 border border-sand"
                        onClick={() =>
                          store.setQty(line.id, line.qty - 1)
                        }
                      >
                        −
                      </button>

                      <span className="w-6 text-center text-sm">
                        {line.qty}
                      </span>

                      <button
                        type="button"
                        className="h-9 w-9 border border-sand"
                        onClick={() =>
                          store.setQty(line.id, line.qty + 1)
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="ml-auto text-xs text-muted"
                        onClick={() =>
                          store.removeLine(line.id)
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sand bg-white px-5 py-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal terpilih</span>
                <span>{rupiah(subtotal)}</span>
              </div>

              <p className="mt-1 text-xs text-muted">
                Ongkir dihitung setelah alamat diisi.
              </p>

              <Link
                href="/keranjang"
                onClick={() => setOpen(false)}
                className="mt-4 block"
              >
                <Button className="w-full">
                  Lihat keranjang
                </Button>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ======================================================
// ADMIN NAVIGATION
// ======================================================

const adminLinks = [
  ["/admin", "Ringkasan"],
  ["/admin/produk", "Produk"],
  ["/admin/kategori", "Kategori"],
  ["/admin/pesanan", "Pesanan"],
  ["/admin/pelanggan", "Pelanggan"],
  ["/admin/pesan", "Pesan"],
  ["/admin/laporan", "Laporan"],
]

// ======================================================
// ADMIN SHELL
// ======================================================

function AdminShell({ children }: { children: ReactNode }) {
  const store = useStore()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!store.user || store.user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
        <p className="text-xs tracking-[0.22em] text-walnut uppercase">
          Pengelola
        </p>

        <h1 className="mt-3 font-serif text-5xl">
          Dasbor studio
        </h1>

        <p className="mt-4 text-sm leading-6 text-muted">
          Masuk dengan akun pengelola untuk mengatur katalog,
          pesanan, dan pelanggan.
        </p>

        <Link href="/masuk?next=/admin" className="mt-6">
          <Button>Masuk sebagai pengelola</Button>
        </Link>
      </div>
    )
  }

  const unread = store.messages.filter(
    (item) => !item.read
  ).length

  return (
    <div className="min-h-screen bg-mist md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-sand bg-charcoal text-ivory md:min-h-screen md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/admin"
            className="font-serif text-2xl tracking-[0.14em]"
          >
            ATELIER
          </Link>

          <button
            type="button"
            className="min-h-11 px-2 text-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Tutup" : "Menu"}
          </button>
        </div>

        <nav
          className={`${
            open ? "block" : "hidden"
          } px-3 pb-4 md:block`}
        >
          {adminLinks.map(([href, label]) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center justify-between px-3 text-sm transition hover:bg-white/10 ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/75"
                }`}
              >
                {label}

                {href === "/admin/pesan" && unread > 0 && (
                  <span className="text-xs">
                    {unread}
                  </span>
                )}
              </Link>
            )
          })}

          <Link
            href="/"
            className="flex min-h-11 items-center px-3 text-sm text-white/75 transition hover:bg-white/10"
          >
            Lihat toko
          </Link>

          <button
            type="button"
            className="flex min-h-11 w-full items-center px-3 text-left text-sm text-white/75 transition hover:bg-white/10"
            onClick={() => store.logout()}
          >
            Keluar
          </button>
        </nav>
      </aside>

      <div className="px-4 py-6 md:px-8 md:py-8">
        {children}
      </div>
    </div>
  )
}
