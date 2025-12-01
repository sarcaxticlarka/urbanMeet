"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaSearch, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaStar, FaBullseye, FaRocket, FaLightbulb, FaPalette, FaGem } from 'react-icons/fa'
import API from '@/lib/api'

async function fetchGroups(search?: string, city?: string) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (city) params.append('city', city)
  const queryString = params.toString()
  const res = await API.get(`/groups${queryString ? `?${queryString}` : ''}`)
  return { groups: res.data.groups || [], relatedGroups: res.data.relatedGroups || [] }
}

const themes: Array<'purple'|'teal'|'pink'|'indigo'> = ['purple','teal','pink','indigo']

export default function GroupsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get('search') || ''
  const cityQuery = searchParams?.get('city') || ''

  const [search, setSearch] = useState(searchQuery)
  const [city, setCity] = useState(cityQuery)

  const { data, isLoading } = useQuery({
    queryKey: ['groups', searchQuery, cityQuery],
    queryFn: () => fetchGroups(searchQuery, cityQuery)
  })
  const groups = data?.groups || []
  const relatedGroups = data?.relatedGroups || []

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (city) params.append('city', city)
    router.push(`/groups?${params.toString()}`)
  }

  const themeColors = {
    purple: {
      bg: 'bg-[#5B21B6]',
      accent: 'bg-[#C084FC]',
      text: 'text-[#C084FC]',
      button: 'bg-[#1E40AF]',
    },
    teal: {
      bg: 'bg-[#0F766E]',
      accent: 'bg-[#5EEAD4]',
      text: 'text-[#5EEAD4]',
      button: 'bg-[#1E40AF]',
    },
    pink: {
      bg: 'bg-[#BE185D]',
      accent: 'bg-[#F9A8D4]',
      text: 'text-[#F9A8D4]',
      button: 'bg-[#5B21B6]',
    },
    indigo: {
      bg: 'bg-[#3730A3]',
      accent: 'bg-[#A78BFA]',
      text: 'text-[#A78BFA]',
      button: 'bg-[#BE185D]',
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section - Similar to EventHeader */}
      <div className="relative w-full h-64 md:h-80 bg-[#5B21B6] flex flex-col items-center justify-center overflow-hidden">
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative z-10 text-center">
          <h1 className="text-7xl md:text-9xl font-black text-[#C084FC] tracking-tighter uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
            GROUPS
          </h1>
          <p className="text-white text-xl md:text-2xl mt-4 font-medium tracking-wide">
            Find Your Community and Connect
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Groups
                </label>
                <input
                  type="text"
                  placeholder="Search by name, interests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                />
              </div>
              <div className="md:w-1/3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {(searchQuery || cityQuery) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {searchQuery && <span>Searching for: <strong>"{searchQuery}"</strong></span>}
                {searchQuery && cityQuery && <span className="mx-2">•</span>}
                {cityQuery && <span>in <strong>{cityQuery}</strong></span>}
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setCity('')
                  router.push('/groups')
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Groups List */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-4xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery || cityQuery ? 'Search Results' : 'All Groups'} 
            <span className="text-gray-500 font-normal ml-2">({groups.length})</span>
          </h2>
          <Link
            href="/groups/create"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Group
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="mb-4 flex justify-center text-gray-400">
              <FaSearch size={60} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No groups found</h3>
            {(searchQuery || cityQuery) && (
              <p className="text-gray-600 mb-6">No direct matches for {searchQuery && <span className="font-semibold">"{searchQuery}"</span>} {cityQuery && <>in <span className="font-semibold">{cityQuery}</span></>}.</p>
            )}
            {relatedGroups.length > 0 ? (
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-4">Related groups you might be interested in:</p>
                <div className="space-y-6">
                  {relatedGroups.map((group: any, idx: number) => {
                    const colorTheme = themes[idx % themes.length]
                    const theme = themeColors[colorTheme]
                    return (
                      <div key={group.id} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto drop-shadow relative">
                        {/* Top Circle Cutout (mobile) */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-8 h-8 bg-gray-50 rounded-full z-20 md:hidden"></div>
                        
                        <div className={`w-full md:w-2/3 ${theme.bg} p-6 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex flex-col md:flex-row items-center text-center md:text-left relative`}> 
                          {/* Bottom border (mobile) */}
                          <div className="absolute left-0 right-0 bottom-0 border-b-2 border-dashed border-white/30 md:hidden"></div>
                          
                          <div className="w-32 h-32 relative shrink-0 border-4 border-white mb-4 md:mb-0 md:mr-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                            {group.coverImage ? (
                              <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <div className="text-white text-4xl">
                                {[<FaUsers key="users" />, <FaBullseye key="target" />, <FaRocket key="rocket" />, <FaLightbulb key="idea" />, <FaPalette key="art" />, <FaStar key="star" />][idx % 6]}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col text-white">
                            <h4 className={`text-xl font-black uppercase mb-1 ${theme.text}`}>{group.name}</h4>
                            <p className="text-xs text-white/80 line-clamp-2 mb-2">{group.description || 'A vibrant community group.'}</p>
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-1 justify-center md:justify-start"><FaMapMarkerAlt size={12} /> {group.city}</div>
                              <div className="flex items-center gap-1 justify-center md:justify-start"><FaUsers size={12} /> {group.members?.length || 0} members</div>
                            </div>
                          </div>
                          
                          {/* Right Circle Cutout (desktop) */}
                          <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full z-20"></div>
                          <div className="hidden md:block absolute right-0 top-0 bottom-0 border-r-2 border-dashed border-white/30"></div>
                        </div>
                        
                        {/* Bottom Circle Cutout (mobile) */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-8 h-8 bg-gray-50 rounded-full z-20 md:hidden"></div>
                        
                        <div className={`${theme.accent} w-full md:w-1/3 p-6 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none flex flex-col items-center justify-center text-center relative`}>
                          {/* Left Circle Cutout (desktop) */}
                          <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full z-20"></div>
                          
                          <Link href={`/groups/${group.id}`} className={`${theme.button} text-white px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90`}>View Group »</Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setSearch('')
                  setCity('')
                  router.push('/groups')
                }}
                className="inline-flex items-center rounded-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 text-sm font-semibold shadow"
              >
                See all groups
              </button>
              <Link
                href="/groups/create"
                className="inline-flex items-center rounded-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 text-sm font-semibold shadow"
              >
                Create a new group
              </Link>
            </div>
          </div>
        ) : (
          groups.map((group: any, idx: number) => {
            const colorTheme = themes[idx % themes.length]
            const theme = themeColors[colorTheme]
            
            return (
              <div key={group.id} className="flex flex-col md:flex-row w-full max-w-4xl mx-auto drop-shadow-xl relative">
                {/* Top Circle Cutout (mobile) */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-8 h-8 bg-gray-50 rounded-full z-20 md:hidden"></div>
                
                {/* Left Part (Main Content) */}
                <div className={`w-full md:w-2/3 ${theme.bg} p-6 relative rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex flex-col md:flex-row items-center text-center md:text-left`}>
                  {/* Group Icon/Avatar Area */}
                  <div className="w-32 h-32 md:w-48 md:h-48 relative shrink-0 border-4 border-white mb-4 md:mb-0 md:mr-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                    {group.coverImage ? (
                      <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-white text-4xl md:text-6xl">
                        {[<FaUsers key="users" />, <FaBullseye key="target" />, <FaRocket key="rocket" />, <FaLightbulb key="idea" />, <FaPalette key="art" />, <FaStar key="star" />][idx % 6]}
                      </div>
                    )}
                  </div>

                  {/* Decorative Pattern Strip (desktop only) */}
                  <div className={`hidden md:flex absolute left-[230px] top-0 bottom-0 w-12 flex-col justify-center items-center py-4 space-y-1 ${theme.accent}`}>
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-8 h-1 bg-black/20 mb-1"></div>
                    ))}
                  </div>

                  {/* Text Content */}
                  <div className="md:ml-16 flex flex-col justify-center text-white z-10 md:pl-4">
                    <h2 className={`text-2xl md:text-3xl font-black uppercase leading-none mb-3 ${theme.text}`}>
                      {group.name}
                    </h2>
                    <p className="text-sm text-white/90 mb-4 line-clamp-2">
                      {group.description || 'Join this amazing community and connect with like-minded people'}
                    </p>
                    <div className="space-y-1 text-sm font-medium opacity-90">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <FaMapMarkerAlt /> {group.city}
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <FaUsers /> {group._count?.members || 0} members
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <FaCalendarAlt /> {group._count?.events || group.events?.length || 0} events
                      </div>
                    </div>
                  </div>

                  {/* Bottom border (mobile) */}
                  <div className="absolute left-0 right-0 bottom-0 border-b-2 border-dashed border-white/30 md:hidden"></div>
                  
                  {/* Right Circle Cutout (desktop) */}
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full z-20"></div>
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 border-r-2 border-dashed border-white/30"></div>
                </div>

                {/* Bottom Circle Cutout (mobile) */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-8 h-8 bg-gray-50 rounded-full z-20 md:hidden"></div>

                {/* Right Part (Join Action) */}
                <div className={`w-full md:w-1/3 ${theme.accent} p-6 relative rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none flex flex-col justify-center items-center text-center`}>
                  {/* Left Circle Cutout (desktop) */}
                  <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full z-20"></div>

                  <div className="text-4xl md:text-5xl mb-4 text-gray-900">
                    {[<FaStar key="star" />, <FaBullseye key="target" />, <FaGem key="gem" />, <FaRocket key="rocket" />][idx % 4]}
                  </div>
                  
                  <div className="text-lg md:text-xl font-bold uppercase mb-6 text-gray-900 tracking-tight">
                    Community
                  </div>

                  <Link 
                    href={`/groups/${group.id}`}
                    className={`${theme.button} text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2`}
                  >
                    View Group
                    <span>»</span>
                  </Link>

                  {group.owner && (
                    <div className="mt-4 pt-4 border-t border-black/10 w-full">
                      <p className="text-xs text-gray-700 font-semibold">Organized by</p>
                      <p className="text-sm text-gray-900 font-bold truncate">
                        {group.owner.name || 'Organizer'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-16 mt-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">Can't Find Your Community?</h2>
          <p className="text-xl mb-8">Create your own group and bring people together!</p>
          <Link
            href="/groups/create"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            Start Your Group Today
          </Link>
        </div>
      </div>
    </main>
  )
}


