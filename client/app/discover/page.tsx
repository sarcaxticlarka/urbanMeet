"use client"
import React, { useEffect, useState } from 'react'
import API from '@/lib/api'
import Link from 'next/link'

interface User {
  id: string
  name: string
  avatarUrl?: string
  bio?: string
  city?: string
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchUsers = async (searchTerm = '') => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''
      const [usersRes, followingRes, meRes] = await Promise.all([
        API.get(`/users${params}`, { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/users/me/following', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      ])

      setUsers(usersRes.data.users || [])
      const followingIds = new Set<string>(followingRes.data.following?.map((u: User) => u.id) || [])
      setFollowing(followingIds)
      setCurrentUserId(meRes.data.user?.id)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(search)
  }

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
    } catch (err: any) {
      console.error('Follow error:', err)
      alert(err?.response?.data?.error || 'Failed to follow/unfollow')
    }
  }

  const filteredUsers = users.filter(u => u.id !== currentUserId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Discover People</h1>
          <p className="text-zinc-600">Connect with amazing people in your community</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, or bio..."
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-pink-500 px-8 py-3 font-semibold text-white hover:bg-pink-600 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">No users found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map(user => {
              const isFollowing = following.has(user.id)
              const bgColors = ['bg-gradient-to-br from-pink-400 to-purple-500', 'bg-gradient-to-br from-cyan-400 to-blue-500', 'bg-gradient-to-br from-yellow-400 to-orange-500', 'bg-gradient-to-br from-green-400 to-teal-500', 'bg-gradient-to-br from-purple-400 to-indigo-500']
              const randomBg = bgColors[Math.abs(user.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % bgColors.length]

              return (
                <div key={user.id} className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  {/* Cover/Header */}
                  <div className={`h-24 ${randomBg}`}></div>
                  
                  {/* Avatar */}
                  <div className="relative px-6 pb-6">
                    <div className="absolute -top-12 left-6">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg" 
                        />
                      ) : (
                        <div className={`h-24 w-24 rounded-full border-4 border-white ${randomBg} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                          {user.name?.split(' ').map(p => p[0]).slice(0, 2).join('') || 'U'}
                        </div>
                      )}
                    </div>

                    <div className="pt-14 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900">{user.name || 'User'}</h3>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleFollow(user.id)}
                          className={`flex-1 rounded-lg py-2 font-semibold text-sm transition ${
                            isFollowing
                              ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                              : 'bg-pink-500 text-white hover:bg-pink-600'
                          }`}
                        >
                          {isFollowing ? '✓ Following' : '+ Follow'}
                        </button>
                        <Link
                          href={`/profile/${user.id}`}
                          className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-sm font-semibold transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
