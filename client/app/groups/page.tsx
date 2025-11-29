"use client"
import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import API from '@/lib/api'
import { categories as topCategories } from '@/app/landing/TopCategories';

async function fetchGroups() {
  const res = await API.get('/groups')
  return res.data.groups
}

export default function GroupsPage() {
  const { data: groups = [], isLoading } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })

  // Try to match group name to a category for icon/border, fallback to default
  function getCategoryStyle(name: string) {
    const cat = topCategories.find(c => name.toLowerCase().includes(c.title.split(' ')[0].toLowerCase()));
    return cat ? { icon: cat.icon, border: cat.border } : { icon: topCategories[0].icon, border: topCategories[0].border };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-zinc-900">Explore Groups</h2>
          <Link href="/groups/create" className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-7 py-3 text-lg text-white font-semibold shadow hover:from-pink-600 hover:to-purple-600 transition">+ Create Group</Link>
        </div>
        {isLoading && <p className="text-center text-zinc-500">Loading...</p>}
        <div className="flex flex-wrap gap-8 justify-center">
          {groups.map((g: any) => {
            const { icon, border } = getCategoryStyle(g.name);
            return (
              <Link key={g.id} href={`/groups/${g.id}`} className={`min-w-[260px] max-w-[300px] h-56 bg-white rounded-3xl shadow-lg flex flex-col justify-between p-7 ${border} transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group`} tabIndex={0}>
                <div className="flex flex-col gap-2">
                  <span className="drop-shadow-md">{icon}</span>
                  <span className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-200">{g.name}</span>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-zinc-500">{g.city}</span>
                  <span className="text-xs text-zinc-400">{g.members?.length || 0} members</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}
