"use client";

import { useState } from "react";
import Image from "next/image";

const faqs = [
  {
    question: "What is UrbanMeet?",
    answer:
      "UrbanMeet is a platform where you can discover, join, and host local or online meetups around your interests.",
    bg: "bg-purple-100",
  },
  {
    question: "How does UrbanMeet work?",
    answer:
      "Create a free account, follow groups you like, and RSVP to events. Organizers can create groups, publish events, and manage attendees from a simple dashboard.",
    bg: "bg-yellow-100",
  },
  {
    question: "Is UrbanMeet free to use?",
    answer:
      "Yes, joining UrbanMeet, exploring events, and RSVPing to most meetups is free. Some organizers may charge for special or ticketed events.",
    bg: "bg-pink-100",
  },
  {
    question: "Who can host events on UrbanMeet?",
    answer:
      "Anyone with an account can start a group and host events—students, communities, clubs, and creators are all welcome.",
    bg: "bg-teal-100",
  },
  {
    question: "Do you support online meetups?",
    answer:
      "Yes, you can host both in‑person and online meetups by adding links to your preferred video platform in the event details.",
   bg: "bg-red-200",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#FAFAFA] py-20 px-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center relative mb-8">
        <div className="absolute -left-32 top-0 hidden md:block">
          <Image
            src="/assets/faq-left.png"
            alt="FAQ Left Illustration"
            width={160}
            height={160}
            className="w-40 h-auto"
            priority
          />
        </div>
        <div className="absolute -right-32 top-0 hidden md:block">
          <Image
            src="/assets/faq-right.png"
            alt="FAQ Right Illustration"
            width={160}
            height={160}
            className="w-40 h-auto"
            priority
          />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
          Got UrbanMeet Questions?
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Find quick answers to your common questions.
        </p>
      </div>
      <div className="w-full max-w-4xl flex flex-col gap-6 z-10">
        {faqs.map((faq, idx) => (
          <div key={faq.question}>
            <button
              className="w-full flex items-center justify-between border border-black px-6 py-5 text-left text-xl font-semibold focus:outline-none transition bg-white hover:bg-gray-50"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-6 h-6 ml-4 transform transition-transform duration-200 ${
                  openIdx === idx ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIdx === idx && (
              <div
                className={`border-x border-b border-black px-6 py-5 text-lg ${faq.bg} animate-fadeIn`}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </section>
  );
}
