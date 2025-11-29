"use client"
import React, { useEffect, useState } from 'react'
import API from '@/lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [followings, setFollowings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    Promise.all([
      API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/groups', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/events', { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([userRes, groupsRes, eventsRes]) => {
        setUser(userRes.data.user)
        setGroups(groupsRes.data.groups?.slice(0, 3) || [])
        setEvents(eventsRes.data.events?.slice(0, 3) || [])
        // Mock followings for now
        setFollowings([
          { id: '1', name: 'Padhang Satrio', role: 'Mentor', avatarUrl: null },
          { id: '2', name: 'Zakir Horizontal', role: 'Mentor', avatarUrl: null },
          { id: '3', name: 'Leonardo Samuel', role: 'Mentor', avatarUrl: null },
        ])
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-60 lg:block">
            <div className="sticky top-24 space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Overview</p>
                <nav className="space-y-1">
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Dashboard
                  </Link>
                  <Link href="/inbox" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Inbox
                  </Link>
                  <Link href="/groups" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Group
                  </Link>
                  <Link href="/events" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                    Task
                  </Link>
                </nav>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Friends</p>
                <div className="space-y-2">
                  {followings.slice(0, 3).map((f) => (
                    <div key={f.id} className="flex items-center gap-2 px-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
                        {f.name.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-800 truncate">{f.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-zinc-500">{f.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-200">
                <Link href="/profile" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Setting
                </Link>
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-lg">
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">urbanMeet Platform</p>
                <h1 className="mt-2 text-3xl font-bold">Connect and Grow with</h1>
                <h1 className="text-3xl font-bold">Amazing Communities</h1>
                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-zinc-50">
                  Join Now
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path fill="white" d="M9.5 8.5l5 3.5-5 3.5V8.5z"/></svg>
                </button>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                <svg className="h-40 w-40" viewBox="0 0 200 100" fill="none" stroke="white" strokeWidth="3">
                  <path d="M10 50 Q 50 20, 100 50 T 190 50" strokeLinecap="round"/>
                  <circle cx="100" cy="30" r="8" fill="white"/>
                </svg>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Groups Joined</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{groups.length}</p>
                  </div>
                  <div className="rounded-xl bg-purple-100 p-3">
                    <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  <span className="text-green-600">↑ Active</span>
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Events Attending</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{events.length}</p>
                  </div>
                  <div className="rounded-xl bg-pink-100 p-3">
                    <svg className="h-6 w-6 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  <span className="text-green-600">↑ Upcoming</span>
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Connections</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">{user?.followingCount || 0}</p>
                  </div>
                  <div className="rounded-xl bg-cyan-100 p-3">
                    <svg className="h-6 w-6 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  <span className="text-green-600">↑ Growing</span>
                </p>
              </div>
            </div>

            {/* Continue Watching / Recent Events */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Your Events</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">See all</button>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {events.length === 0 && (
                  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 text-center">
                    <p className="text-sm text-zinc-500">No events yet</p>
                    <Link href="/events/create" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">Create your first event →</Link>
                  </div>
                )}
                {events.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md">
                    <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-12 w-12 text-white opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <button className="absolute right-3 top-3 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-indigo-600">EVENT</p>
                      <h3 className="mt-1 font-semibold text-zinc-900 line-clamp-1">{event.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{event.description || 'Join us for an amazing event!'}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-200"></div>
                        <span className="text-xs text-zinc-600">{event.group?.owner?.name || 'Organizer'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Stats & Mentors */}
          <aside className="hidden w-80 xl:block">
            <div className="sticky top-24 space-y-6">
              {/* Statistic Widget */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900">Statistic</h3>
                  <button className="text-zinc-400 hover:text-zinc-600">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                  </button>
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-zinc-700">{user?.name?.slice(0, 1) || 'U'}</span>
                        )}
                      </div>
                    </div>
                    <div className="absolute -right-1 top-0 rounded-full bg-purple-500 px-2 py-0.5 text-xs font-semibold text-white">92%</div>
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-zinc-900">{getGreeting()} {user?.name || 'User'}! 🔥</h4>
                  <p className="mt-1 text-center text-xs text-zinc-500">Continue your learning to achieve your target!</p>
                  
                  {/* Mini Chart */}
                  <div className="mt-6 w-full">
                    <div className="flex items-end justify-between gap-2 h-24">
                      <div className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full rounded-t-lg bg-purple-200 h-12"></div>
                        <span className="text-[10px] text-zinc-500">Aug 1</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full rounded-t-lg bg-purple-400 h-16"></div>
                        <span className="text-[10px] text-zinc-500">Aug 11</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full rounded-t-lg bg-purple-600 h-20"></div>
                        <span className="text-[10px] text-zinc-500">Aug 21</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                      <span>Activity Level</span>
                      <span className="font-medium text-zinc-700">{groups.length + events.length} total</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Mentor / Followings */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900">Your Connections</h3>
                  <button className="text-indigo-600 hover:text-indigo-500">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {followings.map((person) => (
                    <div key={person.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {person.name.slice(0, 1)}
                          </div>
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{person.name}</p>
                          <p className="text-xs text-zinc-500">{person.role}</p>
                        </div>
                      </div>
                      <button className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full rounded-lg bg-indigo-50 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                  See All
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
