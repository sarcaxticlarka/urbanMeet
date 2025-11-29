"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'

export default function CompleteProfilePage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.replace('/auth/login')
    }
  }, [router])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // convert comma-separated interests to array
      const interestsArray = interests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      await API.patch('/users/me', { city, bio, interests: interestsArray })
      router.push('/profile')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl relative overflow-hidden rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 -z-10" />
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Complete your profile</h1>
          <p className="mt-2 text-sm text-zinc-300">Tell us a bit about yourself to get better event recommendations</p>
        </div>
        <form onSubmit={save} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Mumbai"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Interests</label>
              <input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="AI, Web, Hackathons"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <p className="mt-1 text-xs text-zinc-400">Comma-separated tags</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short introduction"
              rows={5}
              className="w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {error && (
            <div className="animate-shake rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10"
            >Skip for now</button>
            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-2.5 font-semibold text-white shadow-lg hover:shadow-purple-500/50 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Save and continue
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
