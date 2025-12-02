"use client"
export const dynamic = 'force-dynamic'
import React, { useEffect, useState } from 'react'
import { MdEmail, MdLock } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import API from '@/lib/api'
import { validateEmail } from '@/lib/validation'
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const emailValid = validateEmail(email)

  // If already authenticated, redirect away from login page
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/profile')
    }
  }, [isLoggedIn, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await API.post('/auth/login', { email, password })
      const { token } = res.data
      if (token) {
        login(token); // Use AuthContext to update state
        router.push('/profile')
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // While redirecting, avoid flashing the login form
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <p className="text-sm text-zinc-600">Redirecting to your profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[48px] bg-white shadow-xl overflow-hidden min-h-[420px]">
          {/* Top pink accent bar */}
          <div className="absolute -top-8 left-0 w-full h-12 bg-pink-200 rounded-t-[48px] z-0" style={{ transform: 'skewY(-3deg)' }} />
          {/* Illustration side with large centered image */}
          <div className="hidden md:flex flex-col items-center justify-center z-10 bg-gradient-to-b from-pink-50 to-white py-8">
            <Image
              src="/assets/peoplegrp.png"
              alt="People Group"
              width={360}
              height={360}
              className="object-contain mx-auto drop-shadow-lg"
              priority
            />
            <div className="mt-6 text-xl font-semibold text-gray-700 text-center max-w-xs">Connect, discover, and grow with UrbanMeet</div>
          </div>
          {/* Form side */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-10 z-10">
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Login</h2>
            <form onSubmit={submit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <MdEmail size={20} />
                  </span>
                  <input
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    type="email"
                    placeholder="ashu@gmail.com"
                    className="w-full rounded-xl border border-amber-300 bg-white py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    required
                  />
                </div>
                {!emailValid && email.length > 3 && <p className="mt-1 text-xs text-rose-500">Enter a valid email</p>}
              </div>
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-zinc-700">Password</label>
                  <Link href="/auth/forgot" className="text-xs font-semibold text-amber-600 hover:text-amber-500">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <MdLock size={20} />
                  </span>
                  <input
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type={showPassword? 'text':'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    required
                  />
                  <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-3 text-xs text-zinc-500 hover:text-zinc-700">{showPassword? 'Hide':'Show'}</button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !emailValid || password.length < 1}
                className="w-full rounded-xl bg-rose-400 py-3 text-sm font-semibold text-white shadow hover:bg-rose-500 disabled:opacity-50"
              >
                {loading? 'Logging in...' : 'Log In'}
              </button>
            </form>

            {/* Social sign-in */}
            <div className="mt-6 flex items-center gap-3 text-zinc-400">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs">Or Continue With</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
            <div className="mt-4">
              <button 
                type="button"
                onClick={() => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
                  window.location.href = `${apiUrl}/auth/google`
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600">Don't have an account? <Link href="/auth/register" className="font-semibold text-amber-700">Sign Up here</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
