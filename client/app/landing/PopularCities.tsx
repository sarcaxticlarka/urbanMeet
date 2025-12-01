import React from 'react';
import Link from 'next/link';
 
const cityData = [
  {
    name: "New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
    accent: "border-yellow-300",  
    deco: <svg className="absolute left-4 top-4" width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" stroke="#FBBF24" strokeWidth="2"/><path d="M8 8l4 4" stroke="#FBBF24" strokeWidth="2"/></svg>,
    wavyFill: "#FBBF24",  
  },
  {
    name: "San Francisco",
    image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=300&fit=crop",
    accent: "border-orange-300",
    deco: <svg className="absolute left-4 top-4" width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 4v24" stroke="#FB923C" strokeWidth="2"/><path d="M4 16h24" stroke="#FB923C" strokeWidth="2"/></svg>,
    wavyFill: "#FB923C",  
  },
  {
    name: "Chicago",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
    accent: "border-green-300",
    deco: <svg className="absolute left-4 top-4" width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M8 24c8-8 8-8 16 0" stroke="#34D399" strokeWidth="2"/></svg>,
    wavyFill: "#34D399",  
  },
  {
    name: "Nashville",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=300&fit=crop",
    accent: "border-blue-300",
    deco: <svg className="absolute left-4 top-4" width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="4" stroke="#60A5FA" strokeWidth="2"/></svg>,
    wavyFill: "#60A5FA",  
  },
  {
    name: "Miami",
    image: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=300&fit=crop",
    accent: "border-cyan-300",
    deco: <svg className="absolute left-4 top-4" width="32" height="32" fill="none" viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="10" ry="6" stroke="#22D3EE" strokeWidth="2"/></svg>,
    wavyFill: "#22D3EE",  
  },
];

export default function MeetupCities() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Popular cities on Meetup
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Looking for fun things to do near you? See what Meetup organizers are planning in cities around the country.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="relative">
          <div
            className="flex flex-row gap-8 min-h-0 overflow-x-auto scrollbar-hide py-4 px-2"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {cityData.map((city, index) => (
              <Link
                key={index}
                className={`relative bg-white rounded-[32px] shadow-xl w-[300px] h-[340px] flex-shrink-0 flex flex-col items-center justify-end overflow-hidden border-b-4 ${city.accent} transition-transform duration-300 hover:scale-[1.02]`}
                style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)'}}
                href={`/events?city=${encodeURIComponent(city.name)}`}
              >
     
                <div style={{zIndex: 20, position: 'absolute', left: 0, top: 0}}>
                  {city.deco}
                </div>

             
                <div className="w-full h-[245px] relative flex items-end">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover object-center rounded-t-[32px]"
                  />
                  {/* Wavy/Zigzag Bottom SVG Overlay */}
                  <svg
                    className="absolute bottom-0 left-0 w-full"
                    viewBox="0 0 1200 60"
                    preserveAspectRatio="none"
                    style={{ height: '80px' }}
                  >
                    <path
                      d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30 T500,30 T600,30 T700,30 T800,30 T900,30 T1000,30 T1100,30 T1200,30 L1200,60 L0,60 Z"
                      fill={city.wavyFill}
                    />
                  </svg>
                </div>
                {/* City Name */}
                <div className="w-full py-8 text-center text-xl font-bold text-gray-900">
                  {city.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}