"use client"

import { useEffect, useState } from "react"

export function useCanRender3D() {
  const [can, setCan] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    setCan(!reduce && !connection?.saveData && Boolean(gl))
  }, [])
  return can
}
