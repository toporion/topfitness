// src/components/MemberShipPlan.js
import React, { useState } from 'react';
import bgImg from '../assets/logImage.png'; // Make sure this path is correct

const plans = [
    {
        name: 'Initiate',
        tagline: 'For the dedicated starter',
        price: { monthly: 29, annual: 290 },
        features: [
            'Full access to all gym equipment',
            'Standard workout protocols',
            'Community forum access',
            'Locker room access'
        ],
        isFeatured: false,
    },
    {
        name: 'Operator',
        tagline: 'The perfect balance of guidance & access',
        price: { monthly: 49, annual: 490 },
        features: [
            'Everything in Initiate',
            'Personalized training program',
            'Monthly progress review call',
            'Nutritional guidance macros'
        ],
        isFeatured: true,
    },
    {
        name: 'Vanguard',
        tagline: 'For the elite performer who demands the best',
        price: { monthly: 79, annual: 790 },
        features: [
            'Everything in Operator',
            'Weekly 1-on-1 coaching session',
            'Advanced biometric tracking',
            'Priority class booking'
        ],
        isFeatured: false,
    }
];

const MemberShipPlan = () => {
    // State for the selected plan, default to the featured one (index 1)
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
    // State for the annual toggle
    const [isAnnual, setIsAnnual] = useState(false);

    const selectedPlan = plans[selectedPlanIndex];

    return (
        <div className='bg-black text-white py-20 sm:py-28'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-16'>
                    <h2
                        className='text-4xl sm:text-5xl font-extrabold mb-4'
                        style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
                    >
                        Access Your Protocol
                    </h2>
                    <p className='text-lg text-gray-400 max-w-2xl mx-auto'>
                        Choose the protocol that aligns with your mission. All plans are designed for peak performance and tangible results.
                    </p>
                </div>

                {/* ===== NEW INTERACTIVE LAYOUT ===== */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                    {/* --- Left Column: Plan Selectors --- */}
                    <div className='flex flex-col gap-4'>
                        {plans.map((plan, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedPlanIndex(index)}
                                className={`relative text-left p-6 rounded-xl border-2 transition-all duration-300
                                            ${selectedPlanIndex === index ? 'border-red-500 bg-red-500/10' : 'border-gray-800 bg-white/5 hover:bg-gray-800/50'}`}
                            >
                                {plan.isFeatured && (
                                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">Best Value</span>
                                )}
                                <h3 className='text-2xl font-bold'>{plan.name}</h3>
                                <p className='text-gray-400 mt-1'>Starts at ${plan.price.monthly}/mo</p>
                            </button>
                        ))}
                    </div>

                    {/* --- Right Column: Dynamic Details Panel with BG Image --- */}
                    <div className='lg:col-span-2 relative rounded-2xl overflow-hidden border border-gray-800'>
                        {/* Background Image with blur */}
                        <img
                            src={bgImg}
                            alt="Background for membership plan"
                            className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105" // Added blur and scale to cover edges
                        />
                        {/* Dark overlay for readability */}
                        <div className="absolute inset-0 bg-black/70"></div> {/* Increased opacity for better contrast */}

                        {/* Content inside the panel */}
                        <div className='relative p-8 lg:p-12'> {/* Content is now relative to the parent with image */}
                            <div key={selectedPlanIndex} className="animate-fadeIn">
                                {/* Monthly/Annual Toggle - Redesigned for clarity */}
                                <div className='flex justify-between items-center mb-8'>
                                    <h3 className='text-3xl font-bold'>{selectedPlan.name}</h3>
                                    <div className='flex items-center gap-4'>
                                        <span className={`font-medium ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                                        <button
                                            onClick={() => setIsAnnual(!isAnnual)}
                                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-800"
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className={`font-medium ${isAnnual ? 'text-white' : 'text-gray-500'}`}>Annual</span>
                                    </div>
                                </div>

                                <p className='text-gray-400 mb-6 h-12'>{selectedPlan.tagline}</p>

                                {/* Price section with animation */}
                                <div key={`${selectedPlanIndex}-${isAnnual}`} className="flex items-end gap-2 mb-8 animate-fadeIn">
                                    <span className='text-6xl font-extrabold'>${isAnnual ? Math.round(selectedPlan.price.annual / 12) : selectedPlan.price.monthly}</span>
                                    <span className='text-2xl text-gray-400 mb-1'>/mo</span>
                                    {isAnnual && (
                                        <span className="animate-fadeIn bg-cyan-400/20 text-cyan-300 text-sm font-semibold px-3 py-1 rounded-full mb-2">You Save ${selectedPlan.price.monthly * 12 - selectedPlan.price.annual}!</span>
                                    )}
                                </div>

                                <hr className="border-t-2 border-red-500/30 mb-8" />

                                <ul className='space-y-4 mb-10'>
                                    {selectedPlan.features.map((feature, i) => (
                                        <li key={i} className='flex items-center gap-3'>
                                            <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className='w-full font-bold py-4 px-6 rounded-lg text-lg bg-red-600 hover:bg-red-700 transition-all duration-300'>
                                    Select Protocol
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberShipPlan;