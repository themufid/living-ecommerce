"use client"

import { cn } from "@/lib/format"
import Image from "next/image"
import { useState } from "react"

export function Photo({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className="absolute inset-0 bg-sand" aria-hidden />
  }
  if (src.startsWith("https://images.unsplash.com/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  )
}
