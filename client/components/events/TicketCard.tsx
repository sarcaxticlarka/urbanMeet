import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

interface TicketCardProps {
    price: string;
    type: string;
    imageSrc: string;
    colorTheme: 'green' | 'orange' | 'blue';
    date: string;
    time: string;
    location: string;
    eventId?: string;
    eventTitle?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ price, type, imageSrc, colorTheme, date, time, location, eventId, eventTitle }) => {
    const themeColors = {
        green: {
            bg: 'bg-[#1a4d3a]',
            accent: 'bg-[#a3e635]',
            text: 'text-[#a3e635]',
            button: 'bg-[#0033cc]',
            buttonText: 'text-white'
        },
        orange: {
            bg: 'bg-[#e6aa45]',
            accent: 'bg-[#ff7f50]', // Salmon/Orange for the right side
            text: 'text-[#0033cc]', // Blue text for title
            button: 'bg-[#0033cc]',
            buttonText: 'text-white'
        },
        blue: {
            bg: 'bg-[#0033cc]',
            accent: 'bg-[#1a4d3a]', // Dark green for right side
            text: 'text-[#ff99cc]', // Pinkish text
            button: 'bg-[#ff99cc]',
            buttonText: 'text-black'
        }
    };

    const theme = themeColors[colorTheme];

    // Custom clip-path or mask for ticket shape would be ideal, but using CSS for simplicity
    // We will simulate the ticket look with two divs and a "perforation" line or just rounded corners with pseudo elements

    return (
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto my-8 drop-shadow-xl relative">
            {/* Left Part (Main Content) */}
            <div className={`w-full md:w-2/3 ${theme.bg} p-4 md:p-6 relative md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none flex flex-col md:flex-row items-center gap-4`}>
                {/* Image Area */}
                <div className="w-full md:w-48 h-48 relative shrink-0 border-4 border-white bg-gray-200 overflow-hidden rounded-lg">
                    <Image
                      src={imageSrc}
                      alt={eventTitle ? `${eventTitle} poster` : 'Event image'}
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      className="object-cover"
                    />
                </div>

                {/* Barcode Strip (Decorative) - Hidden on mobile */}
                <div className={`hidden md:flex absolute left-[230px] top-0 bottom-0 w-12 flex-col justify-center items-center py-4 space-y-1 ${colorTheme === 'green' ? 'bg-[#a3e635]' : colorTheme === 'orange' ? 'bg-[#ff99cc]' : 'bg-[#ff7f50]'}`}>
                    {/* Fake Barcode Lines */}
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-8 h-1 bg-black mb-1"></div>
                    ))}
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-center text-white z-10 md:ml-16 md:pl-4 text-center md:text-left">
                    <h2 className={`text-xl md:text-3xl font-black uppercase leading-none mb-2 ${colorTheme === 'orange' ? 'text-[#0033cc]' : colorTheme === 'blue' ? 'text-[#ff99cc]' : 'text-[#a3e635]'}`}>
                        {eventTitle || 'Confera 2025 Global Summit, New York'}
                    </h2>
                    <div className="space-y-1 text-sm font-medium opacity-90">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FaCalendarAlt /> {date}
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FaClock /> {time}
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FaMapMarkerAlt /> {location}
                        </div>
                    </div>
                </div>

                {/* Right Circle Cutout - Hidden on mobile */}
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full z-20"></div>
                <div className="hidden md:block absolute right-0 top-0 bottom-0 border-r-2 border-dashed border-white/30"></div>
                
                {/* Bottom Circle Cutout - Mobile only */}
                <div className="md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full z-20"></div>
                <div className="md:hidden absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-white/30"></div>
            </div>

            {/* Right Part (Price & Action) */}
            <div className={`w-full md:w-1/3 ${theme.accent} p-6 relative md:rounded-r-2xl rounded-b-2xl md:rounded-bl-none flex flex-col justify-center items-center text-center`}>
                {/* Left Circle Cutout - Hidden on mobile */}
                <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full z-20"></div>
                
                {/* Top Circle Cutout - Mobile only */}
                <div className="md:hidden absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full z-20"></div>

                <div className={`text-6xl font-black mb-1 ${colorTheme === 'orange' ? 'text-white' : colorTheme === 'blue' ? 'text-white' : 'text-[#0a3d2e]'}`}>
                    {price}
                </div>
                <div className="text-xl font-bold uppercase mb-6 text-black tracking-tighter">
                    {type}
                </div>

                {eventId ? (
                  <Link href={`/events/${eventId}`} className={`${theme.button} ${theme.buttonText || 'text-white'} px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2`}>
                    View Details
                    <span>»</span>
                  </Link>
                ) : (
                  <button className={`${theme.button} ${theme.buttonText || 'text-white'} px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2`}>
                    Confirm Your Seat
                    <span>»</span>
                  </button>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
