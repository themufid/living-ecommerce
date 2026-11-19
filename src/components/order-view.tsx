"use client"

import { PaymentPanel } from "@/components/checkout-view"
import { Button, EmptyState } from "@/components/ui"
import { formatDateTime, paymentLabel, rupiah, statusLabel } from "@/lib/format"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function OrderView({ id }: { id: string }) {
  const store = useStore()
  const order = store.orders.find((item) => item.id === id)
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <EmptyState title="Pesanan tidak ditemukan" text="Nomor ini tidak ada di peramban ini." action={<Link href="/akun/pesanan"><Button>Riwayat</Button></Link>} />
      </div>
    )
  }
  const owns = store.user && (store.user.role === "admin" || store.user.id === order.userId || store.user.email === order.customer.email)
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="text-xs tracking-[0.2em] text-walnut uppercase">{order.illustration ? "Ilustrasi pesanan" : "Pesanan"}</p>
      <h1 className="mt-2 font-serif text-5xl">{order.number}</h1>
      <p className="mt-3 text-sm text-muted">{formatDateTime(order.createdAt)}</p>
      {order.illustration ? (
        <p className="mt-4 border border-sand bg-paper px-4 py-3 text-sm leading-6">
          Pesanan ini ilustrasi untuk presentasi. Tidak ada pembayaran yang pernah diproses.
        </p>
      ) : (
        <p className="mt-4 border border-sand bg-paper px-4 py-3 text-sm leading-6">
          Status pembayaran bersifat simulasi. Tidak ada dana yang ditarik dari rekening, QRIS, atau kartu.
        </p>
      )}
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Status</dt>
          <dd>{statusLabel[order.status]}</dd>
        </div>
        <div>
          <dt className="text-muted">Pembayaran</dt>
          <dd>
            {paymentLabel[order.paymentMethod]} · {order.paymentState === "tercatat" ? "simulasi tercatat" : "menunggu simulasi"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Penerima</dt>
          <dd>
            {order.customer.name}
            <br />
            {order.customer.email}
            <br />
            {order.customer.phone}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Kirim ke</dt>
          <dd>
            {order.address.line}
            <br />
            {order.address.district}, {order.address.city}
            <br />
            {order.address.province} {order.address.postalCode}
          </dd>
        </div>
      </dl>
      <ul className="mt-6 divide-y divide-sand border-y border-sand">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.color}`} className="flex justify-between gap-3 py-3 text-sm">
            <span>
              <Link href={`/produk/${item.slug}`} className="font-medium">
                {item.name}
              </Link>
              <span className="block text-muted">
                {item.qty} · {item.color}
              </span>
            </span>
            <span>{rupiah(item.unitPrice * item.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{rupiah(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Diskon {order.voucherCode ? `(${order.voucherCode})` : ""}</dt>
          <dd>−{rupiah(order.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>
            {order.shipping.name} · {order.shipping.eta}
          </dt>
          <dd>{rupiah(order.shippingCost)}</dd>
        </div>
        <div className="flex justify-between text-base">
          <dt>Total</dt>
          <dd>{rupiah(order.total)}</dd>
        </div>
      </dl>
      <PaymentPanel order={order} />
      {order.paymentState === "menunggu" && order.status !== "dibatalkan" && (owns || !order.userId) ? (
        <Button className="mt-5" onClick={() => store.confirmSimulatedPayment(order.id)}>
          Catat simulasi pembayaran
        </Button>
      ) : null}
      {!owns && order.userId ? <p className="mt-4 text-sm text-muted">Masuk dengan email pesanan ini untuk melihatnya di riwayat akun.</p> : null}
    </div>
  )
}
