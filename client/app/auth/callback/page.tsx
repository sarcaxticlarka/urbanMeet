"use client"
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      router.push(`/auth/login?error=${error}`)
      return
    }

    if (token) {
      login(token)
      router.push('/profile')
    } else {
      router.push('/auth/login?error=no_token')
    }
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
        <p className="mt-4 text-sm text-zinc-600">Completing authentication...</p>
      </div>
    </div>
  )
}
