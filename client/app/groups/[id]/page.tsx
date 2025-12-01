"use client"
import React, { use, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEdit, FaTrash } from 'react-icons/fa'
import API from '@/lib/api'

async function fetchGroup(id: string) {
  const res = await API.get(`/groups/${id}`)
  return res.data.group
}

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: group, isLoading } = useQuery({ 
    queryKey: ['group', id], 
    queryFn: () => fetchGroup(id) 
  })
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  
  // Edit form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [coverImage, setCoverImage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setCurrentUserId(r.data.user?.id))
        .catch(() => null)
    }
  }, [])

  const joinMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not logged in')
      await API.post(`/groups/${id}/join`, {}, { headers: { Authorization: `Bearer ${token}` } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] })
    }
  })

  const leaveMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not logged in')
      await API.delete(`/groups/${id}/leave`, { headers: { Authorization: `Bearer ${token}` } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] })
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600">Loading group...</p>
        </div>
      </div>
    )
  }
  
  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Group not found</h2>
          <Link href="/groups" className="text-pink-600 hover:text-pink-700">← Back to Groups</Link>
        </div>
      </div>
    )
  }

  const isOwner = currentUserId && group.ownerId === currentUserId
  const isMember = group.members?.some((m: any) => m.userId === currentUserId)

  const startEdit = () => {
    setEditing(true)
    setName(group.name || '')
    setDescription(group.description || '')
    setCity(group.city || '')
    setCoverImage(group.coverImage || '')
  }

  const saveEdit = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not logged in')
    try {
      await API.patch(`/groups/${id}`, { 
        name, 
        description, 
        city, 
        coverImage
      }, { headers: { Authorization: `Bearer ${token}` } })
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['group', id] })
      alert('Group updated successfully!')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update')
    }
  }

  const deleteGroup = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not logged in')
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) return
    try {
      await API.delete(`/groups/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      alert('Group deleted successfully')
      router.push('/groups')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        {group.coverImage && (
          <img 
            src={group.coverImage} 
            alt={group.name} 
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Link href="/groups" className="text-white/90 hover:text-white mb-4 inline-flex items-center gap-2 w-fit">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Groups
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">{group.name}</h1>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{group.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{group.members?.length || 0} members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Group Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About This Group</h2>
              <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">
                {group.description || 'No description available.'}
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-900">Upcoming Events</h3>
                {isMember && (
                  <Link
                    href={`/events/create?groupId=${id}`}
                    className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {group.events?.length > 0 ? (
                  group.events.map((event: any) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block p-4 rounded-lg border border-zinc-200 hover:border-pink-500 hover:bg-pink-50 transition"
                    >
                      <h4 className="font-semibold text-zinc-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-zinc-600">
                        {new Date(event.startsAt).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">{event.city} • {event.venue || 'TBA'}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-zinc-500 py-8">No upcoming events</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Join & Actions */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Join the Community</h3>
              
              {isMember && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                  ✓ You're a member
                </div>
              )}

              <div className="space-y-3">
                {!isMember ? (
                  <button 
                    onClick={() => joinMutation.mutate()}
                    disabled={joinMutation.isPending}
                    className="w-full rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600 transition disabled:opacity-50"
                  >
                    {joinMutation.isPending ? 'Joining...' : 'Join Group'}
                  </button>
                ) : (
                  <button 
                    onClick={() => leaveMutation.mutate()}
                    disabled={leaveMutation.isPending}
                    className="w-full rounded-lg border-2 border-zinc-300 px-6 py-3 font-semibold text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50"
                  >
                    {leaveMutation.isPending ? 'Leaving...' : 'Leave Group'}
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200">
                <p className="text-sm text-zinc-600 mb-2">
                  <span className="font-semibold text-zinc-900">{group.members?.length || 0}</span> members
                </p>
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-900">{group.events?.length || 0}</span> events
                </p>
              </div>

              {/* Organizer Info */}
              {group.owner && (
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500 mb-2">Organized by</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {group.owner.name?.slice(0, 2) || 'O'}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{group.owner.name}</p>
                      <p className="text-xs text-zinc-500">Group Organizer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="mt-6 pt-6 border-t border-zinc-200 space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 mb-3">MANAGE GROUP</p>
                  <button 
                    onClick={startEdit}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-50 transition flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit Group
                  </button>
                  <button 
                    onClick={deleteGroup}
                    className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete Group
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Edit Group</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Group Name</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">City</label>
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Cover Image URL</label>
                <input 
                  value={coverImage} 
                  onChange={(e) => setCoverImage(e.target.value)} 
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button 
                onClick={() => setEditing(false)}
                className="rounded-lg border border-zinc-300 px-6 py-2 font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit}
                className="rounded-lg bg-pink-500 px-6 py-2 font-medium text-white hover:bg-pink-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

