// src/components/ProgramsOffer.js
import React, { useState } from 'react';
import UseAxiosPublic from '../hook/UseAxiosPublic';
import { useQuery } from '@tanstack/react-query';


const ProgramsOffer = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const axiosPublic = UseAxiosPublic();

    const { data: programApiResponse, isLoading, isError } = useQuery({
        queryKey: ['programs'],
        queryFn: async () => {
            const { data } = await axiosPublic.get('/get-classes');
            // 'data' here is the object { success: true, data: [...] }
            return data;
        }
    });

    // Handle loading state
    if (isLoading) {
        return <div className='bg-black text-white text-center py-40'>Loading Programs...</div>;
    }

    // Handle error state
    if (isError) {
        return <div className='bg-black text-white text-center py-40'>Error loading programs. Please try again.</div>;
    }

    // Extract the actual array of programs from the API response object
    // and limit to 6 items for the design.
    const programdata = programApiResponse?.data?.slice(0, 6) || [];

    // Handle case where there are no programs
    if (programdata.length === 0) {
        return <div className='bg-black text-white text-center py-40'>No programs available at this time.</div>;
    }

    // This now safely gets the active program from the fetched data
    const activeProgram = programdata[activeIndex];

    return (
        <div className='bg-black text-white py-20 sm:py-28'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header (no changes here) */}
                <div className='flex flex-col md:flex-row justify-between items-center gap-8 mb-16'>
                    <div className='md:w-1/2 text-center md:text-left'>
                        <h2 className='text-4xl lg:text-5xl font-extrabold leading-tight'>
                            Find Your <span className='text-red-500'>Focus</span>
                        </h2>
                    </div>
                    <div className='md:w-1/2 text-center md:text-left'>
                        <p className='text-lg text-gray-400'>
                            Hover over a discipline to see it in action. Each program is crafted to deliver results and push your limits in a focused, supportive environment.
                        </p>
                    </div>
                </div>

                {/* Focus Selector Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 min-h-[600px]'>
                    {/* --- Left Column: Navigation List --- */}
                    <div className='flex flex-col justify-center'>
                        <ul className='space-y-2'>
                            {programdata.map((program, index) => (
                                <li key={program._id || index}>
                                    <button
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`w-full text-left p-4 rounded-lg transition-all duration-300
                                            ${activeIndex === index
                                                ? 'bg-red-600/20 text-white text-3xl font-bold'
                                                : 'text-gray-500 text-2xl font-medium hover:bg-gray-800/50 hover:text-white'}`}
                                    >
                                        <span className={`transition-opacity duration-300 ${activeIndex === index ? 'opacity-100' : 'opacity-50'}`}>
                                            0{index + 1}
                                        </span>
                                        {/* Use 'name' from API */}
                                        <span className="ml-4">{program.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- Right Column: Image Showcase --- */}
                    <div className='lg:col-span-2 relative w-full h-[400px] lg:h-full rounded-2xl overflow-hidden'>
                        {programdata.map((program, index) => (
                            <img
                                key={program._id || index}
                                // Use 'coverImage' and 'name' from API
                                src={program.coverImage}
                                alt={program.name}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out
                                            ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Details of the ACTIVE program */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12">
                            <div key={activeIndex} className="animate-fadeIn">
                                <h3 className='text-4xl lg:text-5xl font-bold text-white mb-3'>
                                    {/* Use 'name' from API */}
                                    {activeProgram.name}
                                </h3>
                                <p className='text-lg text-gray-300 max-w-lg mb-6'>
                                    {/* Use 'description' from API */}
                                    {activeProgram.description}
                                </p>
                                <a href={`/singleClassInfo/${activeProgram._id}`} alt="Learn More" className="bg-red-600 text-white font-bold py-3 px-6 rounded-md w-fit">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramsOffer;