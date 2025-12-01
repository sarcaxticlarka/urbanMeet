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

type TabType = 'following' | 'followers'

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('following')
  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchConnections = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const [followingRes, followersRes, meRes] = await Promise.all([
        API.get('/users/me/following', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/users/me/followers', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      ])

      setFollowing(followingRes.data.following || [])
      setFollowers(followersRes.data.followers || [])
      const followingIdSet = new Set<string>(followingRes.data.following?.map((u: User) => u.id) || [])
      setFollowingIds(followingIdSet)
      setCurrentUserId(meRes.data.user?.id)
    } catch (err) {
      console.error('Failed to fetch connections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const handleFollow = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      if (followingIds.has(userId)) {
        await API.delete(`/users/${userId}/follow`, { headers: { Authorization: `Bearer ${token}` } })
        setFollowingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
        // Remove from following list if on that tab
        if (activeTab === 'following') {
          setFollowing(prev => prev.filter(u => u.id !== userId))
        }
      } else {
        await API.post(`/users/${userId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } })
        setFollowingIds(prev => new Set(prev).add(userId))
      }
    } catch (err: any) {
      console.error('Follow error:', err)
      alert(err?.response?.data?.error || 'Failed to follow/unfollow')
    }
  }

  const displayUsers = activeTab === 'following' ? following : followers
  const followingCount = following.length
  const followersCount = followers.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Your Connections</h1>
          <p className="text-zinc-600">Manage your network and see who's following you</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Following</p>
                <p className="text-3xl font-bold text-pink-600">{followingCount}</p>
              </div>
              <div className="rounded-full bg-pink-100 p-4">
                <svg className="h-8 w-8 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Followers</p>
                <p className="text-3xl font-bold text-purple-600">{followersCount}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-4">
                <svg className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('following')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'following'
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Following ({followingCount})
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'followers'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Followers ({followersCount})
            </button>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            <p className="mt-4 text-zinc-500">Loading connections...</p>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
              <svg className="h-10 w-10 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900">
              {activeTab === 'following' ? 'Not following anyone yet' : 'No followers yet'}
            </h3>
            <p className="mb-6 text-zinc-600">
              {activeTab === 'following' 
                ? 'Discover amazing people to connect with' 
                : 'Share your profile to get more followers'}
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600 transition"
            >
              Discover People
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayUsers.map(user => {
              const isFollowing = followingIds.has(user.id)
              const bgColors = ['bg-gradient-to-br from-pink-400 to-purple-500', 'bg-gradient-to-br from-cyan-400 to-blue-500', 'bg-gradient-to-br from-yellow-400 to-orange-500', 'bg-gradient-to-br from-green-400 to-teal-500']
              const randomBg = bgColors[Math.abs(user.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % bgColors.length]

              return (
                <div key={user.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md hover:shadow-lg transition-shadow">
                  {/* Avatar */}
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="h-16 w-16 rounded-full object-cover border-2 border-zinc-200" 
                    />
                  ) : (
                    <div className={`h-16 w-16 rounded-full ${randomBg} flex items-center justify-center text-xl font-bold text-white border-2 border-zinc-200`}>
                      {user.name?.split(' ').map(p => p[0]).slice(0, 2).join('') || 'U'}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-zinc-900 truncate">{user.name || 'User'}</h3>
                    {user.bio && (
                      <p className="text-sm text-zinc-600 truncate">{user.bio}</p>
                    )}
                    {user.city && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <span>📍</span> {user.city}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${user.id}`}
                      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        isFollowing
                          ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow Back'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Discover More CTA */}
        {!loading && displayUsers.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition"
            >
              Discover more people
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
