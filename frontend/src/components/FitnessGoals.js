// src/components/FitnessGoals.js
import React from 'react';
import choose1 from '../assets/choose2.jpg'; // Ensure your image path is correct

const FitnessGoals = () => {
    return (
        <div className='relative bg-black text-gray-200 py-20 sm:py-28 overflow-hidden'>
            <div 
                className="absolute inset-0 z-0 opacity-10" 
                style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)',
                    backgroundSize: '3rem 3rem'
                }}
            ></div>

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

                    {/* ===== Left Column: Text Content (No Changes Here) ===== */}
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-cyan-400/20 shadow-2xl shadow-black/40">
                        <p className='font-mono text-sm uppercase text-cyan-400 tracking-[0.2em] mb-3'>
                          // PROTOCOL: EVOLUTION
                        </p>
                        <h2 
                            className='text-4xl sm:text-5xl font-bold text-white mb-6'
                            style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}
                        >
                            Deconstruct Your Limits
                        </h2>
                        <p className='text-lg text-gray-300 mb-8'>
                            Traditional training yields traditional results. We integrate biomechanics and data-driven protocols to engineer a superior version of you. This is the next frontier of physical potential.
                        </p>
                        <div className='space-y-4 font-mono text-gray-300'>
                            <p><span className='text-cyan-400'>[+]</span> Muscle Hypertrophy & Density</p>
                            <p><span className='text-cyan-400'>[+]</span> Metabolic Conditioning</p>
                            <p><span className='text-cyan-400'>[+]</span> Neuromuscular Efficiency</p>
                        </div>
                    </div>

                    {/* ===== Right Column: SVG Wrapper for a Foolproof Border ===== */}
                    <div className='flex items-center justify-center p-4'>
                        <div className="w-full h-auto max-w-md lg:max-w-none">
                            {/* The SVG acts as a container. It will scale to fit the div.
                                viewBox defines the coordinate system (e.g., 200 units wide, 150 high). */}
                            <svg viewBox="0 0 200 150" className="w-full h-full">
                                <defs>
                                    <clipPath id="image-shape">
                                        {/* The polygon shape using viewBox coordinates */}
                                        <polygon points="50 0, 200 0, 200 150, 50 150, 0 75" />
                                    </clipPath>
                                </defs>

                                {/* Step 1: Draw the image and apply the clip-path to it */}
                                <image 
                                    href={choose1} 
                                    width="200" 
                                    height="150" 
                                    clip-path="url(#image-shape)"
                                    preserveAspectRatio="xMidYMid slice" 
                                />

                                {/* Step 2: Draw the border on top of the image */}
                                <polygon 
                                    points="50 0, 200 0, 200 150, 50 150, 0 75"
                                    fill="none"
                                    stroke="#dc2626" // This is Tailwind's red-600
                                    strokeWidth="2"  // This controls the border thickness
                                />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FitnessGoals;