"use client"
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import API from '@/lib/api'

async function fetchEvent(id: string) {
  const res = await API.get(`/events/${id}`)
  return res.data.event
}

async function fetchComments(id: string) {
  const res = await API.get(`/${id}/comments`)
  return res.data.comments
}

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params
  const queryClient = useQueryClient()
  const { data: event, isLoading } = useQuery({ queryKey: ['event', id], queryFn: () => fetchEvent(id) })
  const { data: comments = [] } = useQuery({ queryKey: ['comments', id], queryFn: () => fetchComments(id) })
  const [commentText, setCommentText] = useState('')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [city, setCity] = useState('')
  const [venue, setVenue] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState<string>('')

  const rsvpMutation = useMutation({
    mutationFn: async (status: string) => {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not logged in')
      await API.post(`/events/${id}/rsvp?status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      alert('RSVP updated!')
    }
  })

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not logged in')
      await API.post(`/${id}/comments`, { content }, { headers: { Authorization: `Bearer ${token}` } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setCommentText('')
    }
  })

  if (isLoading) return <div className="p-6 text-white">Loading...</div>
  if (!event) return <div className="p-6 text-white">Event not found</div>

  // Initialize edit form when toggling
  const startEdit = () => {
    setEditing(true)
    setTitle(event.title || '')
    setDescription(event.description || '')
    setStartsAt(event.startsAt?.slice(0, 16) || '')
    setCity(event.city || '')
    setVenue(event.venue || '')
    setImageUrl(event.imageUrl || '')
    setTags(Array.isArray(event.tags) ? event.tags.join(', ') : '')
  }

  const saveEdit = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not logged in')
    try {
      await API.patch(`/events/${id}`, { title, description, startsAt, city, venue, imageUrl, tags })
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['event', id] })
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update')
    }
  }

  const deleteEvent = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Not logged in')
    if (!confirm('Delete this event?')) return
    try {
      await API.delete(`/events/${id}`)
      alert('Event deleted')
      // Navigate back to home
      window.location.href = '/'
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete')
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-xl bg-white/10 p-6 backdrop-blur-md">
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} className="mb-4 h-64 w-full object-cover rounded-xl border border-white/10" />
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white">{event.title}</h2>
            <p className="mt-2 text-zinc-300">{event.description}</p>
            {Array.isArray(event.tags) && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-300 border border-pink-500/40 backdrop-blur-sm">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={startEdit} className="rounded border border-pink-500 px-3 py-1.5 text-sm text-pink-500 hover:bg-pink-500/10">Edit</button>
            <button onClick={deleteEvent} className="rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600">Delete</button>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm text-zinc-400">
          <p><strong>When:</strong> {new Date(event.startsAt).toLocaleString()}</p>
          <p><strong>Where:</strong> {event.city} — {event.venue}</p>
          <p><strong>Attendees:</strong> {event.attendees?.length || 0} going</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => rsvpMutation.mutate('going')} className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600">
            RSVP: Going
          </button>
          <button onClick={() => rsvpMutation.mutate('interested')} className="rounded border border-pink-500 px-4 py-2 text-sm text-pink-500 hover:bg-pink-500/10">
            Interested
          </button>
        </div>
        {editing && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-3 text-lg font-semibold text-white">Edit Event</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="md:col-span-2 rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" className="md:col-span-2 rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} className="mt-3 w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white" />
            <div className="mt-3 flex gap-2 justify-end">
              <button onClick={() => setEditing(false)} className="rounded border border-white/30 bg-white/10 px-4 py-2 text-white">Cancel</button>
              <button onClick={saveEdit} className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600">Save</button>
            </div>
          </div>
        )}
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-white">Comments</h3>
        <div className="mt-4 space-y-3">
          {comments.map((c: any) => (
            <div key={c.id} className="rounded bg-white/10 p-3">
              <p className="text-sm text-white">{c.content}</p>
              <p className="mt-1 text-xs text-zinc-400">{c.user?.name || 'Anonymous'} • {new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder:text-white/60"
          />
          <button onClick={() => commentMutation.mutate(commentText)} className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600">
            Post
          </button>
        </div>
      </section>
    </div>
  )
}
