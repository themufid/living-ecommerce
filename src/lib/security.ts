export async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`atelier-living:${salt}:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isPhone(value: string) {
  const digits = value.replace(/[^\d+]/g, "")
  return /^(\+62|62|0)8\d{8,12}$/.test(digits)
}
