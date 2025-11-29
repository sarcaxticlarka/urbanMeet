"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import API from '@/lib/api'

async function fetchGroup(id: string) {
  const res = await API.get(`/groups/${id}`)
  return res.data.group
}

export default function GroupPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: group, isLoading } = useQuery({ queryKey: ['group', id], queryFn: () => fetchGroup(id) });
  const [joining, setJoining] = React.useState(false);
  const [following, setFollowing] = React.useState(false);

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      setJoining(true);
      await API.post(`/groups/${id}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setJoining(false);
      window.location.reload();
    } catch (err: any) {
      setJoining(false);
      alert(err?.response?.data?.error || 'Failed to join');
    }
  };
  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      setFollowing(true);
      await API.post(`/groups/${id}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setFollowing(false);
      window.location.reload();
    } catch (err: any) {
      setFollowing(false);
      alert(err?.response?.data?.error || 'Failed to follow');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!group) return <div className="p-8 text-center text-rose-500">Group not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="w-full max-w-2xl rounded-[40px] shadow-2xl bg-white ring-1 ring-zinc-200 p-8 md:p-12">
        <div className="flex flex-col items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg">
            <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 text-center">{group.name}</h2>
          <p className="text-md text-zinc-500 text-center">{group.city} • {group.members?.length || 0} members</p>
        </div>
        <div className="mb-6 text-zinc-700 text-lg text-center">
          {group.description}
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 text-white font-semibold shadow hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
          >
            {joining ? 'Joining...' : 'Join Group'}
          </button>
          <button
            onClick={handleFollow}
            disabled={following}
            className="rounded-full border-2 border-pink-400 bg-white px-6 py-2 text-pink-600 font-semibold shadow hover:bg-pink-50 disabled:opacity-50"
          >
            {following ? 'Following...' : 'Follow Group'}
          </button>
        </div>
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-zinc-900">Upcoming events</h3>
            <Link href={`/events/create?groupId=${id}`} className="rounded bg-pink-500 px-3 py-1 text-sm text-white hover:bg-pink-600">
              Create Event
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {group.events?.length > 0 ? group.events.map((e: any) => (
              <li key={e.id} className="rounded bg-pink-50 p-3 shadow">
                <Link href={`/events/${e.id}`} className="text-pink-500 hover:underline font-semibold text-base">{e.title}</Link>
                <p className="text-xs text-zinc-500">{new Date(e.startsAt).toLocaleString()}</p>
              </li>
            )) : <p className="text-sm text-zinc-400">No upcoming events</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}
