import { cn, discountPercent, rupiah } from "@/lib/format"
import type { Product } from "@/lib/types"
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

export function Button({
  variant = "solid",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "line" | "ghost" | "brass" }) {
  const styles = {
    solid: "bg-charcoal text-ivory hover:bg-bark",
    brass: "bg-walnut text-ivory hover:bg-bark",
    line: "border border-charcoal/15 bg-transparent text-charcoal hover:border-charcoal",
    ghost: "bg-transparent text-charcoal hover:bg-sand",
  }[variant]
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40",
        styles,
        className,
      )}
      {...props}
    />
  )
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.16em] text-muted uppercase">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-bark">{error}</span> : null}
      {hint && !error ? <span className="mt-1 block text-sm text-muted">{hint}</span> : null}
    </label>
  )
}

const control =
  "min-h-12 w-full border border-stone bg-paper px-3 text-sm text-charcoal outline-none transition placeholder:text-stone focus:border-walnut"

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-28 py-3", props.className)} />
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, props.className)} />
}

export function Stars({ value, count }: { value: number; count?: number }) {
  const rounded = Math.round(value)
  return (
    <p className="flex items-center gap-2 text-xs text-muted" aria-label={`Penilaian ${value.toFixed(1)} dari 5`}>
      <span className="tracking-tight text-brass" aria-hidden>
        {"★★★★★".slice(0, rounded)}
        <span className="text-stone">{"★★★★★".slice(rounded)}</span>
      </span>
      <span>
        {value.toFixed(1)}
        {typeof count === "number" ? ` · ${count}` : ""}
      </span>
    </p>
  )
}

export function PriceTag({ product, price }: { product: Product; price: number }) {
  const was =
    product.compareAtPrice && product.compareAtPrice > price
      ? product.compareAtPrice
      : product.price > price
        ? product.price
        : null
  const cut = discountPercent(price, was)
  return (
    <p className="flex flex-wrap items-baseline gap-2">
      <span className="text-sm">{rupiah(price)}</span>
      {was ? <span className="text-xs text-muted line-through">{rupiah(was)}</span> : null}
      {cut > 0 ? <span className="text-xs tracking-wide text-walnut">-{cut}%</span> : null}
    </p>
  )
}

export function StockNote({ stock }: { stock: number }) {
  if (stock <= 0) return <p className="text-xs text-bark">Stok habis</p>
  if (stock <= 4) return <p className="text-xs text-walnut">Sisa {stock}</p>
  return <p className="text-xs text-muted">Tersedia</p>
}

export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-10 pb-6 md:px-8 md:pt-14">
      <p className="text-xs tracking-[0.28em] text-walnut uppercase">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">{title}</h1>
      {text ? <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{text}</p> : null}
    </header>
  )
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="border border-sand bg-paper px-6 py-16 text-center">
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{text}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
