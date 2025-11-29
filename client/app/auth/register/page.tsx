"use client"
import React, { useState, useEffect } from 'react'
import { MdEmail, MdLock } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import API from '@/lib/api'
import { validateEmail } from '@/lib/validation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [pwd, setPwd] = useState<any>(null)
  const emailValid = validateEmail(email)

  // Debounced email availability check
  useEffect(() => {
    if (!emailValid) { setEmailAvailable(null); return }
    let active = true
    setCheckingEmail(true)
    const t = setTimeout(async () => {
      try {
        const res = await API.get('/auth/check-email', { params: { email } })
        if (active) setEmailAvailable(res.data.available)
      } catch {
        if (active) setEmailAvailable(null)
      } finally {
        if (active) setCheckingEmail(false)
      }
    }, 600)
    return () => { active = false; clearTimeout(t) }
  }, [email, emailValid])

  // Debounced server password strength
  useEffect(() => {
    if (!password) { setPwd(null); return }
    let active = true
    const t = setTimeout(async () => {
      try {
        const res = await API.get('/auth/password-strength', { params: { password } })
        if (active) setPwd(res.data)
      } catch {
        if (active) setPwd(null)
      }
    }, 400)
    return () => { active = false; clearTimeout(t) }
  }, [password])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (!acceptTerms) {
      setError('Please accept the terms to proceed')
      setLoading(false)
      return
    }
    if (emailAvailable === false) {
      setError('Email already in use')
      setLoading(false)
      return
    }
    try {
      const res = await API.post('/auth/register', { email, password, name })
      const { token } = res.data
      if (token) {
        localStorage.setItem('token', token)
        router.push('/profile/complete')
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
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
              src="/assets/coding.png"
              alt="Learning Group"
              width={320}
              height={320}
              className="object-contain mx-auto drop-shadow-lg"
              priority
            />
            <div className="mt-6 text-xl font-semibold text-gray-700 text-center max-w-xs">Start your journey with UrbanMeet</div>
          </div>
          {/* Form side */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-10 z-10">
           
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Sign Up</h2>
            <form onSubmit={submit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Ashu"
                  required
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <MdEmail size={20} />
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="ashu@example.com"
                    required
                    className="w-full rounded-xl border border-amber-300 bg-white py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                {email && (
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    {checkingEmail && <span className="text-zinc-400 animate-pulse">Checking...</span>}
                    {!checkingEmail && emailValid && emailAvailable === true && <span className="text-green-600">Email available</span>}
                    {!checkingEmail && emailValid && emailAvailable === false && <span className="text-rose-600">Email already in use</span>}
                    {!emailValid && email.length > 3 && <span className="text-rose-600">Invalid email</span>}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <MdLock size={20} />
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-3 text-xs text-zinc-500 hover:text-zinc-700">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {pwd && (
                  <div className="mt-2 space-y-1">
                    <div className="h-2 w-full overflow-hidden rounded bg-zinc-100">
                      <div className={`h-full transition-all ${pwd.score === 0 ? 'w-1/5 bg-red-500' : pwd.score === 1 ? 'w-2/5 bg-orange-500' : pwd.score === 2 ? 'w-3/5 bg-yellow-500' : pwd.score === 3 ? 'w-4/5 bg-green-500' : 'w-full bg-emerald-500'}`}></div>
                    </div>
                    <p className="text-xs text-zinc-600">Strength: <span className="font-medium text-zinc-800">{pwd.label}</span></p>
                    {pwd.score < 4 && password.length > 0 && (
                      <ul className="text-[10px] text-zinc-600 list-disc pl-4 space-y-0.5">
                        {pwd.suggestions.slice(0, 2).map((s: string) => <li key={s}>{s}</li>)}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password */}
            <div className="group">
              <label className="mb-2 block text-sm font-medium text-zinc-700">Confirm Password</label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  required
                  className={`w-full rounded-xl border ${confirmPassword && confirmPassword !== password ? 'border-rose-500/60' : 'border-zinc-300'} bg-white py-3 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300`}
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="mt-1 text-xs text-rose-600">Passwords do not match</p>
              )}
            </div>

              {/* Terms acceptance */}
            <div className="flex items-start gap-2 rounded-lg bg-zinc-50 px-3 py-3 border border-zinc-200">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 bg-white accent-amber-600"
              />
              <label htmlFor="terms" className="text-xs text-zinc-700 leading-relaxed">
                I agree to the <span className="text-amber-700 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-amber-700 hover:underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
                <div className="flex items-center gap-2">
                  {error}
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !emailValid || password.length < 6 || password !== confirmPassword || !acceptTerms || (pwd && pwd.score < 3) || emailAvailable === false}
              className="w-full rounded-xl bg-rose-400 py-3 text-sm font-semibold text-white shadow hover:bg-rose-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            {/* Social sign-up */}
            <div className="mt-6 flex items-center gap-3 text-zinc-400">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs">Or Continue With</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="rounded-xl border border-zinc-200 bg-white py-2 text-sm">Google</button>
              <button className="rounded-xl border border-zinc-200 bg-white py-2 text-sm">Facebook</button>
              <button className="rounded-xl border border-zinc-200 bg-white py-2 text-sm">Apple</button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600">Already have an account? <Link href="/auth/login" className="font-semibold text-amber-700">Sign In</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
