"use client"
import React, { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import API from '@/lib/api'

async function fetchEvents() {
  const res = await API.get('/events?limit=12')
  return res.data.events || []
}

export default function FeaturedEvents() {
  const { data: events = [], isLoading } = useQuery({ queryKey: ['featured-events'], queryFn: fetchEvents })
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const eventColors = [
    { bg: "bg-blue-100", border: "border-blue-300", gradient: "from-blue-400 to-blue-600" },
    { bg: "bg-purple-100", border: "border-purple-300", gradient: "from-purple-400 to-purple-600" },
    { bg: "bg-pink-100", border: "border-pink-300", gradient: "from-pink-400 to-pink-600" },
    { bg: "bg-green-100", border: "border-green-300", gradient: "from-green-400 to-green-600" },
    { bg: "bg-orange-100", border: "border-orange-300", gradient: "from-orange-400 to-orange-600" },
    { bg: "bg-cyan-100", border: "border-cyan-300", gradient: "from-cyan-400 to-cyan-600" },
    { bg: "bg-indigo-100", border: "border-indigo-300", gradient: "from-indigo-400 to-indigo-600" },
    { bg: "bg-red-100", border: "border-red-300", gradient: "from-red-400 to-red-600" },
  ]

  return (
    <section className="relative py-16 overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="event-dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#E5E7EB" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#event-dots)"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-10 relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Upcoming events
          </h2>
          <Link 
            href="/events" 
            className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2 group"
          >
            See all
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-zinc-500 text-center py-10">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No events found</p>
        ) : (
          <div className="relative flex items-center z-10">
            <button
              className="hidden md:flex absolute left-0 z-20 bg-gray-900 text-white w-12 h-12 rounded-full items-center justify-center shadow-lg focus:outline-none hover:bg-gray-800 transition-all duration-200 active:scale-95"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              ref={scrollRef}
              className="w-full overflow-x-auto flex gap-4 md:gap-8 px-2 md:px-20 scrollbar-hide scroll-smooth py-2"
              style={{
                scrollBehavior: "smooth",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {events.map((event: any, index: number) => {
                const colorScheme = eventColors[index % eventColors.length]
                const eventDate = new Date(event.startsAt)
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const day = eventDate.getDate()
                
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className={`min-w-[240px] md:min-w-[280px] max-w-[260px] md:max-w-[300px] bg-white rounded-3xl shadow-lg overflow-hidden mr-2 border-b-4 ${colorScheme.border} transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group flex flex-col`}
                  >
                    {/* Event Image or Gradient */}
                    <div className={`h-40 bg-gradient-to-br ${colorScheme.gradient} relative overflow-hidden`}>
                      {event.imageUrl ? (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-2 text-center min-w-[60px]">
                        <div className="text-xs font-bold text-gray-500">{month}</div>
                        <div className="text-2xl font-bold text-gray-900">{day}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-pink-600 transition-colors duration-200 line-clamp-2 mb-3">
                        {event.title}
                      </h3>
                      
                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{event.city}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {Array.isArray(event.tags) && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {event.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className={`text-xs px-2 py-1 rounded-full ${colorScheme.bg} text-gray-700`}>
                              #{tag}
                            </span>
                          ))}
                          {event.tags.length > 2 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                              +{event.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Attendees Count */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{event.attendees?.length || 0} attending</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <button
              className="hidden md:flex absolute right-0 z-20 bg-gray-900 text-white w-12 h-12 rounded-full items-center justify-center shadow-lg focus:outline-none hover:bg-gray-800 transition-all duration-200 active:scale-95"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

