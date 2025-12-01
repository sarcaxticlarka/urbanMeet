"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center bg-[#FAFAFA] py-12  relative overflow-x-hidden">
      <div className="absolute left-0 bottom-0 md:top-1/2 md:bottom-auto md:translate-y-[-50%] z-10">
        <Image
          src="/assets/p.png"
          alt="Left Illustration"
          width={400}
          height={400}
          className="hidden md:block"
          priority
        />
      </div>
      <div className="absolute right-0 bottom-0 md:top-1/2 md:bottom-auto md:translate-y-[-50%] z-10">
        <Image
          src="/assets/s.png"
          alt="Right Illustration"
          width={400}
          height={400}
          className="hidden md:block"
          priority
        />
      </div>
      <div className="relative z-20 flex flex-col items-center max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex -space-x-2">
            <span className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
            <span className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white" />
            <span className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
            <span className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white" />
            <span className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white" />
          </div>
          <span className="text-gray-600 text-sm font-medium">75% more event engagement</span>
          <span className="ml-2 text-yellow-400">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m8-8h2M2 12H4m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-2 leading-tight">
          Meet People.
          <span className="inline-block mt-2">Build Communities.</span>
        </h1>
        <p className="text-gray-500 text-lg mb-6">
          Discover and host meetups where people learn new skills, share interests, and grow together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/auth/register" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md shadow transition">
            Get Started for Free
          </Link>
          <Link href="/events" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-md shadow transition">
            Explore Events
          </Link>
        </div>
        <div className="text-gray-500 text-sm mb-4">
          Join 100+ groups already hosting meetups and events
        </div>
      </div>
    </section>
  );
}
