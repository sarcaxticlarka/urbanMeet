"use client"
import React from 'react'

export function EventCardSkeleton() {
  return (
    <div className="w-full max-w-sm animate-pulse overflow-hidden rounded-2xl bg-white/20 p-4 backdrop-blur-md">
      <div className="h-40 w-full rounded-md bg-white/10"></div>
      <div className="mt-3 h-6 w-3/4 rounded bg-white/10"></div>
      <div className="mt-2 h-4 w-1/2 rounded bg-white/10"></div>
    </div>
  )
}
