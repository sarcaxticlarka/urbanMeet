"use client"
import React from 'react'

interface Props {
  value?: string
  onChange: (url: string) => void
}

export default function AvatarUpload({ value, onChange }: Props) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Using existing ImageUploader approach: unsigned upload (placeholder)
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || '')
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || ''
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
    const data = await res.json()
    if (data.secure_url) onChange(data.secure_url)
  }

  return (
    <div className="space-y-2">
      <div className="h-28 w-28 overflow-hidden rounded-2xl ring-1 ring-zinc-200 bg-white shadow-sm flex items-center justify-center">
        {value ? <img src={value} alt="avatar" className="h-full w-full object-cover" /> : <span className="text-sm text-zinc-400">No avatar</span>}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
        Change Avatar
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  )
}
