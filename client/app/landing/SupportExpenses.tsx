// "use client";

// const cards = [
//   {
//     title: "24/7 Chat & Email",
//     desc: "Instant, around-the-clock responses to customer.",
//     bg: "bg-pink-300",
//     icon: (
//       <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000"/><path d="M12 8v4l2 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
//     ),
//   },
//   {
//     title: "FAQ Handling",
//     desc: "Resolves common questions without human intervention.",
//     bg: "bg-purple-200",
//     icon: (
//       <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">?</text></svg>
//     ),
//   },
//   {
//     title: "Omnichannel Support",
//     desc: "Manage chats, emails, and from a single dashboard.",
//     bg: "bg-teal-200",
//     icon: (
//       <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="#000"/><rect x="10" y="10" width="4" height="4" rx="1" fill="#fff"/></svg>
//     ),
//   },
//   {
//     title: "Agent Productivity",
//     desc: "Boosted productivity and frees up your team.",
//     bg: "bg-yellow-300",
//     icon: (
//       <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000"/><path d="M12 8a2 2 0 110 4 2 2 0 010-4zm0 8c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" fill="#fff"/><circle cx="17" cy="7" r="2" fill="#fff"/><path d="M17 9v1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
//     ),
//   },
// ];

// export default function SupportExpenses() {
//   return (
//     <section className="w-full bg-[#FAFAFA] py-16 flex flex-col items-center justify-center">
//       <div className="max-w-7xl w-full px-4 flex flex-col md:flex-row md:items-start md:justify-between">
//         <div className="mb-8 md:mb-0">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
//             Slash Support<br />Expenses
//           </h2>
//         </div>
//         <div className="md:w-1/2 text-gray-600 text-lg md:text-base md:pl-8">
//           Manage all conversations across chat, and more anytime, anywhere.
//         </div>
//       </div>
//       <div className="max-w-7xl w-full px-4 mt-8 flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch">
//         {cards.map((card, idx) => (
//           <div
//             key={card.title}
//             className={`${card.bg} border border-gray-700 rounded-none p-8 w-full md:w-64 flex flex-col justify-between`}
//           >
//             <div className="flex items-center mb-4">
//               <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
//                 {card.icon}
//               </span>
//               <span className="text-xl font-semibold">{card.title}</span>
//             </div>
//             <div className="text-gray-700 text-base">{card.desc}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

const cards = [
  {
    title: "Discover Meetups",
    desc: "Find events around your interests, from tech talks to study groups and weekend hangouts.",
    bg: "bg-pink-300",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke="#111827" strokeWidth="2" />
        <path d="M16 16l4 4" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Join in Seconds",
    desc: "RSVP with one click and keep track of everything you’re attending in one place.",
    bg: "bg-violet-200",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#111827" />
        <path
          d="M8 12.5l2.5 2L16 9"
          stroke="#F9FAFB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Host Your Own",
    desc: "Create groups and publish events with dates, locations, and capacity in minutes.",
    bg: "bg-teal-200",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="14" rx="2" fill="#111827" />
        <path
          d="M8 4v4M16 4v4"
          stroke="#F9FAFB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="8" y="11" width="3" height="3" rx="0.5" fill="#F9FAFB" />
        <rect x="13" y="11" width="3" height="3" rx="0.5" fill="#F9FAFB" />
      </svg>
    ),
  },
  {
    title: "Grow Your Community",
    desc: "See who keeps coming back, stay in touch with members, and build a loyal community.",
    bg: "bg-yellow-200",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="10" r="3" fill="#111827" />
        <circle cx="17" cy="10" r="3" fill="#111827" />
        <path
          d="M4 18c.7-2 2.4-3.5 5-3.5s4.3 1.5 5 3.5"
          stroke="#111827"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 18c.7-2 2.4-3.5 5-3.5 1.4 0 2.5.4 3.3 1"
          stroke="#111827"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function SupportExpenses() {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full px-4 flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="mb-8 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Make Meetups
            <br />
            Simple
          </h2>
        </div>
        <div className="md:w-1/2 text-gray-600 text-lg md:text-base md:pl-8">
          Discover events, join in seconds, and manage everything about your meetup life from one place.
        </div>
      </div>
      <div className="max-w-7xl w-full px-4 mt-8 flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} border border-gray-200 rounded-xl p-8 w-full md:w-64 flex flex-col justify-between shadow-sm`}
          >
            <div className="flex items-center mb-4">
              <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 shadow">
                {card.icon}
              </span>
              <span className="text-xl font-semibold text-slate-900">
                {card.title}
              </span>
            </div>
            <div className="text-slate-700 text-base">{card.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <a href="/events" className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition">See All Events</a>
        <a href="/groups" className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold border border-gray-300 hover:bg-gray-50 transition">See All Groups</a>
      </div>
    </section>
  );
}
