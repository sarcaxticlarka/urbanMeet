"use client"
import React from 'react'
import { format } from 'date-fns'

type Props = {
  event: any
}

export default function EventCard({ event }: Props) {
  return (
    <article className="group relative w-full max-w-sm overflow-hidden rounded-2xl bg-white/30 p-4 backdrop-blur-md shadow-md transition-transform hover:scale-[1.02]">
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="h-40 w-full rounded-md object-cover" />
      )}
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-pink-600">{event.title}</h3>
        <p className="mt-1 text-sm text-zinc-700">{event.group?.name}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
          <span>{format(new Date(event.startsAt), 'PP p')}</span>
          <span className="ml-2 rounded-full bg-pink-100 px-2 py-1 text-pink-700">{event.attendees?.length || 0} going</span>
        </div>
      </div>
    </article>
  )
}
