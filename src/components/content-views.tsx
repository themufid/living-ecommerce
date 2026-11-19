"use client"

import { Photo } from "@/components/photo"
import { ProductCard } from "@/components/product-card"
import { Button, Field, TextArea, TextInput } from "@/components/ui"
import { useCanRender3D } from "@/components/use-3d"
import { designImage, promoImage, storyImage } from "@/lib/catalog"
import { vouchers } from "@/lib/commerce"
import { flashActive, useStore } from "@/lib/store"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"

const RoomCanvas = dynamic(() => import("@/components/visuals").then((mod) => mod.RoomCanvas), { ssr: false })

export function DesignView() {
  const can3d = useCanRender3D()
  const [showRoom, setShowRoom] = useState(false)
  return (
    <div>
      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 md:px-12">
          <p className="text-xs tracking-[0.22em] text-walnut uppercase">Desain</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">Discover Our Design</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Kami menyusun ruang dari tiga keputusan: tinggi dudukan, suhu cahaya, dan seberapa banyak lantai yang dibiarkan kosong. Sisanya mengikuti bahan.
          </p>
        </div>
        <div className="relative min-h-80 bg-sand">
          <Photo src={designImage} alt="Fasad rumah dengan bukaan lebar" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-serif text-4xl">Ruang yang bisa diputar</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Visual ini sketsa interior, bukan foto katalog. Putar untuk melihat hubungan sofa, meja, dan lampu. Jika perangkat memilih mode ringan, fotonya yang tampil.
            </p>
          </div>
          {can3d ? (
            <Button variant="line" onClick={() => setShowRoom((value) => !value)}>
              {showRoom ? "Tampilkan foto" : "Buka sketsa 3D"}
            </Button>
          ) : null}
        </div>
        <div className="relative mt-6 h-[460px] bg-sand">
          <Photo src={storyImage} alt="Sudut ruang dengan furnitur kayu" sizes="100vw" />
          {can3d && showRoom ? (
            <div className="absolute inset-0">
              <RoomCanvas />
            </div>
          ) : null}
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-3 md:px-8">
        {[
          ["Dudukan", "Tinggi 42–46 cm supaya lutut tidak lebih tinggi dari pinggul saat duduk lama."],
          ["Cahaya", "Bohlam hangat di bawah 2700K, diarahkan ke meja, bukan ke mata."],
          ["Lantai", "Satu karpet menahan kelompok duduk. Di luar karpet, lantai dibiarkan terbuka."],
        ].map(([title, text]) => (
          <article key={title} className="border border-sand bg-paper p-5">
            <h3 className="font-serif text-3xl">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export function PromoView() {
  const store = useStore()
  const live = flashActive(store.flashEndsAt)
  const flash = store.products.filter((product) => product.flashPrice && live)
  return (
    <div>
      <section className="relative min-h-[420px] bg-sand">
        <Photo src={promoImage} alt="Ruang dengan palet hangat" priority sizes="100vw" />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 py-10 text-ivory md:px-12">
          <p className="text-xs tracking-[0.22em] uppercase">Promo</p>
          <h1 className="mt-2 max-w-2xl font-serif text-5xl md:text-6xl">Potongan yang bisa dipakai di keranjang.</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-3 md:px-8">
        {vouchers.map((voucher) => (
          <article key={voucher.code} className="border border-sand bg-paper p-5">
            <p className="font-serif text-3xl">{voucher.code}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{voucher.label}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <h2 className="font-serif text-4xl">Flash sale</h2>
        {flash.length === 0 ? <p className="mt-4 text-sm text-muted">Gelombang flash sale sedang tidak berjalan.</p> : null}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flash.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link href="/koleksi" className="mt-8 inline-block">
          <Button variant="line">Lihat koleksi</Button>
        </Link>
      </section>
    </div>
  )
}

export function AboutView() {
  const store = useStore()
  const [form, setForm] = useState({ name: "", email: "", topic: "Penataan ruang", message: "" })
  const [note, setNote] = useState("")
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <p className="text-xs tracking-[0.22em] text-walnut uppercase">Studio</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl md:text-6xl">Rumah furnitur yang disusun seperti ruang, bukan seperti gudang.</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="relative min-h-80 bg-sand">
          <Photo src={storyImage} alt="Detail material di ruang duduk" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="text-sm leading-7 text-muted">
          <p>
            Atelier Living merancang sofa, tempat tidur, meja, lampu, dan objek kecil dalam satu palet: putih hangat, arang, beige, dan cokelat walnut.
          </p>
          <p className="mt-4">
            Studio menerima pertanyaan penataan lewat formulir ini. Pesan tersimpan untuk pengelola dan tidak dikirim ke server lain.
          </p>
        </div>
      </div>
      <form
        className="mt-12 grid max-w-2xl gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const result = store.sendMessage(form)
          setNote(result.ok ? "Pesan masuk ke studio." : result.error)
          if (result.ok) setForm({ name: "", email: "", topic: "Penataan ruang", message: "" })
        }}
      >
        <h2 className="font-serif text-4xl">Tulis ke studio</h2>
        <Field label="Nama">
          <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </Field>
        <Field label="Email">
          <TextInput type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </Field>
        <Field label="Topik">
          <TextInput value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} />
        </Field>
        <Field label="Pesan">
          <TextArea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
        </Field>
        {note ? <p className="text-sm">{note}</p> : null}
        <Button type="submit">Kirim</Button>
      </form>
    </div>
  )
}
