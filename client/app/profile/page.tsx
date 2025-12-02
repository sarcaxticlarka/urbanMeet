"use client"
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import API from '@/lib/api'
import { Sidebar } from '@/components/profile/Sidebar'
import { FollowingsList } from '@/components/profile/FollowingsList'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import AvatarUpload from '@/components/profile/AvatarUpload'
import CoverUpload from '@/components/profile/CoverUpload'
import { TabsBar } from '@/components/profile/TabsBar'
import { EventCard } from '@/components/profile/EventCard'
import Link from 'next/link'

async function fetchUserProfile() {
  const token = localStorage.getItem('token')
  if (!token) return null
  const res = await API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
  return res.data.user
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useQuery({ 
    queryKey: ['userProfile'], 
    queryFn: fetchUserProfile,
    staleTime: 30000 // Refetch every 30 seconds
  })
  const [events, setEvents] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setBio(user.bio || '')
      setCity(user.city || '')
      setAvatarUrl(user.avatarUrl || undefined)
      setCoverUrl(user.coverUrl || undefined)
      
      // Fetch user events
      API.get(`/events?owner=${user.id}`)
        .then(r => setEvents(r?.data?.events || []))
        .catch(() => null)
    }
  }, [user])

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      await API.patch('/users/me', { name, bio, city, avatarUrl, coverUrl }, { headers: { Authorization: `Bearer ${token}` } })
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      setEditing(false)
    } catch {
      alert('Failed to update profile')
    }
  }

  if (!user) return <div className="p-6 text-zinc-700">Please login to view your profile.</div>

  return (
    <div className="min-h-[90vh] bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-10 flex gap-10">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
          <FollowingsList />
        </div>
        {/* Main content */}
        <div className="flex-1 space-y-8">
          <ProfileHeader
            name={name || user.email}
            bio={bio || user.bio}
            followerCount={rInt((user as any)?.followerCount)}
            followingCount={rInt((user as any)?.followingCount)}
            avatarUrl={avatarUrl}
            coverUrl={coverUrl}
          />
          <TabsBar />
          {/* Inline edit panel */}
          {editing && (
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 p-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm" />
                <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm" />
                <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" rows={2} className="md:col-span-3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm" />
                <div className="md:col-span-1"><AvatarUpload value={avatarUrl} onChange={setAvatarUrl} /></div>
                <div className="md:col-span-2"><CoverUpload value={coverUrl} onChange={setCoverUrl} /></div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={handleSave} className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 cursor-pointer">Save</button>
                <button onClick={()=>setEditing(false)} className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer">Cancel</button>
              </div>
            </div>
          )}
          {!editing && (
            <div className="flex justify-end">
              <button onClick={()=>setEditing(true)} className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer">Edit Profile</button>
            </div>
          )}
          {/* Events grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">Your Events</h2>
              <div className="flex gap-2">
                <Link href="/groups/create" className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm text-white font-semibold shadow hover:from-pink-600 hover:to-purple-600 cursor-pointer">+ Create Group</Link>
                <Link href="/events/create" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Create Event →</Link>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.length === 0 && (
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 p-6 text-sm text-zinc-500">
                  No events yet. <Link href="/events/create" className="text-indigo-600 hover:underline">Create one!</Link>
                </div>
              )}
              {events.map(ev => (
                <EventCard key={ev.id} id={ev.id} title={ev.title} location={ev.city || 'Unknown'} description={ev.description || 'No description'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function rInt(v: any) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
