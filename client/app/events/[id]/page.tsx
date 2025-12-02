"use client"
import React, { useState, useEffect, use } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa'
import API from '@/lib/api'

async function fetchEvent(id: string) {
  const res = await API.get(`/events/${id}`)
  return res.data.event
}

async function fetchComments(id: string) {
  const res = await API.get(`/events/${id}/comments`)
  return res.data.comments
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: event, isLoading } = useQuery({ queryKey: ['event', id], queryFn: () => fetchEvent(id) })
  const { data: comments = [] } = useQuery({ queryKey: ['comments', id], queryFn: () => fetchComments(id) })
  const [commentText, setCommentText] = useState('')
  const [editing, setEditing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // Edit form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [city, setCity] = useState('')
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [capacity, setCapacity] = useState('')
  const [price, setPrice] = useState('')
  const [tags, setTags] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setCurrentUserId(r.data.user?.id))
        .catch(() => null)
    }
  }, [])

  const rsvpMutation = useMutation({
    mutationFn: async (status: string) => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login?redirect=/events/' + id)
        throw new Error('Not logged in')
      }
      await API.post(`/events/${id}/rsvp?status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      return status
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
    }
  })

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login?redirect=/events/' + id)
        throw new Error('Not logged in')
      }
      await API.post(`/events/${id}/comments`, { content }, { headers: { Authorization: `Bearer ${token}` } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setCommentText('')
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600">Loading event...</p>
        </div>
      </div>
    )
  }
  
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Event not found</h2>
          <Link href="/events" className="text-pink-600 hover:text-pink-700">← Back to Events</Link>
        </div>
      </div>
    )
  }

  const isOwner = currentUserId && event.group?.ownerId === currentUserId

  const startEdit = () => {
    setEditing(true)
    setTitle(event.title || '')
    setDescription(event.description || '')
    setStartsAt(event.startsAt ? new Date(event.startsAt).toISOString().slice(0, 16) : '')
    setEndsAt(event.endsAt ? new Date(event.endsAt).toISOString().slice(0, 16) : '')
    setCity(event.city || '')
    setVenue(event.venue || '')
    setAddress(event.address || '')
    setImageUrl(event.imageUrl || '')
    setCapacity(event.capacity?.toString() || '')
    setPrice(event.price?.toString() || '0')
    setTags(Array.isArray(event.tags) ? event.tags.join(', ') : '')
  }

  const saveEdit = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not logged in')
    try {
      await API.patch(`/events/${id}`, { 
        title, 
        description, 
        startsAt, 
        endsAt: endsAt || null,
        city, 
        venue, 
        address,
        imageUrl, 
        capacity: capacity ? Number(capacity) : null,
        price: price ? Number(price) : 0,
        tags 
      }, { headers: { Authorization: `Bearer ${token}` } })
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      alert('Event updated successfully!')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update')
    }
  }

  const deleteEvent = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not logged in')
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
    try {
      await API.delete(`/events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      alert('Event deleted successfully')
      router.push('/events')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete')
    }
  }

  const userRSVP = event.attendees?.find((a: any) => a.userId === currentUserId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        {event.imageUrl && (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Link href="/events" className="text-white/90 hover:text-white mb-4 inline-flex items-center gap-2 w-fit">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Events
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
          {Array.isArray(event.tags) && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag: string) => (
                <span key={tag} className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm text-white border border-white/30">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About This Event</h2>
              <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">
                {event.description || 'No description available.'}
              </p>
            </div>

            {/* Event Details */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-pink-100 p-3">
                    <svg className="h-6 w-6 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Date & Time</p>
                    <p className="text-zinc-600">{new Date(event.startsAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-zinc-600">
                      {new Date(event.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      {event.endsAt && ` - ${new Date(event.endsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-purple-100 p-3">
                    <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Location</p>
                    <p className="text-zinc-600">{event.venue || 'Venue TBA'}</p>
                    {event.address && <p className="text-zinc-600">{event.address}</p>}
                    <p className="text-zinc-600">{event.city}</p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-indigo-100 p-3">
                      <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Capacity</p>
                      <p className="text-zinc-600">{event.attendees?.length || 0} / {event.capacity} attendees</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Discussion ({comments.length})</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    onKeyPress={(e) => e.key === 'Enter' && commentText && commentMutation.mutate(commentText)}
                  />
                  <button 
                    onClick={() => commentText && commentMutation.mutate(commentText)}
                    disabled={!commentText}
                    className="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-zinc-500 py-8">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map((c: any) => (
                    <div key={c.id} className="border-l-4 border-pink-500 bg-zinc-50 p-4 rounded-r-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {c.user?.name?.slice(0, 2) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900">{c.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="text-zinc-700 ml-13">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - RSVP & Actions */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-6">
              {/* Price Display */}
              <div className="mb-6 text-center">
                <p className="text-sm text-zinc-500 mb-1">Admission</p>
                {!event.price || event.price === 0 ? (
                  <p className="text-4xl font-black text-green-600">FREE</p>
                ) : (
                  <div>
                    <p className="text-4xl font-black text-pink-600">${event.price}</p>
                    <p className="text-sm text-zinc-500">per person</p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-4">Are you going?</h3>
              
              {userRSVP && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                  ✓ You're {userRSVP.status}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => rsvpMutation.mutate('going')}
                  className="w-full rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600 transition cursor-pointer"
                >
                  ✓ I'm Going
                </button>
                <button 
                  onClick={() => rsvpMutation.mutate('interested')}
                  className="w-full rounded-lg border-2 border-pink-500 px-6 py-3 font-semibold text-pink-600 hover:bg-pink-50 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaStar /> Interested
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200">
                <p className="text-sm text-zinc-600 mb-2">
                  <span className="font-semibold text-zinc-900">{event.attendees?.filter((a: any) => a.status === 'going').length || 0}</span> people going
                </p>
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-900">{event.attendees?.filter((a: any) => a.status === 'interested').length || 0}</span> interested
                </p>
              </div>

              {/* Organizer Info */}
              {event.group?.owner && (
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500 mb-2">Organized by</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {event.group.owner.name?.slice(0, 2) || 'O'}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{event.group.owner.name}</p>
                      <Link href={`/groups/${event.group.id}`} className="text-xs text-pink-600 hover:text-pink-700">
                        View Group →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="mt-6 pt-6 border-t border-zinc-200 space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 mb-3">MANAGE EVENT</p>
                  <button 
                    onClick={startEdit}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-50 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaEdit /> Edit Event
                  </button>
                  <button 
                    onClick={deleteEvent}
                    className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaTrash /> Delete Event
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
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Edit Event</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Event Title</label>
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={startsAt} 
                    onChange={(e) => setStartsAt(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">End Date & Time (Optional)</label>
                  <input 
                    type="datetime-local" 
                    value={endsAt} 
                    onChange={(e) => setEndsAt(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">City</label>
                  <input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Venue</label>
                  <input 
                    value={venue} 
                    onChange={(e) => setVenue(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Address</label>
                <input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Image URL</label>
                <input 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Capacity</label>
                  <input 
                    type="number" 
                    value={capacity} 
                    onChange={(e) => setCapacity(e.target.value)} 
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="0 for free events"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Tags (comma separated)</label>
                <input 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)} 
                  placeholder="music, networking, tech"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button 
                onClick={() => setEditing(false)}
                className="rounded-lg border border-zinc-300 px-6 py-2 font-medium text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit}
                className="rounded-lg bg-pink-500 px-6 py-2 font-medium text-white hover:bg-pink-600 transition cursor-pointer"
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
