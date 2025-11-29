"use client"
import React from 'react'

interface Props {
  value?: string
  onChange: (url: string) => void
}

export default function CoverUpload({ value, onChange }: Props) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || '')
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || ''
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
    const data = await res.json()
    if (data.secure_url) onChange(data.secure_url)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl ring-1 ring-zinc-200 bg-white shadow-sm">
      <div className="h-36 w-full relative">
        {value ? <img src={value} alt="cover" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200" />}
        <label className="absolute right-4 bottom-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-white">
          Change Cover
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  )
}
