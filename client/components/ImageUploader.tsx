"use client"
import React, { useState } from 'react'

interface ImageUploaderProps {
  onChange: (url: string) => void
  value?: string
}

// Simple Cloudinary unsigned upload component.
// Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET env variables.
export default function ImageUploader({ onChange, value }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!cloudName || !uploadPreset) {
      setError('Cloudinary env vars missing')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.secure_url) {
        onChange(data.secure_url)
      } else {
        setError('Upload failed')
      }
    } catch (err: any) {
      setError('Upload error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="text-sm text-white" />
        {uploading && <span className="text-xs text-pink-300 animate-pulse">Uploading...</span>}
      </div>
      {value && (
        <img src={value} alt="Poster" className="h-40 w-full object-cover rounded-xl border border-white/10" />
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
      {!cloudName && !uploadPreset && (
        <p className="text-xs text-zinc-400">Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable uploads.</p>
      )}
    </div>
  )
}
