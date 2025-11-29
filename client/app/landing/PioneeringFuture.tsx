"use client";

import Image from "next/image";

const features = [
  "Discover events that fit you",
  "Create and grow your groups",
  "Stay connected anytime, anywhere",
];

export default function PioneeringFuture() {
  return (
    <section className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center bg-[#FAFAFA] py-16 px-4 gap-8">
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/assets/coding.png"
          alt="Meetup platform illustration"
          width={480}
          height={480}
          className="max-w-[520px] w-full h-auto"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-start justify-center max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Build Your Next Meetup
        </h2>
        <p className="text-gray-600 text-md pr-36 mb-8">
          A modern platform for hosting meetups, finding events, and connecting with people who share your interests.
        </p>
        <ul className="space-y-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-300">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#FACC15" />
                  <path
                    d="M6 10.5l2.5 2L14 7.5"
                    stroke="#18181B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
