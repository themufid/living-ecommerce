"use client"

import { Button, TextInput } from "@/components/ui"
import { useStore } from "@/lib/store"
import { useState } from "react"

export function Newsletter({ dark = false }: { dark?: boolean }) {
  const store = useStore()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        const result = store.subscribe(email)
        setMessage(result.ok ? "Alamat Anda masuk daftar surat studio." : result.error)
        if (result.ok) setEmail("")
      }}
    >
      <TextInput
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email Anda"
        aria-label="Email untuk surat studio"
        className={dark ? "border-white/20 bg-transparent text-ivory placeholder:text-white/50" : ""}
      />
      <Button type="submit" variant={dark ? "line" : "solid"} className={dark ? "border-white/30 text-ivory hover:bg-white/10" : ""}>
        Berlangganan
      </Button>
      {message ? <p className="self-center text-sm sm:ml-2">{message}</p> : null}
    </form>
  )
}
