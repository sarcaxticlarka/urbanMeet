"use client";

import Image from "next/image";

const features = [
  "Discover meetups that match your interests",
  "Connect with people and grow your network",
  "Build communities that keep coming back",
];

export default function CustomerSuccess() {
  return (
    <section className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center bg-[#FAFAFA] py-20 px-6 md:px-36 gap-0">
      <div className="flex-1 flex flex-col items-center md:items-start justify-center max-w-2xl text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Community Success
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-xl">
          UrbanMeet helps you run better meetups, create meaningful connections, and grow thriving communities.
        </p>
        <ul className="space-y-6 w-full max-w-xl">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-4 justify-center md:justify-start"
            >
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
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/assets/handsake.png"
          alt="People connecting at a meetup"
          width={480}
          height={480}
          className="max-w-[520px] w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
