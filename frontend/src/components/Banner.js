import React from 'react';
import banner from '../assets/banner.jpg'; 
import './Banner.css'; // Import the CSS file for animations and styles

const Banner = () => {
  return (
    <section 
      className="relative w-full h-screen bg-cover bg-center flex items-center overflow-hidden" // Added overflow-hidden for potential animation edges
      style={{ backgroundImage: `url(${banner})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Left side text content */}
        <div className="max-w-xl text-white md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide leading-tight">
            Forge Your Body,
            <br />
            <span className="text-red-500">Unleash Your Potential.</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Welcome to FitnessHub, where your journey to strength, health, and peak performance begins. Join a community dedicated to pushing limits.
          </p>
          <button className="mt-8 bg-red-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-red-700 transition-all duration-300 shadow-lg text-lg">
            Join a Class Today
          </button>
        </div>

        {/* Right side Animation Board */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-sm bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-red-500/30 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-red-500 mb-4 text-center">Your Live Fitness Stats</h3>
            
            {/* Heartbeat Animation Area */}
            <div className="relative h-20 w-full mb-6 flex items-center justify-center bg-gray-900 rounded-md overflow-hidden">
                <div className="heartbeat-line"></div>
                {/* Optional: Add a subtle pulse indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-light"></div>
                </div>
            </div>

            {/* Report Scores */}
            <div className="space-y-4 text-gray-200">
              <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="font-medium">Heart Rate:</span>
                <span className="text-red-400 text-xl font-bold">72 <span className="text-sm font-normal">bpm</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="font-medium">Calories Burned:</span>
                <span className="text-red-400 text-xl font-bold">350 <span className="text-sm font-normal">kcal</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Fitness Score:</span>
                <span className="text-red-400 text-xl font-bold">8.5 <span className="text-sm font-normal">/ 10</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;