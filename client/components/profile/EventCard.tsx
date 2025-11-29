"use client"
import React from 'react'
import Link from 'next/link'

interface EventCardProps {
  id: string
  title: string
  location: string
  description: string
  image?: string
  accent?: string
}

export function EventCard({ id, title, location, description, image, accent }: EventCardProps) {
  return (
    <Link href={`/events/${id}`} className="group rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className={`h-32 w-full bg-gradient-to-br ${accent || 'from-pink-400 to-purple-500'} relative`}>        
        {image && <img src={image} alt={title} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">{title}</h3>
        <p className="text-xs text-zinc-500">@ {location}</p>
        <p className="text-xs text-zinc-600 line-clamp-2">{description}</p>
      </div>
    </Link>
  )
}
