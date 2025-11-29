"use client"
import React from 'react'

interface Props {
  name: string
  bio?: string
  followerCount?: number
  followingCount?: number
  avatarUrl?: string
  coverUrl?: string
}

export function ProfileHeader({ name, bio, followerCount = 0, followingCount = 0, avatarUrl, coverUrl }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="h-36 w-full relative">
        {coverUrl ? (
          <img src={coverUrl} alt="cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200" />
        )}
        <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="l" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#A5F3FC" />
            </linearGradient>
          </defs>
          <path d="M0 100 C150 200 350 0 500 100 L500 00 L0 0 Z" fill="url(#l)" />
        </svg>
      </div>
      <div className="px-8 pt-20 pb-6">
        <div className="-mt-14 flex items-end gap-6">
          <div className="h-28 w-28 overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm flex items-center justify-center text-3xl font-bold text-zinc-800">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" /> : name.charAt(0)}
          </div>
          <div className="flex-1 pt-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-zinc-900">{name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Verified
              </span>
              <div className="ml-auto flex items-center gap-6 text-sm">
                <div className="flex flex-col"><span className="font-semibold text-zinc-900">{followerCount}</span><span className="text-zinc-500">Followers</span></div>
                <div className="flex flex-col"><span className="font-semibold text-zinc-900">{followingCount}</span><span className="text-zinc-500">Following</span></div>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-zinc-600">{bio || 'No bio yet. Share something about yourself.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
