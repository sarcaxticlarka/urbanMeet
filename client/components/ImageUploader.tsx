"use client"
import React, { useRef, useState } from 'react'

interface ImageUploaderProps {
  onChange: (url: string) => void
  value?: string
}

// Simple Cloudinary unsigned upload component.
// Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET env variables.
export default function ImageUploader({ onChange, value }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('No file chosen')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
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
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id="event-poster-input"
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-pink-300 bg-white px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50 disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 9l5-5 5 5"/><path d="M12 4v12"/></svg>
          Choose image
        </button>
        <span className="text-sm text-zinc-600">{fileName}</span>
        {uploading && <span className="text-xs text-pink-600 animate-pulse">Uploading...</span>}
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
