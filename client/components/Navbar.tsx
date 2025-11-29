"use client"

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { FaGlobe, FaSearch, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; avatarUrl?: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        setIsLoggedIn(!!e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      return
    }
    // Fetch minimal user info for navbar
    setLoadingUser(true)
    API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const u = res.data
        setUser({ id: u.id, name: u.name || 'Me', avatarUrl: u.avatarUrl })
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false))
  }, [isLoggedIn])

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (menuOpen && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [menuOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Sonipat, IN');
  const inputRef = useRef(null);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/30 backdrop-blur-md px-6 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-[160px] group cursor-pointer">
          {/* <span className="inline-flex items-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="12" fill="#ec4899"/><text x="18" y="24" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">U</text></svg>
          </span>
          <span className="font-bold text-2xl text-pink-600 tracking-tight group-hover:underline">UrbanMeet</span> */}
          <img className='w-40' src="/assets/logo2.png" alt="logo" />
        </Link>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center w-full max-w-xl rounded-full bg-white shadow-md px-2 py-1 border border-zinc-200">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent outline-none px-4 py-2 text-gray-700 text-base rounded-l-full"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="text-gray-700 font-medium px-2 whitespace-nowrap">{location}</span>
            {search && (
              <button onClick={() => setSearch('')} className="ml-2 text-zinc-400 hover:text-zinc-600">
                <FaTimes size={18} />
              </button>
            )}
            <button className="ml-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow transition">
              <FaSearch size={20} />
            </button>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-4 min-w-[220px] justify-end">
          <button className="flex items-center gap-1 text-zinc-700 hover:text-pink-600 text-base font-medium">
            <FaGlobe className="mr-1" /> English
          </button>
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold shadow"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-lg">{user.name?.[0] || 'U'}</span>
                )}
                <span>{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-zinc-100 py-2 z-50">
                  <Link href="/dashboard" className="block px-4 py-2 text-zinc-700 hover:bg-pink-50">Dashboard</Link>
                  <Link href="/profile" className="block px-4 py-2 text-zinc-700 hover:bg-pink-50">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-zinc-700 hover:bg-pink-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-base font-medium text-zinc-700 hover:text-pink-600">Log in</Link>
              <Link href="/auth/register" className="rounded-full bg-zinc-900 px-5 py-2 text-base font-semibold text-white shadow hover:bg-zinc-800 transition">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
