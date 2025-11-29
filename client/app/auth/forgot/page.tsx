"use client"
import React, { useState } from 'react'
import API from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
      const res = await API.post('/auth/forgot', { email })
      setStatus('If the email exists, a reset link would be sent. Dev token: ' + (res.data.resetToken || 'hidden'))
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/30 to-black p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-sm text-zinc-300 mb-6">Enter your email to request a password reset.</p>
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 py-3 font-semibold text-white disabled:opacity-50">{loading ? 'Requesting...' : 'Request reset'}</button>
          {error && <div className="text-sm text-red-400">{error}</div>}
          {status && <div className="text-xs text-green-400 whitespace-pre-wrap">{status}</div>}
        </form>
      </div>
    </div>
  )
}
