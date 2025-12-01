"use client"
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import EventHeader from '@/components/events/EventHeader';
import TicketCard from '@/components/events/TicketCard';
import EventBanner from '@/components/events/EventBanner';
import SearchFilters from '@/components/SearchFilters';
import API from '@/lib/api'

const themes: Array<'green'|'orange'|'blue'> = ['green','orange','blue']

export default function EventsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
    const [filters, setFilters] = useState({
      search: searchParams?.get('search') || '',
      city: '',
      from: '',
      to: ''
    })

    useEffect(() => {
      const searchParam = searchParams?.get('search')
      if (searchParam) {
        setFilters(prev => ({ ...prev, search: searchParam }))
      }
    }, [searchParams])

    // Pagination state
    const [page, setPage] = useState(1)
    const [limit] = useState(12)

    const fetchEvents = async () => {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.city) params.append('city', filters.city)
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)
      params.append('page', String(page))
      params.append('limit', String(limit))
      const res = await API.get(`/events?${params.toString()}`)
      return {
        events: res.data.events || [],
        relatedEvents: res.data.relatedEvents || [],
        pagination: res.data.pagination || { total: 0, page: 1, limit: limit, totalPages: 1 }
      }
    }

    const { data, isLoading } = useQuery({ 
      queryKey: ['events', filters, page], 
      queryFn: fetchEvents 
    })
    const events = data?.events || []
    const relatedEvents = data?.relatedEvents || []
    const pagination = data?.pagination || { total: 0, page: 1, limit, totalPages: 1 }

    const handleFilter = (newFilters: { city?: string; from?: string; to?: string }) => {
      setFilters(prev => ({ ...prev, ...newFilters }))
      setPage(1) // Reset to first page on filter change
    }

    const handleClearSearch = () => {
      setFilters(prev => ({ ...prev, search: '' }))
      setPage(1)
      // Remove search param from URL
      router.push('/events')
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <EventHeader />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex-1 w-full">
                    <SearchFilters onFilter={handleFilter} />
                  </div>
                  <Link
                    href="/events/create"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 font-bold text-sm hover:from-pink-700 hover:to-rose-700 transition shadow-lg w-full md:w-auto whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </Link>
                </div>
                
                {filters.search && (
                  <div className="my-4 text-sm text-zinc-600">
                    Showing results for: <span className="font-semibold">"{filters.search}"</span>
                  </div>
                )}
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {isLoading && <p className="text-center text-zinc-500">Loading events...</p>}
                {!isLoading && events.length === 0 && (
                  <div className="text-center text-zinc-600">
                    <p className="mb-4">No direct matches for <span className="font-semibold">"{filters.search}"</span>.</p>
                    {relatedEvents.length > 0 ? (
                      <div>
                        <p className="text-sm text-zinc-500 mb-2">Related events you might be interested in:</p>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {relatedEvents.map((e: any, idx: number) => {
                            const isFree = !e.price || e.price === 0
                            const priceDisplay = isFree ? 'FREE' : `$${e.price}`
                            return (
                              <TicketCard
                                key={e.id}
                                price={priceDisplay}
                                type={isFree ? 'Free Entry' : 'General Admission'}
                                imageSrc={e.imageUrl || '/globe.svg'}
                                colorTheme={themes[idx % themes.length]}
                                date={new Date(e.startsAt).toLocaleDateString()}
                                time={`${new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${e.endsAt ? ' - ' + new Date(e.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`}
                                location={e.city || e.group?.city || 'Unknown'}
                                eventId={e.id}
                                eventTitle={e.title}
                              />
                            )
                          })}
                        </div>
                        <div className="mt-6">
                          <button onClick={handleClearSearch} className="inline-flex items-center rounded-full bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold px-5 py-2 shadow">
                            See all events
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-500">Try adjusting your search filters or view all upcoming events.</p>
                        <button onClick={handleClearSearch} className="inline-flex items-center rounded-full bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold px-5 py-2 shadow">
                          See all events
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {events.map((e: any, idx: number) => {
                  const isFree = !e.price || e.price === 0
                  const priceDisplay = isFree ? 'FREE' : `$${e.price}`
                  return (
                    <TicketCard
                      key={e.id}
                      price={priceDisplay}
                      type={isFree ? 'Free Entry' : 'General Admission'}
                      imageSrc={e.imageUrl || '/globe.svg'}
                      colorTheme={themes[idx % themes.length]}
                      date={new Date(e.startsAt).toLocaleDateString()}
                      time={`${new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${e.endsAt ? ' - ' + new Date(e.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`}
                      location={e.city || e.group?.city || 'Unknown'}
                      eventId={e.id}
                      eventTitle={e.title}
                    />
                  )
                })}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </button>
                    <span className="mx-2 text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= pagination.totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
            </div>

            <EventBanner />
        </main>
    );
}
