"use client"
import React, { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import API from '@/lib/api'
import ImageUploader from '@/components/ImageUploader'


import { categories as topCategories } from '@/app/landing/TopCategories';

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId') || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [otherCategory, setOtherCategory] = useState('');
  const [tags, setTags] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }
    try {
      const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      let categoriesToSend = selectedCategories.filter(c => c !== '__other__');
      if (selectedCategories.includes('__other__') && otherCategory.trim()) {
        categoriesToSend = [...categoriesToSend, otherCategory.trim()];
      }
      const payload: any = {
        groupId,
        title,
        description,
        startsAt,
        city,
        venue,
        tags: tagsArray,
        categories: categoriesToSend,
      };
      if (endsAt) payload.endsAt = endsAt;
      if (address) payload.address = address;
      if (capacity !== '') payload.capacity = Number(capacity);
      if (imageUrl) payload.imageUrl = imageUrl;

      const res = await API.post('/events', payload);
      router.push(`/events/${res.data.event.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="w-full max-w-3xl rounded-[40px] shadow-2xl bg-white ring-1 ring-zinc-200 p-8 md:p-12">
        <div className="flex flex-col items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-br from-pink-400 to-indigo-400 p-4 shadow-lg">
            <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 text-center">Create an Event</h2>
          <p className="text-md text-zinc-500 text-center">Host something amazing for your community</p>
        </div>
        <form onSubmit={submit} className="space-y-7">
          {/* ...existing code... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Event Title<span className="text-rose-500">*</span></label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hackathon Night" className="w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold focus:ring-2 focus:ring-pink-200" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Starts At<span className="text-rose-500">*</span></label>
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 px-4 text-zinc-900 font-semibold" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Ends At</label>
              <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 px-4 text-zinc-900 font-semibold" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">City<span className="text-rose-500">*</span></label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Venue</label>
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-indigo-700">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')} placeholder="Capacity" className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-pink-600">Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. tech, networking, fun" className="w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-pink-600">Event Description<span className="text-rose-500">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your event in detail..." rows={5} className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50 py-3 px-4 text-zinc-900 placeholder:text-zinc-400 font-semibold resize-none" required />
          </div>
          <div className="mb-6">
            <label className="mb-3 block text-base font-bold text-pink-600 tracking-wide">Select Categories<span className="text-rose-500">*</span></label>
            <div className="rounded-2xl p-4 bg-gradient-to-r from-pink-50 via-indigo-50 to-purple-50 shadow-inner flex flex-wrap gap-3 justify-center">
              {topCategories.filter(cat => cat.title !== 'More').map((cat) => {
                const palette = [
                  'bg-pink-100 text-pink-700',
                  'bg-yellow-100 text-yellow-700',
                  'bg-green-100 text-green-700',
                  'bg-blue-100 text-blue-700',
                  'bg-purple-100 text-purple-700',
                  'bg-cyan-100 text-cyan-700',
                  'bg-orange-100 text-orange-700',
                  'bg-red-100 text-red-700',
                  'bg-indigo-100 text-indigo-700',
                  'bg-teal-100 text-teal-700',
                  'bg-fuchsia-100 text-fuchsia-700',
                  'bg-lime-100 text-lime-700',
                  'bg-rose-100 text-rose-700',
                  'bg-amber-100 text-amber-700',
                ];
                const idx = topCategories.findIndex(c => c.title === cat.title);
                const color = palette[idx % palette.length];
                const selected = selectedCategories.includes(cat.title);
                return (
                  <button
                    key={cat.title}
                    type="button"
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all focus:outline-none border-2 duration-150 shadow-sm
                      ${color}
                      ${selected ? 'border-pink-500 bg-pink-200 text-pink-800 scale-105 shadow-lg' : 'border-transparent opacity-90 hover:opacity-100 hover:scale-105 hover:shadow-md'}
                    `}
                    style={{letterSpacing: '.01em'}}
                    onClick={() => setSelectedCategories(selected ? selectedCategories.filter((t) => t !== cat.title) : [...selectedCategories, cat.title])}
                  >
                    {cat.title}
                  </button>
                );
              })}
              {/* Other (type specific) option */}
              <button
                type="button"
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all focus:outline-none border-2 duration-150 shadow-sm bg-gray-100 text-gray-700 ${selectedCategories.includes('__other__') ? 'border-pink-500 bg-pink-200 text-pink-800 scale-105 shadow-lg' : 'border-transparent opacity-90 hover:opacity-100 hover:scale-105 hover:shadow-md'}`}
                onClick={() => setSelectedCategories(selectedCategories.includes('__other__') ? selectedCategories.filter((t) => t !== '__other__') : [...selectedCategories, '__other__'])}
              >
                Other (type specific)
              </button>
              {selectedCategories.includes('__other__') && (
                <input
                  type="text"
                  className="ml-2 px-4 py-2 rounded-full border-2 border-pink-300 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-200 w-56"
                  placeholder="Type your category..."
                  value={otherCategory}
                  onChange={e => setOtherCategory(e.target.value)}
                />
              )}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-pink-600">Event Poster</label>
            <ImageUploader value={imageUrl} onChange={setImageUrl} />
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 py-3 text-white font-bold shadow-lg hover:from-pink-600 hover:to-indigo-600 disabled:opacity-50 text-lg transition-all">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 font-semibold">{error}</div>}
        </form>
      </div>
    </div>
  );
}
