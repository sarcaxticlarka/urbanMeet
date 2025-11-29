"use client"
import React from 'react'

interface Following {
  id: string
  name: string
  avatarBg: string
}

const followings: Following[] = [
  { id: '1', name: 'Shigeru Minamoto', avatarBg: 'bg-pink-300' },
  { id: '2', name: 'Charlie Zaplin', avatarBg: 'bg-zinc-300' },
  { id: '3', name: 'Pope Francisc', avatarBg: 'bg-yellow-200' },
  { id: '4', name: 'Donald Grump', avatarBg: 'bg-orange-300' },
  { id: '5', name: 'Elvis Parsley', avatarBg: 'bg-cyan-300' },
]

export function FollowingsList() {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Followings</h4>
      <ul className="space-y-2">
        {followings.map(f => (
          <li key={f.id} className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl ${f.avatarBg} flex items-center justify-center text-xs font-bold text-zinc-800 shadow-sm`}>{f.name.split(' ').map(p=>p[0]).slice(0,2).join('')}</div>
            <span className="truncate text-sm text-zinc-700">{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
