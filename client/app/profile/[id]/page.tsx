"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import queryClient from '@/lib/queryClient'
import api from '@/lib/api'

// Fetch user by id
async function fetchUser(id: string) {
  const res = await api.get(`/users/${id}`)
  return res.data.user
}

export default function PublicProfilePage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id || ''),
    enabled: !!id,
  })

  if (!id) {
    return <div className="p-6">Invalid profile link.</div>
  }
  if (isLoading) {
    return <div className="p-6">Loading profile…</div>
  }
  if (isError || !user) {
    return <div className="p-6">User not found.</div>
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Cover */}
      <div className="relative h-48 w-full bg-gradient-to-r from-pink-200 via-rose-200 to-fuchsia-200">
        {user.coverUrl && (
          <Image src={user.coverUrl} alt="Cover" fill className="object-cover" />
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 mt-2">
        {/* Header card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-white -mt-16 bg-zinc-100">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name || 'User'} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-zinc-400">
                  {(user.name || 'U').slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-zinc-900">{user.name || 'Member'}</h1>
              {user.city && <p className="text-sm text-zinc-600">{user.city}</p>}
              {user.bio && <p className="mt-2 text-zinc-700">{user.bio}</p>}

              <div className="mt-4 flex gap-6 text-sm text-zinc-700">
                <div>
                  <span className="font-semibold">Followers:</span> {user.followerCount ?? 0}
                </div>
                <div>
                  <span className="font-semibold">Following:</span> {user.followingCount ?? 0}
                </div>
              </div>

              {user.interests && user.interests.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-zinc-900">Interests</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.interests.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <Link href="/connections" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                Back to connections
              </Link>
            </div>
          </div>
        </div>

        {/* Placeholder for future: user's events/groups */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h3 className="font-semibold text-zinc-900">Recent Activity</h3>
            <p className="mt-2 text-sm text-zinc-600">Events and groups will appear here.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h3 className="font-semibold text-zinc-900">About</h3>
            <p className="mt-2 text-sm text-zinc-600">This is a public view of {user.name?.split(' ')[0] || 'the user'}'s profile.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
