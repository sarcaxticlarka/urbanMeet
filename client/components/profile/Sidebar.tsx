"use client"
import React from 'react'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: number
}

const nav: NavItem[] = [
  { label: 'Profile', href: '/profile', icon: <span className="text-xl">👤</span> },
  { label: 'Feeds', href: '/feeds', icon: <span className="text-xl">📰</span> },
  { label: 'Event', href: '/events', icon: <span className="text-xl">🎫</span>, badge: 34 },
  { label: 'Charity', href: '/charity', icon: <span className="text-xl">🎗️</span>, badge: 22 },
  { label: 'Friends', href: '/friends', icon: <span className="text-xl">👥</span> },
  { label: 'Community', href: '/community', icon: <span className="text-xl">🌐</span> },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 p-4">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center text-white font-bold">U</div>
        <span className="font-semibold text-zinc-900">urbanMeet</span>
      </div>
      <nav className="space-y-1">
        {nav.map(item => (
          <Link key={item.label} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 group-hover:bg-white transition-colors shadow-sm">
              {item.icon}
            </div>
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined && (
              <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-600">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
