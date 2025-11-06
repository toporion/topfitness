// src/components/WhyChoose.js
import React from 'react';
import choose1 from '../assets/whyChoose1.jpg'; // Ensure your image path is correct

// We'll define the core features here for cleaner code
const features = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-9h3M3 12h3m12 0h3M9 9l2-2 2 2m-4 6l2 2 2-2" />
            </svg>
        ),
        title: 'Data-Driven Results',
        description: 'We utilize advanced tracking and analytics to create personalized protocols that guarantee progress.'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: 'Elite Coaching',
        description: 'Our certified trainers are industry leaders dedicated to your success, providing expert guidance and motivation.'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'Peak Performance',
        description: 'Go beyond traditional fitness with programs designed to optimize your strength, endurance, and mental focus.'
    }
];

const WhyChoose = () => {
    return (
        <div className='relative bg-black text-white py-20 sm:py-28 overflow-hidden'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Main grid with a 2/3 : 1/3 split on large screens */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center'>
                    
                    {/* ===== Left Side (2/3 width): The "Beautifully Decorated" Text ===== */}
                    <div className='lg:col-span-2'>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-800 shadow-2xl shadow-black/40">
                            {/* Header Text */}
                            <h2 
                                className='text-4xl lg:text-5xl font-extrabold mb-4'
                                style={{ textShadow: '0 0 15px rgba(220, 38, 38, 0.5)' }} // Subtle red glow
                            >
                                Why Choose <span className='text-red-500'>FitnessHub</span>
                            </h2>
                            <p className='text-lg text-gray-400 mb-10'>
                                We are engineered to help you achieve your peak physical and mental potential.
                            </p>
                            
                            {/* Divider */}
                            <hr className="border-t-2 border-red-500/30 mb-10" />

                            {/* Features Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                                {features.map((feature, index) => (
                                    <div key={index} className='flex flex-col items-center md:items-start text-center md:text-left'>
                                        <div className="bg-cyan-400/10 p-3 rounded-lg mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className='text-xl font-bold text-white mb-2'>{feature.title}</h3>
                                        <p className='text-gray-400 text-sm'>{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== Right Side (1/3 width): The Stylized Image ===== */}
                    <div className='flex items-center justify-center'>
                        <div className="w-full h-auto max-w-sm">
                            <svg viewBox="0 0 200 250" className="w-full h-full">
                                <defs>
                                    {/* A new, taller geometric shape */}
                                    <clipPath id="why-choose-shape">
                                        <polygon points="0 0, 200 25, 200 250, 0 225" />
                                    </clipPath>
                                </defs>
                                <image 
                                    href={choose1} 
                                    width="200" 
                                    height="250" 
                                    clip-path="url(#why-choose-shape)"
                                    preserveAspectRatio="xMidYMid slice" 
                                />
                                <polygon 
                                    points="0 0, 200 25, 200 250, 0 225"
                                    fill="none"
                                    stroke="#dc2626" // red-600
                                    strokeWidth="3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChoose;