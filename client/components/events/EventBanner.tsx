import React from 'react';

const EventBanner = () => {
    return (
        <div className="w-full bg-[#ff7f50] py-16 px-4 relative overflow-hidden">
            {/* Grid Background for the container */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
            </div>

            <div className="max-w-5xl mx-auto relative">
                {/* Main Green Banner Box */}
                <div className="bg-[#1a4d3a] p-12 md:p-20 relative text-center rounded-sm">
                    {/* Scalloped Edge Effect (Simulated with radial gradients or clip-path) */}
                    {/* Using a simple border style for now, or we can try a CSS mask if supported. 
               Let's use a pseudo-element approach for the "stamp" look around the edges if possible, 
               or just a simple border with dots. 
           */}
                    <div className="absolute inset-0 border-[10px] border-[#ff7f50] border-dotted pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black text-[#a3e635] uppercase leading-tight mb-8 tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                            Early-Bird Registration<br />Ending Soon
                        </h2>

                        <button className="bg-[#ff99cc] text-black px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-transform hover:scale-105 flex items-center gap-2">
                            Confirm Your Seat
                            <span>»</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventBanner;
