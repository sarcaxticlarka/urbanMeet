"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import API from '@/lib/api'

interface User {
  id: string
  name: string
  avatarUrl?: string
  bio?: string
  city?: string
}

export function FollowingsList() {
  const queryClient = useQueryClient()
  const [users, setUsers] = useState<User[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    Promise.all([
      API.get('/users', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/users/me/following', { headers: { Authorization: `Bearer ${token}` } }),
      API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([usersRes, followingRes, meRes]) => {
        setUsers(usersRes.data.users?.slice(0, 5) || [])
        const followingIds = new Set<string>(followingRes.data.following?.map((u: User) => u.id) || [])
        setFollowing(followingIds)
        setCurrentUserId(meRes.data.user?.id)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const handleFollow = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      if (following.has(userId)) {
        await API.delete(`/users/${userId}/follow`, { headers: { Authorization: `Bearer ${token}` } })
        setFollowing(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      } else {
        await API.post(`/users/${userId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } })
        setFollowing(prev => new Set(prev).add(userId))
      }
      
      // Refresh profile data to update following count
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      
      // Refetch following list
      const followingRes = await API.get('/users/me/following', { headers: { Authorization: `Bearer ${token}` } })
      const followingIds = new Set<string>(followingRes.data.following?.map((u: User) => u.id) || [])
      setFollowing(followingIds)
    } catch (err: any) {
      console.error('Follow error:', err)
      alert(err?.response?.data?.error || 'Failed to follow/unfollow')
    }
  }

  if (loading) {
    return (
      <div className="mt-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Discover Users</h4>
        <p className="text-xs text-zinc-400">Loading...</p>
      </div>
    )
  }

  // Filter out current user
  const filteredUsers = users.filter(u => u.id !== currentUserId)

  return (
    <div className="mt-6">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Discover Users</h4>
      {filteredUsers.length === 0 ? (
        <p className="text-xs text-zinc-400">No users to show</p>
      ) : (
        <>
          <ul className="space-y-2">
            {filteredUsers.map(user => {
              const isFollowing = following.has(user.id)
              const initials = user.name?.split(' ').map(p => p[0]).slice(0, 2).join('') || 'U'
              const bgColors = ['bg-pink-300', 'bg-zinc-300', 'bg-yellow-200', 'bg-orange-300', 'bg-cyan-300', 'bg-purple-300', 'bg-green-300']
              const randomBg = bgColors[Math.abs(user.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % bgColors.length]

              return (
                <li key={user.id} className="flex items-center gap-2 group">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="h-9 w-9 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <div className={`h-9 w-9 rounded-xl ${randomBg} flex items-center justify-center text-xs font-bold text-zinc-800 shadow-sm`}>
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-sm text-zinc-700 font-medium">{user.name || 'User'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isFollowing
                        ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                        : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </li>
              )
            })}
          </ul>
          {users.length > 5 && (
            <Link 
              href="/discover" 
              className="mt-3 block text-center text-xs font-medium text-pink-600 hover:text-pink-700 transition"
            >
              Discover more →
            </Link>
          )}
        </>
      )}
    </div>
  )
}
