"use client"
import React, { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import API from '@/lib/api'

async function fetchGroups() {
  const res = await API.get('/groups?limit=12')
  return res.data.groups || []
}

export default function FeaturedGroups() {
  const { data: groups = [], isLoading } = useQuery({ queryKey: ['featured-groups'], queryFn: fetchGroups })
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const groupColors = [
    { bg: "bg-green-100", border: "border-green-300", icon: "🌿" },
    { bg: "bg-red-100", border: "border-red-200", icon: "🎯" },
    { bg: "bg-cyan-100", border: "border-cyan-200", icon: "💡" },
    { bg: "bg-orange-100", border: "border-orange-200", icon: "⚡" },
    { bg: "bg-purple-100", border: "border-purple-200", icon: "🎨" },
    { bg: "bg-pink-100", border: "border-pink-200", icon: "❤️" },
    { bg: "bg-yellow-100", border: "border-yellow-300", icon: "⭐" },
    { bg: "bg-blue-100", border: "border-blue-200", icon: "🚀" },
  ]

  return (
    <section className="relative py-16 overflow-hidden bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="group-dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#D1D5DB" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#group-dots)"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-10 relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Popular groups
          </h2>
          <Link 
            href="/groups" 
            className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2 group"
          >
            See all
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-zinc-500 text-center py-10">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No groups found</p>
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
              {groups.map((group: any, index: number) => {
                const colorScheme = groupColors[index % groupColors.length]
                return (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className={`min-w-[220px] md:min-w-[260px] max-w-[240px] md:max-w-[280px] h-52 bg-white rounded-3xl shadow-lg flex flex-col justify-between p-5 md:p-7 mr-2 border-b-4 ${colorScheme.border} transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-lg md:text-xl font-bold text-gray-900 leading-tight group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                        {group.name}
                      </span>
                      <span className="text-xs md:text-sm text-gray-600 line-clamp-2">
                        {group.description || 'Join this amazing group'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        📍 {group.city}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs md:text-sm text-gray-500">
                        {group._count?.members || 0} members
                      </span>
                      <span className="text-3xl md:text-4xl drop-shadow-md">
                        {colorScheme.icon}
                      </span>
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

