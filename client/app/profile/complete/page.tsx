"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import Image from 'next/image';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/auth/login');
    }
  }, [router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const interestsArray = interests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await API.patch('/users/me', { city, bio, interests: interestsArray });
      router.push('/profile');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 rounded-[48px] shadow-xl p-8 relative overflow-hidden">
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative   p-6 rounded-lg">
          {/* Illustration side */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <Image
              src="/assets/allskill.png"
              alt="Profile Completion"
              width={360}
              height={360}
              className="object-contain mx-auto drop-shadow-lg"
              priority
            />
            <div className="mt-6 text-xl font-semibold text-gray-700 text-center max-w-xs">
              Personalize your experience with UrbanMeet
            </div>
          </div>

          {/* Form side */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-pink-500 mb-4">Complete your profile</h1>
            <p className="text-sm text-blue-500 mb-6">Tell us a bit about yourself to get better event recommendations</p>

            <form onSubmit={save} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-500">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Mumbai"
                  className="w-full rounded-lg border border-pink-300 bg-pink-50 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-500">Interests</label>
                <input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="AI, Web, Hackathons"
                  className="w-full rounded-lg border border-blue-300 bg-blue-50 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated tags</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-500">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short introduction"
                  rows={5}
                  className="w-full rounded-lg border border-green-300 bg-green-50 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="rounded-lg bg-gray-200 py-2 px-4 text-gray-700 hover:bg-gray-300"
                >Skip for now</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-pink-400 py-2 px-4 text-white hover:bg-pink-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save and continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
