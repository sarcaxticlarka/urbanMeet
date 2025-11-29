"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const { token } = params
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [strength, setStrength] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (password.length === 0) { setStrength(null); return }
    const controller = new AbortController()
    const run = async () => {
      try {
        const res = await API.get('/auth/password-strength', { params: { password }, signal: controller.signal })
        setStrength(res.data)
      } catch {}
    }
    run()
    return () => controller.abort()
  }, [password])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (password !== confirm) throw new Error('Passwords do not match')
      const res = await API.post('/auth/reset', { token, password })
      if (res.data.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/auth/login'), 1500)
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/30 to-black p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-sm text-zinc-300 mb-6">Choose a strong new password.</p>
        <form onSubmit={submit} className="space-y-4">
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="New password" required className="w-full rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" placeholder="Confirm password" required className={`w-full rounded-xl border ${confirm && confirm!==password ? 'border-red-500/60' : 'border-white/20'} bg-white/5 py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`} />
          {strength && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div className={`h-full transition-all ${strength.score===0?'w-1/5 bg-red-500':strength.score===1?'w-2/5 bg-orange-500':strength.score===2?'w-3/5 bg-yellow-500':strength.score===3?'w-4/5 bg-green-500':'w-full bg-emerald-500'}`}></div>
              </div>
              <p className="text-xs text-zinc-400">Strength: <span className="text-white font-medium">{strength.label}</span></p>
            </div>
          )}
          <button disabled={loading || password.length<8 || password!==confirm} className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 py-3 font-semibold text-white disabled:opacity-50">{loading ? 'Resetting...' : 'Reset Password'}</button>
          {error && <div className="text-sm text-red-400">{error}</div>}
          {success && <div className="text-sm text-green-400">Password reset! Redirecting...</div>}
        </form>
      </div>
    </div>
  )
}
