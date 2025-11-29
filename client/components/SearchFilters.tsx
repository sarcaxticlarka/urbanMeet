"use client"
import React, { useState } from 'react'

type Props = {
  onFilter: (filters: { city?: string; from?: string; to?: string }) => void
}

export default function SearchFilters({ onFilter }: Props) {
  const [city, setCity] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({ city, from, to })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 rounded-xl bg-white/20 p-4 backdrop-blur-md">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        className="rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60"
      />
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white"
      />
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white"
      />
      <button type="submit" className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
        Search
      </button>
    </form>
  )
}
