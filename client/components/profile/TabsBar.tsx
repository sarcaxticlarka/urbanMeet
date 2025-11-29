"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const tabs = ['Events','Room','Donations','Followers']

export function TabsBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initial = searchParams.get('tab') || 'Events'
  const [active,setActive] = useState(initial)

  useEffect(()=>{
    setActive(initial)
  },[initial])

  const setTab = (t: string) => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()))
    sp.set('tab', t)
    router.push(`?${sp.toString()}`)
    setActive(t)
  }

  return (
    <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 px-4">
      {tabs.map(t => (
        <button
          key={t}
          onClick={()=>setTab(t)}
          className={`relative px-4 py-3 text-sm font-medium transition-colors ${active===t? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t}
          {active===t && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-zinc-900" />}
        </button>
      ))}
      <div className="ml-auto" />
    </div>
  )
}
