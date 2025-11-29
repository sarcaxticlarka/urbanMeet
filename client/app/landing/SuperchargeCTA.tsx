"use client";

import Image from "next/image";

export default function SuperchargeCTA() {
  return (
    <section className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center bg-[#FAFAFA] py-20 px-6 md:px-16 gap-8 md:gap-0">
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/assets/location.png"
          alt="Find meetups near you"
          width={350}
          height={350}
          className="max-w-[400px] w-full h-auto"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl md:text-6xl font-semibold mb-4 leading-tight">
          Ready to<br />Meet Up?
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          Create your free account and start exploring events today.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded shadow text-lg transition">
          Join UrbanMeet 
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/assets/painting.png"
          alt="Join vibrant communities"
          width={350}
          height={350}
          className="max-w-[400px] w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
