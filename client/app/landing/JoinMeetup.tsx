"use client";

import Image from "next/image";

export default function JoinMeetup() {
  return (
    <section className="w-full flex items-center justify-center bg-[#F5F5F5] py-16 px-2">
      <div className="relative w-full max-w-5xl bg-white rounded-[48px] shadow-xl flex flex-col md:flex-row items-center justify-between overflow-hidden min-h-[420px]">
        {/* Top shadow shape */}
        <div
          className="absolute -top-8 left-0 w-full h-12 bg-yellow-200 rounded-t-[48px] z-0"
          style={{ transform: "skewY(-3deg)" }}
        />
        {/* Left image */}
        <div className="hidden md:flex flex-1 items-end justify-center z-10">
          <Image
            src="/assets/peoplegrp.png"
            alt="People Group"
            width={260}
            height={260}
            className="object-contain -mb-8"
            priority
          />
        </div>
        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Join Meetups</h2>
          <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-xl">
            Use UrbanMeet to meet new people, discover events you love, and grow with your community — all for free.
          </p>
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-full shadow-lg text-lg transition focus:outline-none">
            Sign up for free
          </button>
        </div>
        {/* Right image */}
        <div className="hidden md:flex flex-1 items-end justify-center z-10">
          <Image
            src="/assets/learning.png"
            alt="Learning Group"
            width={220}
            height={220}
            className="object-contain -mb-8"
            priority
          />
        </div>
        {/* Decorative icons and Get started! badge */}
        <div className="absolute -top-8 -left-8 md:top-10 md:left-10 z-20 flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="block">
            <circle cx="80" cy="100" r="70" fill="#fff" />
            <path id="curve" d="M30,60 A20,20 0 0,1 70,60" fill="none" />
            <text width="100">
              <textPath
                href="#curve"
                startOffset="0"
                className="font-bold"
                fill="#F472B6"
                fontSize="16"
                fontFamily="inherit"
              >
                Get started!
              </textPath>
            </text>
          </svg>
        </div>
        <svg
          className="absolute left-8 bottom-24 w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <svg
          className="absolute right-8 top-20 w-6 h-6 text-pink-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2v2m0 16v2m8-8h2M2 12H4m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
