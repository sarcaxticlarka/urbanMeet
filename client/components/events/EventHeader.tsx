import React from 'react';

const EventHeader = () => {
    return (
        <div className="relative w-full h-64 md:h-80 bg-[#0a3d2e] flex flex-col items-center justify-center overflow-hidden">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            <div className="relative z-10 text-center">
                <h1 className="text-7xl md:text-9xl font-black text-[#a3e635] tracking-tighter uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                    TICKET
                </h1>
                <p className="text-white text-xl md:text-2xl mt-4 font-medium tracking-wide">
                    Choose Your Pass and Enjoy
                </p>
            </div>
        </div>
    );
};

export default EventHeader;
