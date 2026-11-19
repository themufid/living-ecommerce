"use client"

import { ProductCard } from "@/components/product-card"
import { Button, EmptyState, Field, SelectInput, TextArea, TextInput } from "@/components/ui"
import { formatDate, rupiah, statusLabel } from "@/lib/format"
import { citiesOf, districtsOf, regions } from "@/lib/regions"
import { useStore } from "@/lib/store"
import type { Address } from "@/lib/types"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

function AccessNote() {
  return (
    <details className="mt-8 border border-sand bg-paper px-4 py-3 text-sm">
      <summary className="min-h-11 cursor-pointer">Akses studio untuk presentasi</summary>
      <div className="mt-3 space-y-2 text-muted">
        <p>Pengelola: pengelola@atelierliving.id · Atelier#Living</p>
        <p>Pelanggan: alya@atelierliving.id · Living#Alya</p>
      </div>
    </details>
  )
}

export function LoginView() {
  const store = useStore()
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/akun"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-serif text-5xl">Masuk</h1>
      <p className="mt-3 text-sm text-muted">Akun tersimpan di peramban ini.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const result = await store.login(email, password)
          if (!result.ok) {
            setError(result.error)
            return
          }
          router.push(result.role === "admin" && next === "/akun" ? "/admin" : next)
        }}
      >
        <Field label="Email">
          <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </Field>
        <Field label="Kata sandi">
          <TextInput type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        </Field>
        {error ? <p className="text-sm text-bark">{error}</p> : null}
        <Button type="submit" className="w-full">
          Masuk
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Belum punya akun? <Link href="/daftar" className="text-walnut">Daftar</Link>
      </p>
      <AccessNote />
    </div>
  )
}

export function RegisterView() {
  const store = useStore()
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" })
  const [error, setError] = useState("")
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }))
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-serif text-5xl">Daftar</h1>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const result = await store.register(form)
          if (!result.ok) {
            setError(result.error)
            return
          }
          router.push("/akun")
        }}
      >
        <Field label="Nama lengkap">
          <TextInput value={form.name} onChange={(event) => set("name")(event.target.value)} autoComplete="name" />
        </Field>
        <Field label="Email">
          <TextInput type="email" value={form.email} onChange={(event) => set("email")(event.target.value)} autoComplete="email" />
        </Field>
        <Field label="Nomor WhatsApp">
          <TextInput value={form.phone} onChange={(event) => set("phone")(event.target.value)} autoComplete="tel" />
        </Field>
        <Field label="Kata sandi" hint="Minimal 8 karakter.">
          <TextInput type="password" value={form.password} onChange={(event) => set("password")(event.target.value)} autoComplete="new-password" />
        </Field>
        {error ? <p className="text-sm text-bark">{error}</p> : null}
        <Button type="submit" className="w-full">
          Buat akun
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Sudah terdaftar? <Link href="/masuk" className="text-walnut">Masuk</Link>
      </p>
    </div>
  )
}

export function ProfileView() {
  const store = useStore()
  const user = store.user
  const [name, setName] = useState(user?.name ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [address, setAddress] = useState<Address>(
    user?.address ?? { province: "", city: "", district: "", postalCode: "", line: "" },
  )
  const [message, setMessage] = useState("")
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <EmptyState title="Masuk untuk membuka akun" text="Profil, riwayat, dan wishlist menempel pada akun di peramban ini." action={<Link href="/masuk"><Button>Masuk</Button></Link>} />
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <h1 className="font-serif text-5xl">Halo, {user.name.split(" ")[0]}</h1>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/akun/pesanan" className="min-h-11 border border-sand px-4 py-3">Riwayat pesanan</Link>
        <Link href="/akun/wishlist" className="min-h-11 border border-sand px-4 py-3">Wishlist</Link>
        {user.role === "admin" ? <Link href="/admin" className="min-h-11 border border-sand px-4 py-3">Dasbor</Link> : null}
        <button type="button" className="min-h-11 px-4 text-muted" onClick={() => store.logout()}>
          Keluar
        </button>
      </div>
      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const result = store.updateProfile({
            name,
            phone,
            address: address.province ? address : null,
          })
          setMessage(result.ok ? "Profil diperbarui." : result.error)
        }}
      >
        <Field label="Nama lengkap">
          <TextInput value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Email">
          <TextInput value={user.email} disabled />
        </Field>
        <Field label="WhatsApp">
          <TextInput value={phone} onChange={(event) => setPhone(event.target.value)} />
        </Field>
        <Field label="Provinsi">
          <SelectInput value={address.province} onChange={(event) => setAddress({ ...address, province: event.target.value, city: "", district: "" })}>
            <option value="">Belum diisi</option>
            {regions.map((region) => (
              <option key={region.province}>{region.province}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Kota">
          <SelectInput value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value, district: "" })}>
            <option value="">Pilih kota</option>
            {citiesOf(address.province).map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Kecamatan">
          <SelectInput value={address.district} onChange={(event) => setAddress({ ...address, district: event.target.value })}>
            <option value="">Pilih kecamatan</option>
            {districtsOf(address.province, address.city).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Kode pos">
          <TextInput value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value.replace(/\D/g, "").slice(0, 5) })} />
        </Field>
        <Field label="Alamat">
          <TextArea value={address.line} onChange={(event) => setAddress({ ...address, line: event.target.value })} />
        </Field>
        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit">Simpan profil</Button>
      </form>
    </div>
  )
}

export function OrdersView() {
  const store = useStore()
  if (!store.user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <EmptyState title="Masuk untuk melihat pesanan" text="Riwayat menempel pada akun." action={<Link href="/masuk"><Button>Masuk</Button></Link>} />
      </div>
    )
  }
  const orders = store.orders.filter((order) => order.userId === store.user!.id || order.customer.email === store.user!.email)
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <h1 className="font-serif text-5xl">Pesanan</h1>
      {orders.length === 0 ? <div className="mt-8"><EmptyState title="Belum ada pesanan" text="Checkout dari keranjang akan muncul di sini." /></div> : null}
      <div className="mt-6 divide-y divide-sand border-y border-sand">
        {orders.map((order) => (
          <Link key={order.id} href={`/pesanan/${order.id}`} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="block font-medium">{order.number}</span>
              <span className="text-sm text-muted">{formatDate(order.createdAt)} · {statusLabel[order.status]}</span>
            </span>
            <span className="text-sm">
              {rupiah(order.total)}
              {order.illustration ? " · ilustrasi" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function WishlistView() {
  const store = useStore()
  const products = store.products.filter((product) => store.wishlist.includes(product.id))
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="font-serif text-5xl">Wishlist</h1>
      {products.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Belum ada yang disimpan" text="Ketuk hati pada kartu produk." action={<Link href="/koleksi"><Button>Lihat koleksi</Button></Link>} />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
