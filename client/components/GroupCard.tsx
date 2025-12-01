"use client"
import React from 'react'
import Link from 'next/link'

export default function GroupCard({ group }: { group: any }) {
  return (
    <Link href={`/groups/${group.id}`} className="min-w-[260px] max-w-[300px] h-56 bg-white rounded-3xl shadow-lg flex flex-col justify-between p-7 border border-zinc-200 transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold text-gray-900 leading-tight">{group.name}</span>
        <span className="text-sm text-zinc-600">Owner: {group.owner?.name || 'Unknown'}</span>
      </div>
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-zinc-500">{group.city}</span>
        <span className="text-xs text-zinc-400">{group.members?.length || 0} members</span>
      </div>
    </Link>
  )
}
