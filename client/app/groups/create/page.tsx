"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function CreateGroupPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const token = localStorage.getItem('token')
    if (!token || !isLoggedIn) {
      setError('Please login first')
      setLoading(false)
      return
    }
    try {
      const res = await API.post('/groups', { name, description, city }, { headers: { Authorization: `Bearer ${token}` } })
      router.push(`/groups/${res.data.group.id}`)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="w-full max-w-3xl rounded-[40px] shadow-2xl bg-white ring-1 ring-zinc-200 p-8 md:p-12">
        {!isLoggedIn && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 font-semibold">
            Please login first to create a group.
          </div>
        )}
        <div className="flex flex-col items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg">
            <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 text-center">Create a Group</h2>
          <p className="text-md text-zinc-500 text-center">Start a new community and bring people together</p>
        </div>
        <form onSubmit={submit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Group Name<span className="text-rose-500">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold focus:ring-2 focus:ring-pink-200" required />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-pink-600">Description<span className="text-rose-500">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your group in detail..." rows={5} className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold resize-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">City<span className="text-rose-500">*</span></label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold" required />
            </div>
          </div>
          <button disabled={loading || !isLoggedIn} className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 py-3 text-white font-bold shadow-lg hover:from-pink-600 hover:to-indigo-600 disabled:opacity-50 text-lg transition-all">
            {loading ? 'Creating...' : 'Create Group'}
          </button>
          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 font-semibold">{error}</div>}
        </form>
      </div>
    </div>
  )
}
