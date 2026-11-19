export type Category = {
  id: string
  slug: string
  name: string
  tagline: string
  image: string
}

export type ColorVariant = {
  name: string
  hex: string
}

export type Spec = {
  label: string
  value: string
}

export type ProductKind = "sofa" | "chair" | "table" | "bed" | "lamp" | "storage" | "decor"

export type Product = {
  id: string
  slug: string
  name: string
  categoryId: string
  price: number
  compareAtPrice: number | null
  flashPrice: number | null
  rating: number
  reviewCount: number
  stock: number
  popularity: number
  createdAt: string
  isNew: boolean
  isBestSeller: boolean
  images: string[]
  description: string
  details: string
  material: string
  dimensions: string
  specs: Spec[]
  colors: ColorVariant[]
  sku: string
  weightKg: number
  kind: ProductKind
  modelUrl: string | null
}

export type StoredUser = {
  id: string
  name: string
  email: string
  phone: string
  passwordSalt: string
  passwordHash: string
  role: "admin" | "customer"
  address: Address | null
  createdAt: string
}

export type PublicUser = Omit<StoredUser, "passwordSalt" | "passwordHash">

export type Address = {
  province: string
  city: string
  district: string
  postalCode: string
  line: string
}

export type CartLine = {
  id: string
  productId: string
  color: string
  qty: number
  selected: boolean
}

export type Voucher = {
  code: string
  type: "percent" | "flat"
  amount: number
  maxDiscount: number
  minSubtotal: number
  label: string
}

export type OrderStatus =
  | "menunggu_pembayaran"
  | "dibayar"
  | "diproses"
  | "dikirim"
  | "selesai"
  | "dibatalkan"

export type PaymentMethod = "transfer" | "qris" | "va" | "kartu"

export type OrderItem = {
  productId: string
  name: string
  slug: string
  image: string
  color: string
  qty: number
  unitPrice: number
}

export type Order = {
  id: string
  number: string
  userId: string | null
  illustration: boolean
  customer: { name: string; email: string; phone: string }
  address: Address
  shipping: { id: string; name: string; eta: string; cost: number }
  paymentMethod: PaymentMethod
  paymentState: "menunggu" | "tercatat"
  items: OrderItem[]
  subtotal: number
  discount: number
  voucherCode: string | null
  shippingCost: number
  total: number
  status: OrderStatus
  stockRestored: boolean
  createdAt: string
  note: string
}

export type StudioMessage = {
  id: string
  name: string
  email: string
  topic: string
  message: string
  createdAt: string
  read: boolean
}

export type Persisted = {
  products: Product[]
  categories: Category[]
  users: StoredUser[]
  sessionUserId: string | null
  cart: CartLine[]
  voucherCode: string | null
  orders: Order[]
  wishlists: Record<string, string[]>
  newsletter: string[]
  messages: StudioMessage[]
  flashEndsAt: string
}
