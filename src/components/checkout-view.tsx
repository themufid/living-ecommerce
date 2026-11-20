"use client"

import { Button, Field, SelectInput, TextArea, TextInput } from "@/components/ui"
import { paymentMethods, shippingOptions, voucherResult } from "@/lib/commerce"
import { paymentLabel, rupiah } from "@/lib/format"
import { citiesOf, districtsOf, regions } from "@/lib/regions"
import { useStore } from "@/lib/store"
import type { Order, PaymentMethod } from "@/lib/types"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

const steps = ["Data pembeli", "Alamat", "Pengiriman", "Pembayaran", "Konfirmasi"]

export function CheckoutView() {
  const store = useStore()
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [name, setName] = useState(store.user?.name ?? "")
  const [email, setEmail] = useState(store.user?.email ?? "")
  const [phone, setPhone] = useState(store.user?.phone ?? "")
  const [province, setProvince] = useState(store.user?.address?.province ?? "")
  const [city, setCity] = useState(store.user?.address?.city ?? "")
  const [district, setDistrict] = useState(store.user?.address?.district ?? "")
  const [postalCode, setPostalCode] = useState(store.user?.address?.postalCode ?? "")
  const [line, setLine] = useState(store.user?.address?.line ?? "")
  const [shippingId, setShippingId] = useState("regular")
  const [payment, setPayment] = useState<PaymentMethod>("transfer")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [note, setNote] = useState("")
  const [saveAddress, setSaveAddress] = useState(Boolean(store.user))
  const [ack, setAck] = useState(false)

  const lines = store.cart
    .filter((item) => item.selected)
    .map((item) => ({ item, product: store.products.find((product) => product.id === item.productId) }))
    .filter((entry) => entry.product)
  const subtotal = lines.reduce((sum, entry) => sum + store.priceOf(entry.product!) * entry.item.qty, 0)
  const discount = voucherResult(store.voucherCode, subtotal).discount
  const options = useMemo(() => (province ? shippingOptions(province, subtotal) : []), [province, subtotal])
  const shipping = options.find((option) => option.id === shippingId) ?? options[0]
  const total = Math.max(0, subtotal - discount + (shipping?.cost ?? 0))

  useEffect(() => {
    const raw = sessionStorage.getItem("atelier-checkout-draft")
    if (!raw) return
    try {
      const draft = JSON.parse(raw) as Partial<{
        step: number
        name: string
        email: string
        phone: string
        province: string
        city: string
        district: string
        postalCode: string
        line: string
        shippingId: string
        payment: PaymentMethod
        note: string
        saveAddress: boolean
      }>
      if (draft.name) setName(draft.name)
      if (draft.email) setEmail(draft.email)
      if (draft.phone) setPhone(draft.phone)
      if (draft.province) setProvince(draft.province)
      if (draft.city) setCity(draft.city)
      if (draft.district) setDistrict(draft.district)
      if (draft.postalCode) setPostalCode(draft.postalCode)
      if (draft.line) setLine(draft.line)
      if (draft.shippingId) setShippingId(draft.shippingId)
      if (draft.payment) setPayment(draft.payment)
      if (draft.note) setNote(draft.note)
      if (typeof draft.saveAddress === "boolean") setSaveAddress(draft.saveAddress)
      if (typeof draft.step === "number" && draft.step < 4) setStep(draft.step)
    } catch {
      sessionStorage.removeItem("atelier-checkout-draft")
    }
  }, [])

  useEffect(() => {
    if (order) return
    sessionStorage.setItem(
      "atelier-checkout-draft",
      JSON.stringify({ step, name, email, phone, province, city, district, postalCode, line, shippingId, payment, note, saveAddress }),
    )
  }, [step, name, email, phone, province, city, district, postalCode, line, shippingId, payment, note, saveAddress, order])

  const next = () => {
    setError("")
    if (step === 0) {
      if (name.trim().length < 3 || !email.includes("@") || phone.trim().length < 10) {
        setError("Lengkapi nama, email, dan nomor WhatsApp.")
        return
      }
    }
    if (step === 1) {
      if (!province || !city || !district || !/^\d{5}$/.test(postalCode) || line.trim().length < 8) {
        setError("Lengkapi alamat. Kode pos 5 digit.")
        return
      }
    }
    if (step === 2 && !shipping) {
      setError("Pilih metode pengiriman.")
      return
    }
    if (step === 3) {
      if (!ack) {
        setError("Centang pemahaman bahwa pembayaran ini simulasi.")
        return
      }
      if (payment === "kartu") {
        const digits = cardNumber.replace(/\s/g, "")
        if (!/^\d{16}$/.test(digits) || cardName.trim().length < 3 || !/^\d{2}\/\d{2}$/.test(cardExpiry) || !/^\d{3}$/.test(cardCvv)) {
          setError("Periksa format kartu. Data ini tidak disimpan dan tidak dikirim.")
          return
        }
      }
      if (!shipping) return
      const result = store.placeOrder({
        customer: { name, email, phone },
        address: { province, city, district, postalCode, line },
        shipping: { id: shipping.id, name: shipping.name, eta: shipping.eta, cost: shipping.cost },
        paymentMethod: payment,
        note,
        saveAddress,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setCardNumber("")
      setCardCvv("")
      setOrder(result.order)
      sessionStorage.removeItem("atelier-checkout-draft")
      setStep(4)
      return
    }
    setStep((value) => Math.min(4, value + 1))
  }

  if (!order && lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl">Tidak ada barang terpilih</h1>
        <p className="mt-3 text-sm text-muted">Centang produk di keranjang sebelum checkout.</p>
        <Link href="/keranjang" className="mt-6 inline-block">
          <Button>Kembali ke keranjang</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="font-serif text-5xl">Checkout</h1>
      <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {steps.map((label, index) => (
          <li key={label} className={`min-h-11 px-3 py-2 text-xs tracking-wide ${index === step ? "bg-charcoal text-ivory" : "bg-paper text-muted"}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="border border-sand bg-paper p-5 md:p-7">
          {step === 0 ? (
            <div className="grid gap-4">
              <Field label="Nama lengkap">
                <TextInput value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
              </Field>
              <Field label="Email">
                <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
              </Field>
              <Field label="Nomor WhatsApp">
                <TextInput value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="08…" />
              </Field>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="grid gap-4">
              <Field label="Provinsi">
                <SelectInput
                  value={province}
                  onChange={(event) => {
                    setProvince(event.target.value)
                    setCity("")
                    setDistrict("")
                  }}
                >
                  <option value="">Pilih provinsi</option>
                  {regions.map((region) => (
                    <option key={region.province}>{region.province}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Kota">
                <SelectInput
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value)
                    setDistrict("")
                  }}
                >
                  <option value="">Pilih kota</option>
                  {citiesOf(province).map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Kecamatan">
                <SelectInput value={district} onChange={(event) => setDistrict(event.target.value)}>
                  <option value="">Pilih kecamatan</option>
                  {districtsOf(province, city).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Kode pos">
                <TextInput value={postalCode} onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, "").slice(0, 5))} inputMode="numeric" />
              </Field>
              <Field label="Alamat lengkap">
                <TextArea value={line} onChange={(event) => setLine(event.target.value)} placeholder="Nama jalan, nomor, patokan" />
              </Field>
              {store.user ? (
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} />
                  Simpan sebagai alamat di profil
                </label>
              ) : (
                <p className="text-sm text-muted">
                  Belum punya akun? <Link href="/daftar" className="text-walnut">Daftar</Link> agar pesanan ini ikut tersimpan.
                </p>
              )}
            </div>
          ) : null}
          {step === 2 ? (
            <div className="space-y-3">
              {options.map((option) => (
                <label key={option.id} className={`block cursor-pointer border p-4 ${shippingId === option.id ? "border-charcoal" : "border-sand"}`}>
                  <span className="flex items-start gap-3">
                    <input type="radio" name="ship" checked={shippingId === option.id} onChange={() => setShippingId(option.id)} className="mt-1" />
                    <span>
                      <span className="block font-medium">{option.name}</span>
                      <span className="mt-1 block text-sm text-muted">{option.detail}</span>
                      <span className="mt-2 block text-sm">
                        {option.cost === 0 ? "Tanpa ongkir" : rupiah(option.cost)} · {option.eta}
                      </span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          ) : null}
          {step === 3 ? (
            <div className="space-y-4">
              <div className="border border-brass/40 bg-ivory px-4 py-3 text-sm leading-6">
                Pembayaran simulasi. Tidak ada transfer, QRIS, virtual account, atau kartu yang benar-benar diproses.
              </div>
              {paymentMethods.map((method) => (
                <label key={method.id} className={`block cursor-pointer border p-4 ${payment === method.id ? "border-charcoal" : "border-sand"}`}>
                  <span className="flex gap-3">
                    <input type="radio" name="pay" checked={payment === method.id} onChange={() => setPayment(method.id)} className="mt-1" />
                    <span>
                      <span className="block">{method.name}</span>
                      <span className="mt-1 block text-sm text-muted">{method.description}</span>
                    </span>
                  </span>
                </label>
              ))}
              {payment === "kartu" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nomor kartu">
                    <TextInput value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} inputMode="numeric" autoComplete="off" placeholder="16 digit" />
                  </Field>
                  <Field label="Nama di kartu">
                    <TextInput value={cardName} onChange={(event) => setCardName(event.target.value)} autoComplete="off" />
                  </Field>
                  <Field label="Kedaluwarsa">
                    <TextInput value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value)} placeholder="MM/YY" autoComplete="off" />
                  </Field>
                  <Field label="CVV">
                    <TextInput value={cardCvv} onChange={(event) => setCardCvv(event.target.value)} inputMode="numeric" autoComplete="off" />
                  </Field>
                  <p className="text-xs leading-5 text-muted sm:col-span-2">Angka kartu hanya dicek formatnya di peramban, lalu dibuang. Tidak disimpan di pesanan.</p>
                </div>
              ) : null}
              <Field label="Catatan untuk studio">
                <TextArea value={note} onChange={(event) => setNote(event.target.value)} />
              </Field>
              <label className="flex items-start gap-3 text-sm leading-6">
                <input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} className="mt-1" />
                Saya memahami pembayaran ini simulasi dan tidak memproses dana.
              </label>
            </div>
          ) : null}
          {step === 4 && order ? <Confirmation orderId={order.id} /> : null}
          {error ? <p className="mt-4 text-sm text-bark">{error}</p> : null}
          {step < 4 ? (
            <div className="mt-6 flex gap-3">
              {step > 0 ? (
                <Button variant="line" onClick={() => setStep((value) => value - 1)}>
                  Kembali
                </Button>
              ) : null}
              <Button onClick={next}>{step === 3 ? "Buat pesanan" : "Lanjut"}</Button>
            </div>
          ) : null}
        </div>
        <aside className="h-fit border border-sand p-5">
          <h2 className="font-serif text-3xl">Pesanan</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {(order ? order.items : lines.map((entry) => ({ name: entry.product!.name, qty: entry.item.qty, color: entry.item.color, unitPrice: store.priceOf(entry.product!) }))).map((item) => (
              <li key={`${item.name}-${item.color}`} className="flex justify-between gap-3">
                <span>
                  {item.name}
                  <span className="block text-xs text-muted">
                    {item.qty} · {item.color}
                  </span>
                </span>
                <span>{rupiah(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{rupiah(order?.subtotal ?? subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Diskon</dt>
              <dd>{rupiah(order?.discount ?? discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Ongkir</dt>
              <dd>{shipping || order ? rupiah(order?.shippingCost ?? shipping?.cost ?? 0) : "Pilih alamat"}</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt>Total</dt>
              <dd>{rupiah(order?.total ?? total)}</dd>
            </div>
          </dl>
          {order ? <p className="mt-3 text-xs text-muted">Metode: {paymentLabel[order.paymentMethod]} · simulasi</p> : null}
        </aside>
      </div>
    </div>
  )
}

function Confirmation({ orderId }: { orderId: string }) {
  const store = useStore()
  const order = store.orders.find((item) => item.id === orderId)
  if (!order) return null
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-walnut uppercase">Pesanan tercatat</p>
      <h2 className="mt-2 font-serif text-4xl">{order.number}</h2>
      <p className="mt-3 text-sm leading-6">
        Status: {order.status === "menunggu_pembayaran" ? "Menunggu pembayaran (simulasi)" : "Pembayaran simulasi tercatat"}
      </p>
      <PaymentPanel order={order} />
      {order.paymentState === "menunggu" ? (
        <Button
          className="mt-5"
          onClick={() => {
            const result = store.confirmSimulatedPayment(order.id)
            store.notify(result.ok ? "Simulasi pembayaran dicatat." : result.error)
          }}
        >
          Catat simulasi pembayaran
        </Button>
      ) : (
        <p className="mt-4 text-sm text-walnut">Simulasi pembayaran sudah dicatat. Tidak ada dana yang ditarik.</p>
      )}
      <Link href={`/pesanan/${order.id}`} className="mt-4 block text-sm text-walnut">
        Lihat detail pesanan
      </Link>
    </div>
  )
}

export function PaymentPanel({ order }: { order: Order }) {
  return (
    <div className="mt-5 border border-sand bg-ivory p-4 text-sm leading-6">
      <p className="font-medium">Instruksi simulasi · {paymentLabel[order.paymentMethod]}</p>
      {order.paymentMethod === "transfer" ? (
        <p className="mt-2">
          BRI 748801007027535 a.n. Rodhi (Atelier Living).
        </p>
      ) : null}
      {order.paymentMethod === "va" ? (
        <p className="mt-2">Virtual account simulasi: 8800{order.number.replace(/\D/g, "").slice(0, 10).padEnd(10, "0")}</p>
      ) : null}
      {order.paymentMethod === "qris" ? (
        <div className="mt-3">
          <QrMark seed={order.number} />
          <p className="mt-2">Gambar ini bukan kode QRIS yang bisa dipindai untuk membayar.</p>
        </div>
      ) : null}
      {order.paymentMethod === "kartu" ? <p className="mt-2">Tidak ada otorisasi kartu. Angka yang diketik tadi tidak disimpan.</p> : null}
    </div>
  )
}

function QrMark({ seed }: { seed: string }) {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const char = seed.charCodeAt(index % seed.length)
    return (char + index * 7) % 3 !== 0
  })
  return (
    <svg viewBox="0 0 90 90" className="h-36 w-36 bg-white p-1" role="img" aria-label="Gambar simulasi, bukan QR pembayaran">
      {cells.map((on, index) =>
        on ? <rect key={index} x={(index % 9) * 10} y={Math.floor(index / 9) * 10} width="8" height="8" fill="#1c1917" /> : null,
      )}
    </svg>
  )
}
