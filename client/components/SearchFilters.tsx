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

  const handleClear = () => {
    setCity('')
    setFrom('')
    setTo('')
    onFilter({ city: '', from: '', to: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-200">
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Filter by city..."
        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="From date"
        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="To date"
        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <button type="submit" className="rounded-md bg-pink-500 px-6 py-2 text-sm font-medium text-white hover:bg-pink-600 transition">
        Apply Filters
      </button>
      <button type="button" onClick={handleClear} className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition">
        Clear
      </button>
    </form>
  )
}
