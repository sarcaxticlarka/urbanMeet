"use client"

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/lib/api';
import { FaGlobe, FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from "@/context/AuthContext";
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

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
    logout();
  }

  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [location, setLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<{ events: any[]; groups: any[]; users: any[]; suggestions: any[] }>({ events: [], groups: [], users: [], suggestions: [] })
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Get user location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    if (savedLocation) {
      setLocation(savedLocation)
    } else {
      requestLocation()
    }
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Location unavailable')
      return
    }
    
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding using a free API (nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          )
          const data = await response.json()
          const city = data.address.city || data.address.town || data.address.village || 'Unknown'
          const country = data.address.country_code?.toUpperCase() || ''
          const locationString = `${city}${country ? ', ' + country : ''}`
          setLocation(locationString)
          localStorage.setItem('userLocation', locationString)
        } catch (error) {
          setLocation('Location unavailable')
        } finally {
          setLocationLoading(false)
        }
      },
      (error) => {
        setLocation('Location unavailable')
        setLocationLoading(false)
      }
    )
  }

  // Live search suggestions
  useEffect(() => {
    if (!search || search.trim().length < 2) {
      setSearchResults({ events: [], groups: [], users: [], suggestions: [] })
      setResultsOpen(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await API.get(`/search?query=${encodeURIComponent(search.trim())}`)
        setSearchResults(res.data)
        setResultsOpen(true)
      } catch (e) {
        // silent fail
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [search])

  // Close results on outside click
  const resultsRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!resultsRef.current) return
      if (resultsOpen && !resultsRef.current.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setResultsOpen(false)
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [resultsOpen])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (search.trim()) {
      router.push(`/events?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  console.log("Navbar rendered with user:", user);
  console.log("Navbar rendered with isLoggedIn:", isLoggedIn);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/30 backdrop-blur-md px-4 md:px-6 py-3 shadow-sm">
      <div className="mx-auto max-w-7xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Logo */}
  <Link href="/" className="order-1 md:order-none flex items-center gap-2 min-w-[140px] md:min-w-[160px] group cursor-pointer">
          {/* <span className="inline-flex items-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="12" fill="#ec4899"/><text x="18" y="24" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">U</text></svg>
          </span>
          <span className="font-bold text-2xl text-pink-600 tracking-tight group-hover:underline">UrbanMeet</span> */}
          <img className='w-40' src="/assets/logo2.png" alt="logo" />
        </Link>
        {/* Search Bar */}
        <div className="order-2 w-full md:order-none md:flex-1 md:flex md:justify-center">
          <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-none md:max-w-xl rounded-full bg-white shadow-md px-2 py-1 border border-zinc-200">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent outline-none px-3 md:px-4 py-2 text-gray-700 text-base rounded-l-full"
              placeholder="Search events by name, tag, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span 
              className="text-gray-700 font-medium px-2 whitespace-nowrap cursor-pointer hover:text-pink-600 flex items-center gap-1 text-xs md:text-sm max-w-[40%] md:max-w-none truncate md:overflow-visible"
              onClick={requestLocation}
              title="Click to update location"
            >
              {locationLoading ? (
                <span className="text-xs">Loading...</span>
              ) : location || 'Get location'}
            </span>
            {search && (
              <button type="button" onClick={() => setSearch('')} className="ml-2 text-zinc-400 hover:text-zinc-600">
                <FaTimes size={18} />
              </button>
            )}
            <button type="submit" className="ml-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow transition">
              <FaSearch size={20} />
            </button>

            {resultsOpen && (
              <div ref={resultsRef} className="absolute left-0 top-full mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-lg p-3 md:p-4 z-50">
                {loading && <p className="text-sm text-zinc-500">Searching...</p>}
                {!loading && (
                  <div className="space-y-4">
                    {searchResults.events.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Events</h4>
                        <ul className="space-y-1">
                          {searchResults.events.map(ev => (
                            <li key={ev.id}>
                              <Link href={`/events/${ev.id}`} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-pink-50 text-sm">
                                <span className="font-medium text-zinc-800">{ev.title}</span>
                                <span className="text-xs text-zinc-500">{ev.city || ev.group?.city}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {searchResults.groups.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Groups</h4>
                        <ul className="space-y-1">
                          {searchResults.groups.map(g => (
                            <li key={g.id}>
                              <Link href={`/groups/${g.id}`} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-pink-50 text-sm">
                                <span className="font-medium text-zinc-800">{g.name}</span>
                                <span className="text-xs text-zinc-500">{g.city}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {searchResults.users.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">People</h4>
                        <ul className="space-y-1">
                          {searchResults.users.map(u => (
                            <li key={u.id}>
                              <Link href={`/profile/${u.id}`} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-pink-50 text-sm">
                                <span className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-semibold text-zinc-600 overflow-hidden">
                                  {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover rounded-full" /> : (u.name?.[0] || 'U')}
                                </span>
                                <span className="font-medium text-zinc-800">{u.name}</span>
                                {u.city && <span className="text-xs text-zinc-500">{u.city}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {searchResults.events.length === 0 && searchResults.groups.length === 0 && searchResults.users.length === 0 && searchResults.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">No direct matches. Showing related upcoming events:</p>
                        <ul className="space-y-1">
                          {searchResults.suggestions.map(s => (
                            <li key={s.id}>
                              <Link href={`/events/${s.id}`} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-pink-50 text-sm">
                                <span className="font-medium text-zinc-800">{s.title}</span>
                                <span className="text-xs text-zinc-500">{s.city || s.group?.city}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                      <Link href={`/events?search=${encodeURIComponent(search.trim())}`} className="text-sm font-medium text-pink-600 hover:underline">
                        See all events
                      </Link>
                      <button type="button" onClick={() => setResultsOpen(false)} className="text-xs text-zinc-500 hover:text-zinc-700">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        {/* Right Side */}
        <div className="order-3 md:order-none flex items-center gap-3 md:gap-4 w-full md:w-auto md:min-w-[220px] justify-between md:justify-end">
          <Link href="/events" className="flex items-center gap-1 text-zinc-700 hover:text-pink-600 text-base font-medium">
            <span className="mr-1">
              <FaGlobe size={16} />
            </span>
            Events
          </Link>
          {user ? (
            <>
              <NotificationBell />
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
                    <Link href="/connections" className="block px-4 py-2 text-zinc-700 hover:bg-pink-50">Connections</Link>
                    <Link href="/discover" className="block px-4 py-2 text-zinc-700 hover:bg-pink-50">Discover</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-zinc-700 hover:bg-pink-50">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm md:text-base font-medium text-zinc-700 hover:text-pink-600">Log in</Link>
              <Link href="/auth/register" className="rounded-full bg-zinc-900 px-4 md:px-5 py-2 text-sm md:text-base font-semibold text-white shadow hover:bg-zinc-800 transition">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
