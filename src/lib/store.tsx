"use client"

import { seedCategories, seedProducts } from "@/lib/catalog"
import { saleIsLive, selectedLines, unitPrice, voucherResult } from "@/lib/commerce"
import { hashPassword, isEmail, isPhone } from "@/lib/security"
import type {
  Address,
  CartLine,
  Category,
  Order,
  OrderStatus,
  PaymentMethod,
  Persisted,
  Product,
  PublicUser,
  StoredUser,
  StudioMessage,
} from "@/lib/types"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const KEY = "atelier-living-store-v1"

const ALYA_ID = "user-alya"
const ADMIN_ID = "user-admin"

function toPublic(user: StoredUser): PublicUser {
  const safe = { ...user }
  delete (safe as Partial<StoredUser>).passwordHash
  delete (safe as Partial<StoredUser>).passwordSalt
  return safe
}

async function createInitialStore(): Promise<Persisted> {
  const adminSalt = crypto.randomUUID()
  const alyaSalt = crypto.randomUUID()
  const admin: StoredUser = {
    id: ADMIN_ID,
    name: "Pengelola Atelier",
    email: "pengelola@atelierliving.id",
    phone: "081200001881",
    passwordSalt: adminSalt,
    passwordHash: await hashPassword("Atelier#Living", adminSalt),
    role: "admin",
    address: {
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Kebayoran Baru",
      postalCode: "12110",
      line: "Studio Atelier Living, Jl. Gunawarman No. 18",
    },
    createdAt: "2026-01-08T02:00:00.000Z",
  }
  const alya: StoredUser = {
    id: ALYA_ID,
    name: "Alya Hartono",
    email: "alya@atelierliving.id",
    phone: "081298761234",
    passwordSalt: alyaSalt,
    passwordHash: await hashPassword("Living#Alya", alyaSalt),
    role: "customer",
    address: {
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Cilandak",
      postalCode: "12430",
      line: "Jl. Cipete Raya No. 42",
    },
    createdAt: "2026-08-02T02:00:00.000Z",
  }

  const byId = (id: string) => seedProducts.find((product) => product.id === id)!
  const line = (id: string, qty: number, color: string) => {
    const product = byId(id)
    return {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      color,
      qty,
      unitPrice: product.flashPrice ?? product.price,
    }
  }

  const address = alya.address!
  const orders: Order[] = [
    {
      id: "order-ill-1",
      number: "AL-2608-1842",
      userId: ALYA_ID,
      illustration: true,
      customer: { name: alya.name, email: alya.email, phone: alya.phone },
      address,
      shipping: { id: "white-glove", name: "Atelier White Glove", eta: "5–8 hari kerja", cost: 350_000 },
      paymentMethod: "transfer",
      paymentState: "tercatat",
      items: [line("p-aria", 1, "Walnut"), line("p-nara", 1, "Walnut")],
      subtotal: 27_300_000,
      discount: 0,
      voucherCode: null,
      shippingCost: 350_000,
      total: 27_650_000,
      status: "selesai",
      stockRestored: true,
      createdAt: "2026-08-12T04:20:00.000Z",
      note: "Ilustrasi pesanan. Tidak ada dana yang ditarik.",
    },
    {
      id: "order-ill-2",
      number: "AL-2609-2210",
      userId: ALYA_ID,
      illustration: true,
      customer: { name: alya.name, email: alya.email, phone: alya.phone },
      address,
      shipping: { id: "regular", name: "Ekspedisi reguler", eta: "2–4 hari kerja", cost: 0 },
      paymentMethod: "qris",
      paymentState: "tercatat",
      items: [line("p-oslo", 1, "Ivory"), line("p-marlowe", 2, "Oak")],
      subtotal: 25_000_000,
      discount: 2_000_000,
      voucherCode: "RUMAH10",
      shippingCost: 0,
      total: 23_000_000,
      status: "selesai",
      stockRestored: true,
      createdAt: "2026-09-03T08:10:00.000Z",
      note: "Ilustrasi pesanan. Tidak ada dana yang ditarik.",
    },
    {
      id: "order-ill-3",
      number: "AL-2609-2744",
      userId: ALYA_ID,
      illustration: true,
      customer: { name: alya.name, email: alya.email, phone: alya.phone },
      address,
      shipping: { id: "regular", name: "Ekspedisi reguler", eta: "4–7 hari kerja", cost: 165_000 },
      paymentMethod: "va",
      paymentState: "tercatat",
      items: [line("p-cedar", 1, "Cedar"), line("p-brera", 2, "Ivory")],
      subtotal: 27_200_000,
      discount: 0,
      voucherCode: null,
      shippingCost: 165_000,
      total: 27_365_000,
      status: "dikirim",
      stockRestored: true,
      createdAt: "2026-09-28T03:40:00.000Z",
      note: "Ilustrasi pesanan. Tidak ada dana yang ditarik.",
    },
    {
      id: "order-ill-4",
      number: "AL-2610-3011",
      userId: ALYA_ID,
      illustration: true,
      customer: { name: alya.name, email: alya.email, phone: alya.phone },
      address,
      shipping: { id: "pickup", name: "Ambil di studio", eta: "Siap dalam 2 hari kerja", cost: 0 },
      paymentMethod: "kartu",
      paymentState: "tercatat",
      items: [line("p-linie", 1, "Walnut"), line("p-form", 1, "Charcoal")],
      subtotal: 17_250_000,
      discount: 500_000,
      voucherCode: "STUDIO500",
      shippingCost: 0,
      total: 16_750_000,
      status: "diproses",
      stockRestored: true,
      createdAt: "2026-10-16T06:15:00.000Z",
      note: "Ilustrasi pesanan. Tidak ada dana yang ditarik.",
    },
    {
      id: "order-ill-5",
      number: "AL-2611-1180",
      userId: ALYA_ID,
      illustration: true,
      customer: { name: alya.name, email: alya.email, phone: alya.phone },
      address,
      shipping: { id: "regular", name: "Ekspedisi reguler", eta: "2–4 hari kerja", cost: 85_000 },
      paymentMethod: "transfer",
      paymentState: "tercatat",
      items: [line("p-arc", 2, "Brass"), line("p-mesa", 1, "Sand")],
      subtotal: 15_300_000,
      discount: 1_530_000,
      voucherCode: "RUMAH10",
      shippingCost: 85_000,
      total: 13_855_000,
      status: "dibayar",
      stockRestored: true,
      createdAt: "2026-11-02T09:05:00.000Z",
      note: "Ilustrasi pesanan. Tidak ada dana yang ditarik.",
    },
    {
      id: "order-ill-6",
      number: "AL-2611-1402",
      userId: ALYA_ID,
      illustration: true,
      customer: { name: alya.name, email: alya.email, phone: alya.phone },
      address,
      shipping: { id: "express", name: "Ekspedisi ekspres", eta: "1–2 hari kerja", cost: 157_000 },
      paymentMethod: "qris",
      paymentState: "menunggu",
      items: [line("p-sol", 2, "Sand"), line("p-luna", 1, "Oak")],
      subtotal: 6_700_000,
      discount: 0,
      voucherCode: null,
      shippingCost: 157_000,
      total: 6_857_000,
      status: "menunggu_pembayaran",
      stockRestored: true,
      createdAt: "2026-11-15T11:25:00.000Z",
      note: "Ilustrasi pesanan. Tidak ada dana yang ditarik.",
    },
  ]

  return {
    products: seedProducts,
    categories: seedCategories,
    users: [admin, alya],
    sessionUserId: null,
    cart: [],
    voucherCode: null,
    orders,
    wishlists: { [ALYA_ID]: ["p-halo", "p-haven"] },
    newsletter: ["alya@atelierliving.id"],
    messages: [
      {
        id: "msg-1",
        name: "Raka Widjaja",
        email: "raka@atelierliving.id",
        topic: "Penataan ruang keluarga",
        message: "Saya ingin menata ruang 4×6 dengan sofa rendah dan satu lampu lantai. Mohon saran jarak antar kaki meja.",
        createdAt: "2026-11-10T02:30:00.000Z",
        read: false,
      },
    ],
    flashEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
  }
}

function readStore(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Persisted
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.users)) return null
    return parsed
  } catch {
    return null
  }
}

type Notice = { id: number; text: string }

type CheckoutInput = {
  customer: { name: string; email: string; phone: string }
  address: Address
  shipping: Order["shipping"]
  paymentMethod: PaymentMethod
  note: string
  saveAddress: boolean
}

type StoreValue = {
  ready: boolean
  products: Product[]
  categories: Category[]
  user: PublicUser | null
  directory: PublicUser[]
  cart: CartLine[]
  orders: Order[]
  wishlist: string[]
  newsletter: string[]
  messages: StudioMessage[]
  voucherCode: string | null
  flashEndsAt: string
  notice: Notice | null
  dismissNotice: () => void
  notify: (text: string) => void
  register: (input: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: true } | { ok: false; error: string }>
  login: (email: string, password: string) => Promise<{ ok: true; role: PublicUser["role"] } | { ok: false; error: string }>
  logout: () => void
  updateProfile: (input: { name: string; phone: string; address: Address | null }) => { ok: true } | { ok: false; error: string }
  addToCart: (productId: string, color: string, qty: number) => { ok: true } | { ok: false; error: string }
  setQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  toggleLine: (lineId: string) => void
  setAllSelected: (selected: boolean) => void
  selectOnly: (productId: string, color: string) => void
  applyVoucher: (code: string) => { ok: true } | { ok: false; error: string }
  clearVoucher: () => void
  toggleWishlist: (productId: string) => void
  placeOrder: (input: CheckoutInput) => { ok: true; order: Order } | { ok: false; error: string }
  confirmSimulatedPayment: (orderId: string) => { ok: true } | { ok: false; error: string }
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  saveProduct: (product: Product) => { ok: true } | { ok: false; error: string }
  deleteProduct: (productId: string) => void
  saveCategory: (category: Category) => { ok: true } | { ok: false; error: string }
  deleteCategory: (categoryId: string) => { ok: true } | { ok: false; error: string }
  subscribe: (email: string) => { ok: true } | { ok: false; error: string }
  sendMessage: (input: { name: string; email: string; topic: string; message: string }) => { ok: true } | { ok: false; error: string }
  markMessageRead: (id: string) => void
  exportData: () => void
  importData: (raw: string) => { ok: true } | { ok: false; error: string }
  resetStore: () => Promise<void>
  priceOf: (product: Product) => number
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Persisted | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    let active = true
    const existing = readStore()
    if (existing) {
      setDb(existing)
      return
    }
    createInitialStore().then((initial) => {
      if (!active) return
      localStorage.setItem(KEY, JSON.stringify(initial))
      setDb(initial)
    })
    return () => {
      active = false
    }
  }, [])

  const commit = (recipe: (current: Persisted) => Persisted) => {
    setDb((current) => {
      if (!current) return current
      const next = recipe(current)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  const notify = (text: string) => setNotice({ id: Date.now(), text })

  const value = useMemo<StoreValue | null>(() => {
    if (!db) return null
    const user = db.users.find((item) => item.id === db.sessionUserId) ?? null
    const wishlistKey = user?.id ?? "guest"

    const priceOf = (product: Product) => unitPrice(product, db.flashEndsAt)

    return {
      ready: true,
      products: db.products,
      categories: db.categories,
      user: user ? toPublic(user) : null,
      directory: db.users.map(toPublic),
      cart: db.cart,
      orders: db.orders,
      wishlist: db.wishlists[wishlistKey] ?? [],
      newsletter: db.newsletter,
      messages: db.messages,
      voucherCode: db.voucherCode,
      flashEndsAt: db.flashEndsAt,
      notice,
      dismissNotice: () => setNotice(null),
      notify,
      priceOf,
      async register(input) {
        const name = input.name.trim()
        const email = input.email.trim().toLowerCase()
        const phone = input.phone.trim()
        if (name.length < 3) return { ok: false, error: "Nama lengkap minimal 3 huruf." }
        if (!isEmail(email)) return { ok: false, error: "Masukkan email yang valid." }
        if (!isPhone(phone)) return { ok: false, error: "Nomor WhatsApp diawali 08 atau +62." }
        if (input.password.length < 8) return { ok: false, error: "Kata sandi minimal 8 karakter." }
        if (db.users.some((item) => item.email === email)) {
          return { ok: false, error: "Email ini sudah terdaftar. Silakan masuk." }
        }
        const salt = crypto.randomUUID()
        const passwordHash = await hashPassword(input.password, salt)
        const created: StoredUser = {
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          passwordSalt: salt,
          passwordHash,
          role: "customer",
          address: null,
          createdAt: new Date().toISOString(),
        }
        commit((current) => ({
          ...current,
          users: [...current.users, created],
          sessionUserId: created.id,
          orders: current.orders.map((order) =>
            !order.userId && order.customer.email.toLowerCase() === email
              ? { ...order, userId: created.id }
              : order,
          ),
          wishlists: {
            ...current.wishlists,
            [created.id]: Array.from(
              new Set([...(current.wishlists[created.id] ?? []), ...(current.wishlists.guest ?? [])]),
            ),
            guest: [],
          },
        }))
        return { ok: true }
      },
      async login(email, password) {
        const found = db.users.find((item) => item.email === email.trim().toLowerCase())
        if (!found) return { ok: false, error: "Email atau kata sandi tidak sesuai." }
        const hash = await hashPassword(password, found.passwordSalt)
        if (hash !== found.passwordHash) return { ok: false, error: "Email atau kata sandi tidak sesuai." }
        commit((current) => ({
          ...current,
          sessionUserId: found.id,
          wishlists: {
            ...current.wishlists,
            [found.id]: Array.from(
              new Set([...(current.wishlists[found.id] ?? []), ...(current.wishlists.guest ?? [])]),
            ),
            guest: [],
          },
        }))
        return { ok: true, role: found.role }
      },
      logout() {
        commit((current) => ({ ...current, sessionUserId: null }))
      },
      updateProfile(input) {
        if (!user) return { ok: false, error: "Masuk terlebih dahulu." }
        if (input.name.trim().length < 3) return { ok: false, error: "Nama lengkap minimal 3 huruf." }
        if (!isPhone(input.phone)) return { ok: false, error: "Nomor WhatsApp tidak valid." }
        commit((current) => ({
          ...current,
          users: current.users.map((item) =>
            item.id === user.id
              ? { ...item, name: input.name.trim(), phone: input.phone.trim(), address: input.address }
              : item,
          ),
        }))
        return { ok: true }
      },
      addToCart(productId, color, qty) {
        let result: { ok: true } | { ok: false; error: string } = { ok: true }
        commit((current) => {
          const product = current.products.find((item) => item.id === productId)
          if (!product) {
            result = { ok: false, error: "Produk tidak ditemukan." }
            return current
          }
          if (product.stock < 1) {
            result = { ok: false, error: "Stok produk ini habis." }
            return current
          }
          const match = current.cart.find((line) => line.productId === productId && line.color === color)
          const nextQty = (match?.qty ?? 0) + qty
          if (nextQty > product.stock) {
            result = { ok: false, error: `Stok tersedia ${product.stock}.` }
            return current
          }
          const cart = match
            ? current.cart.map((line) =>
                line.id === match.id ? { ...line, qty: line.qty + qty, selected: true } : line,
              )
            : [...current.cart, { id: crypto.randomUUID(), productId, color, qty, selected: true }]
          return { ...current, cart }
        })
        return result
      },
      setQty(lineId, qty) {
        commit((current) => ({
          ...current,
          cart: current.cart.flatMap((line) => {
            if (line.id !== lineId) return [line]
            const product = current.products.find((item) => item.id === line.productId)
            if (!product) return []
            const next = Math.max(1, Math.min(qty, product.stock))
            return [{ ...line, qty: next }]
          }),
        }))
      },
      removeLine(lineId) {
        commit((current) => ({ ...current, cart: current.cart.filter((line) => line.id !== lineId) }))
      },
      toggleLine(lineId) {
        commit((current) => ({
          ...current,
          cart: current.cart.map((line) => (line.id === lineId ? { ...line, selected: !line.selected } : line)),
        }))
      },
      setAllSelected(selected) {
        commit((current) => ({
          ...current,
          cart: current.cart.map((line) => ({ ...line, selected })),
        }))
      },
      selectOnly(productId, color) {
        commit((current) => ({
          ...current,
          cart: current.cart.map((line) => ({
            ...line,
            selected: line.productId === productId && line.color === color,
          })),
        }))
      },
      applyVoucher(code) {
        const selected = selectedLines(db.cart)
        const subtotal = selected.reduce((sum, line) => {
          const product = db.products.find((item) => item.id === line.productId)
          return product ? sum + priceOf(product) * line.qty : sum
        }, 0)
        const result = voucherResult(code, subtotal)
        if (!result.voucher || result.error) {
          return { ok: false, error: result.error ?? "Voucher tidak dapat dipakai." }
        }
        commit((current) => ({ ...current, voucherCode: result.voucher!.code }))
        return { ok: true }
      },
      clearVoucher() {
        commit((current) => ({ ...current, voucherCode: null }))
      },
      toggleWishlist(productId) {
        commit((current) => {
          const key = current.sessionUserId ?? "guest"
          const list = current.wishlists[key] ?? []
          const next = list.includes(productId) ? list.filter((id) => id !== productId) : [...list, productId]
          return { ...current, wishlists: { ...current.wishlists, [key]: next } }
        })
      },
      placeOrder(input) {
        const name = input.customer.name.trim()
        const email = input.customer.email.trim().toLowerCase()
        if (name.length < 3) return { ok: false, error: "Nama lengkap belum lengkap." }
        if (!isEmail(email)) return { ok: false, error: "Email belum valid." }
        if (!isPhone(input.customer.phone)) return { ok: false, error: "Nomor WhatsApp belum valid." }
        if (!input.address.province || !input.address.city || !input.address.district) {
          return { ok: false, error: "Lengkapi provinsi, kota, dan kecamatan." }
        }
        if (!/^\d{5}$/.test(input.address.postalCode)) {
          return { ok: false, error: "Kode pos harus 5 digit." }
        }
        if (input.address.line.trim().length < 8) {
          return { ok: false, error: "Alamat lengkap masih terlalu pendek." }
        }
        const chosen = selectedLines(db.cart)
        if (chosen.length === 0) return { ok: false, error: "Pilih minimal satu barang di keranjang." }

        let error: string | null = null
        const items = chosen.flatMap((line) => {
          const product = db.products.find((item) => item.id === line.productId)
          if (!product) {
            error = "Ada produk yang sudah tidak ada di katalog."
            return []
          }
          if (line.qty > product.stock) {
            error = `Stok ${product.name} tinggal ${product.stock}.`
            return []
          }
          return [
            {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: product.images[0] ?? "",
              color: line.color,
              qty: line.qty,
              unitPrice: priceOf(product),
            },
          ]
        })
        if (error) return { ok: false, error }
        const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
        const priced = voucherResult(db.voucherCode, subtotal)
        if (db.voucherCode && priced.error) return { ok: false, error: priced.error }
        const sequence = db.orders.filter((order) => !order.illustration).length + 1
        const order: Order = {
          id: crypto.randomUUID(),
          number: `AL-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(1400 + sequence).padStart(4, "0")}`,
          userId: user?.id ?? null,
          illustration: false,
          customer: { name, email, phone: input.customer.phone.trim() },
          address: { ...input.address, line: input.address.line.trim() },
          shipping: input.shipping,
          paymentMethod: input.paymentMethod,
          paymentState: "menunggu",
          items,
          subtotal,
          discount: priced.discount,
          voucherCode: priced.discount > 0 ? priced.voucher?.code ?? null : null,
          shippingCost: input.shipping.cost,
          total: Math.max(0, subtotal - priced.discount + input.shipping.cost),
          status: "menunggu_pembayaran",
          stockRestored: false,
          createdAt: new Date().toISOString(),
          note: input.note.trim() || "Pembayaran simulasi. Tidak ada dana yang ditarik.",
        }
        commit((current) => ({
          ...current,
          products: current.products.map((product) => {
            const bought = items.find((item) => item.productId === product.id)
            return bought ? { ...product, stock: product.stock - bought.qty } : product
          }),
          cart: current.cart.filter((line) => !line.selected),
          voucherCode: null,
          orders: [order, ...current.orders],
          users:
            user && input.saveAddress
              ? current.users.map((item) =>
                  item.id === user.id ? { ...item, name, phone: input.customer.phone.trim(), address: order.address } : item,
                )
              : current.users,
        }))
        return { ok: true, order }
      },
      confirmSimulatedPayment(orderId) {
        const order = db.orders.find((item) => item.id === orderId)
        if (!order) return { ok: false, error: "Pesanan tidak ditemukan." }
        if (order.status === "dibatalkan") return { ok: false, error: "Pesanan ini sudah dibatalkan." }
        commit((current) => ({
          ...current,
          orders: current.orders.map((item) =>
            item.id === orderId
              ? {
                  ...item,
                  paymentState: "tercatat",
                  status: item.status === "menunggu_pembayaran" ? "dibayar" : item.status,
                  note: item.illustration
                    ? item.note
                    : "Simulasi pembayaran tercatat di peramban ini. Tidak ada dana yang ditarik.",
                }
              : item,
          ),
        }))
        return { ok: true }
      },
      updateOrderStatus(orderId, status) {
        commit((current) => {
          const order = current.orders.find((item) => item.id === orderId)
          if (!order) return current
          let products = current.products
          const next: Order = { ...order, status }
          if ((status === "dibayar" || status === "diproses" || status === "dikirim" || status === "selesai") && next.paymentState === "menunggu") {
            next.paymentState = "tercatat"
          }
          if (status === "dibatalkan" && !order.stockRestored && !order.illustration) {
            products = products.map((product) => {
              const bought = order.items.find((item) => item.productId === product.id)
              return bought ? { ...product, stock: product.stock + bought.qty } : product
            })
            next.stockRestored = true
          }
          return {
            ...current,
            products,
            orders: current.orders.map((item) => (item.id === orderId ? next : item)),
          }
        })
      },
      saveProduct(product) {
        const name = product.name.trim()
        const slug = product.slug.trim()
        if (name.length < 3) return { ok: false, error: "Nama produk terlalu pendek." }
        if (!slug) return { ok: false, error: "Slug produk wajib diisi." }
        if (product.price < 1000) return { ok: false, error: "Harga belum masuk akal." }
        if (product.images.filter(Boolean).length === 0) return { ok: false, error: "Tambahkan minimal satu URL gambar." }
        if (db.products.some((item) => item.slug === slug && item.id !== product.id)) {
          return { ok: false, error: "Slug sudah dipakai produk lain." }
        }
        if (!db.categories.some((item) => item.id === product.categoryId)) {
          return { ok: false, error: "Pilih kategori yang ada." }
        }
        const clean: Product = {
          ...product,
          name,
          slug,
          images: product.images.map((image) => image.trim()).filter(Boolean),
          colors: product.colors.length ? product.colors : [{ name: "Walnut", hex: "#6b4f3a" }],
        }
        commit((current) => {
          const exists = current.products.some((item) => item.id === clean.id)
          return {
            ...current,
            products: exists
              ? current.products.map((item) => (item.id === clean.id ? clean : item))
              : [clean, ...current.products],
          }
        })
        return { ok: true }
      },
      deleteProduct(productId) {
        commit((current) => ({
          ...current,
          products: current.products.filter((item) => item.id !== productId),
          cart: current.cart.filter((line) => line.productId !== productId),
        }))
      },
      saveCategory(category) {
        if (category.name.trim().length < 2) return { ok: false, error: "Nama kategori terlalu pendek." }
        if (!category.slug.trim()) return { ok: false, error: "Slug kategori wajib diisi." }
        if (db.categories.some((item) => item.slug === category.slug && item.id !== category.id)) {
          return { ok: false, error: "Slug kategori sudah dipakai." }
        }
        const clean = { ...category, name: category.name.trim(), slug: category.slug.trim(), tagline: category.tagline.trim() }
        commit((current) => {
          const exists = current.categories.some((item) => item.id === clean.id)
          return {
            ...current,
            categories: exists
              ? current.categories.map((item) => (item.id === clean.id ? clean : item))
              : [...current.categories, clean],
          }
        })
        return { ok: true }
      },
      deleteCategory(categoryId) {
        if (db.products.some((item) => item.categoryId === categoryId)) {
          return { ok: false, error: "Masih ada produk di kategori ini." }
        }
        commit((current) => ({
          ...current,
          categories: current.categories.filter((item) => item.id !== categoryId),
        }))
        return { ok: true }
      },
      subscribe(email) {
        const clean = email.trim().toLowerCase()
        if (!isEmail(clean)) return { ok: false, error: "Email belum valid." }
        if (db.newsletter.includes(clean)) return { ok: false, error: "Email ini sudah terdaftar di surat studio." }
        commit((current) => ({ ...current, newsletter: [...current.newsletter, clean] }))
        return { ok: true }
      },
      sendMessage(input) {
        if (input.name.trim().length < 3) return { ok: false, error: "Nama belum lengkap." }
        if (!isEmail(input.email)) return { ok: false, error: "Email belum valid." }
        if (input.message.trim().length < 12) return { ok: false, error: "Pesan masih terlalu pendek." }
        const message: StudioMessage = {
          id: crypto.randomUUID(),
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          topic: input.topic.trim() || "Pertanyaan umum",
          message: input.message.trim(),
          createdAt: new Date().toISOString(),
          read: false,
        }
        commit((current) => ({ ...current, messages: [message, ...current.messages] }))
        return { ok: true }
      },
      markMessageRead(id) {
        commit((current) => ({
          ...current,
          messages: current.messages.map((item) => (item.id === id ? { ...item, read: true } : item)),
        }))
      },
      exportData() {
        const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = "atelier-living-data.json"
        anchor.click()
        URL.revokeObjectURL(url)
      },
      importData(raw) {
        try {
          const parsed = JSON.parse(raw) as Persisted
          if (!Array.isArray(parsed.products) || !Array.isArray(parsed.orders) || !Array.isArray(parsed.users)) {
            return { ok: false, error: "Berkas tidak berisi data toko." }
          }
          localStorage.setItem(KEY, JSON.stringify(parsed))
          setDb(parsed)
          return { ok: true }
        } catch {
          return { ok: false, error: "Berkas tidak bisa dibaca." }
        }
      },
      async resetStore() {
        localStorage.removeItem(KEY)
        const initial = await createInitialStore()
        localStorage.setItem(KEY, JSON.stringify(initial))
        setDb(initial)
      },
    }
  }, [db, notice])

  if (!value) {
    return <StoreContext.Provider value={null}>{children}</StoreContext.Provider>
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
      {notice ? (
        <div className="fixed bottom-4 left-1/2 z-[70] w-[min(92vw,420px)] -translate-x-1/2 rounded-full bg-charcoal px-4 py-3 text-center text-sm text-ivory shadow-lg">
          <button type="button" onClick={() => setNotice(null)} className="w-full">
            {notice.text}
          </button>
        </div>
      ) : null}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) {
    throw new Error("Store belum siap")
  }
  return value
}

export function useOptionalStore() {
  return useContext(StoreContext)
}

export function flashActive(flashEndsAt: string) {
  return saleIsLive(flashEndsAt)
}
