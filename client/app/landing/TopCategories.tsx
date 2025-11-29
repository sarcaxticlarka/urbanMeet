"use client";

import { useRef } from "react";

export const categories = [
  {
    title: "Travel and Outdoor",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <path d="M18 4l-7 20h14L18 4z" fill="#34D399" />
        <text
          x="18"
          y="28"
          textAnchor="middle"
          fontSize="18"
          fill="#059669"
          fontWeight="bold"
        >
          z
        </text>
      </svg>
    ),
    border: "border-b-4 border-green-300",
  },
  {
    title: "Social Activities",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <path
          d="M18 32c7.732 0 14-6.268 14-14S25.732 4 18 4 4 10.268 4 18s6.268 14 14 14z"
          fill="#F87171"
        />
        <path
          d="M24 24l-6-6-6 6"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    border: "border-b-4 border-red-200",
  },
  {
    title: "Hobbies and Passions",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <path
          d="M18 4a14 14 0 100 28 14 14 0 000-28z"
          fill="#67E8F9"
        />
        <path
          d="M12 24l6-6 6 6"
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    border: "border-b-4 border-cyan-200",
  },
  {
    title: "Sports and Fitness",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="#FDBA74" />
        <circle cx="18" cy="18" r="6" fill="#F59E42" />
      </svg>
    ),
    border: "border-b-4 border-orange-200",
  },
  {
    title: "Health and Wellbeing",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <path
          d="M18 4a14 14 0 100 28 14 14 0 000-28z"
          fill="#C4B5FD"
        />
        <path
          d="M18 12v8l6 4"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    border: "border-b-4 border-purple-200",
  },
  {
    title: "Technology",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect
          x="8"
          y="8"
          width="20"
          height="20"
          rx="5"
          fill="#FCA5A5"
        />
        <rect
          x="14"
          y="14"
          width="8"
          height="8"
          rx="2"
          fill="#fff"
        />
      </svg>
    ),
    border: "border-b-4 border-red-200",
  },
  {
    title: "Art and Culture",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <ellipse
          cx="18"
          cy="18"
          rx="14"
          ry="10"
          fill="#FDE68A"
        />
        <path
          d="M10 18c0-4 8-4 8 0s8 4 8 0"
          stroke="#F59E42"
          strokeWidth="2"
        />
      </svg>
    ),
    border: "border-b-4 border-yellow-200",
  },
  {
    title: "Games",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect
          x="6"
          y="12"
          width="24"
          height="12"
          rx="6"
          fill="#A7F3D0"
        />
        <circle cx="12" cy="18" r="2" fill="#059669" />
        <circle cx="24" cy="18" r="2" fill="#059669" />
      </svg>
    ),
    border: "border-b-4 border-green-200",
  },
  {
    title: "Career",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect
          x="8"
          y="14"
          width="20"
          height="12"
          rx="4"
          fill="#FECACA"
        />
        <rect
          x="14"
          y="10"
          width="8"
          height="6"
          rx="2"
          fill="#F87171"
        />
      </svg>
    ),
    border: "border-b-4 border-pink-200",
  },
  {
    title: "Business",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect
          x="6"
          y="18"
          width="24"
          height="10"
          rx="3"
          fill="#FDE68A"
        />
        <rect
          x="10"
          y="10"
          width="16"
          height="8"
          rx="2"
          fill="#F59E42"
        />
      </svg>
    ),
    border: "border-b-4 border-yellow-300",
  },
  {
    title: "Education",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect
          x="8"
          y="14"
          width="20"
          height="10"
          rx="3"
          fill="#BFDBFE"
        />
        <rect
          x="14"
          y="10"
          width="8"
          height="6"
          rx="2"
          fill="#3B82F6"
        />
      </svg>
    ),
    border: "border-b-4 border-blue-200",
  },
  {
    title: "More",
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="#E5E7EB" />
        <circle cx="18" cy="18" r="2" fill="#6B7280" />
        <circle cx="10" cy="18" r="2" fill="#6B7280" />
        <circle cx="26" cy="18" r="2" fill="#6B7280" />
      </svg>
    ),
    border: "border-b-4 border-gray-300",
  },
];

export default function TopCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left:
          dir === "left"
            ? scrollLeft - clientWidth
            : scrollLeft + clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-[#F5F5F5] py-16 px-20 relative overflow-x-hidden">
      {/* Subtle pattern background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          className="opacity-10"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#a3a3a3" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#dots)"
          />
        </svg>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-10 ml-4 relative z-10">
        Explore top categories
      </h2>
      <div className="relative flex items-center z-10">
        <button
          className="absolute left-0 z-20 bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none hover:bg-gray-800 transition-all duration-200 active:scale-95"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto flex gap-8 px-20 scrollbar-hide scroll-smooth py-2"
          style={{
            scrollBehavior: "smooth",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.title}
              className={`min-w-[260px] max-w-[280px] h-52 bg-white rounded-3xl shadow-lg flex flex-col justify-between p-7 mr-2 ${cat.border} transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group`}
              tabIndex={0}
            >
              <div className="flex flex-col gap-2">
                <span className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-200">
                  {cat.title}
                </span>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-gray-400 group-hover:text-gray-700 transition-colors duration-200">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="drop-shadow-md">
                  {cat.icon}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute right-0 z-20 bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none hover:bg-gray-800 transition-all duration-200 active:scale-95"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
