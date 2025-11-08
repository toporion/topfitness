import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure'; // ⚠️ !! Update this path if needed !!
import { useQuery } from '@tanstack/react-query';
import { Clock, DollarSign, Users, Search, AlertTriangle, X } from 'lucide-react';

/**
 * A single, visually-rich card for the grid.
 * Now it also shows if it's "selected".
 */
const ClassGridCard = ({ cls, onSelect, isSelected }) => (
    <div
        onClick={() => onSelect(cls)}
        className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 ease-in-out border bg-zinc-800 ${
            isSelected ? 'border-red-600 ring-2 ring-red-600' : 'border-zinc-700'
        }`}
    >
        <div className="relative h-48 w-full">
            <img 
                src={cls.coverImage || `https://placehold.co/400x300/18181B/9CA3AF?text=No+Image`} 
                alt={cls.name}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{cls.name}</h3>
        </div>
        <div className="p-4 bg-zinc-800">
            <div className="flex justify-between items-center text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-red-500" /> {cls.duration} min
                </span>
                <span className="flex items-center gap-1.5">
                    <DollarSign size={14} className="text-red-500" /> ${cls.price}
                </span>
                <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-red-500" /> {cls.capacity}
                </span>
            </div>
        </div>
    </div>
);

/**
 * The Detail Panel that shows on the right side.
 */
const ClassDetailPanel = ({ cls, onClose }) => (
    <div className="w-full h-full bg-zinc-900 shadow-2xl overflow-y-auto relative">
        {/* Close Button (for mobile) */}
        <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition z-50 lg:hidden"
        >
            <X size={24} />
        </button>

        {/* Content */}
        <div>
            {/* Cover Image */}
            <div className="relative w-full h-64">
                <img 
                    src={cls.coverImage || 'https://placehold.co/600x400/18181B/9CA3AF?text=No+Image'} 
                    alt={cls.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white">
                    {cls.name}
                </h1>
            </div>

            {/* Stats Section */}
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    <StatCard 
                        icon={<DollarSign className="w-6 h-6 text-red-500" />} 
                        title="Price" 
                        value={`$${cls.price}`} 
                    />
                    <StatCard 
                        icon={<Clock className="w-6 h-6 text-red-500" />} 
                        title="Duration" 
                        value={`${cls.duration} min`} 
                    />
                    <StatCard 
                        icon={<Users className="w-6 h-6 text-red-500" />} 
                        title="Capacity" 
                        value={`${cls.capacity} clients`} 
                    />
                </div>

                {/* Description */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Description</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        {cls.description || "No description provided."}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

/**
 * A reusable stat card (for the detail panel).
 */
const StatCard = ({ icon, title, value }) => (
    <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 rounded-lg bg-zinc-900">
            {icon}
        </div>
        <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

/**
 * Loading Skeleton for the grid cards
 */
const CardSkeleton = () => (
    <div className="rounded-xl overflow-hidden shadow-lg bg-zinc-800 animate-pulse">
        <div className="h-48 w-full bg-zinc-700"></div>
        <div className="p-4">
            <div className="h-5 w-3/4 bg-zinc-700 rounded"></div>
            <div className="flex justify-between mt-4">
                <div className="h-4 w-1/4 bg-zinc-700 rounded"></div>
                <div className="h-4 w-1/4 bg-zinc-700 rounded"></div>
                <div className="h-4 w-1/4 bg-zinc-700 rounded"></div>
            </div>
        </div>
    </div>
);

/**
 * The main component
 */
const TrainerClasses = () => {
    const axiosSecure = UseAxiosSecure();
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Fetch all of the trainer's classes
    const { data: classes = [], isLoading, error } = useQuery({
        queryKey: ['trainer-classes'],
        queryFn: async () => {
            const res = await axiosSecure.get('/trainer/classes');
            return res.data.data; 
        }
    });

    // 2. Set default selected class on load
    useEffect(() => {
        if (!selectedClass && classes.length > 0) {
            setSelectedClass(classes[0]);
        }
    }, [classes, selectedClass]);

    // 3. Filter classes locally based on search
    const filteredClasses = classes.filter(cls => 
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        // This outer flex sets up the 2-column layout
        // It assumes your dashboard has a TopBar of ~80px (h-screen - 80px)
        <div className="flex h-[calc(100vh-80px)] bg-zinc-900 text-white z-30">
            
            {/* --- Main Content Area (Left, Scrollable Grid) --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header and Search */}
                <div className="p-6 sm:p-8 border-b border-zinc-700">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">My Class Library</h1>
                        <div className="relative w-full md:w-1/2 lg:w-1/3">
                            <input
                                type="text"
                                placeholder="Search my classes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-red-400">
                        <AlertTriangle className="w-12 h-12" />
                        <h2 className="mt-4 text-2xl font-bold">Error Loading Classes</h2>
                        <p>Something went wrong. Please try again later.</p>
                    </div>
                )}

                {/* Grid of Classes (This part scrolls) */}
                <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {isLoading && (
                            <>
                                <CardSkeleton />
                                <CardSkeleton />
                                <CardSkeleton />
                            </>
                        )}
                        
                        {!isLoading && filteredClasses.length === 0 && (
                            <div className="md:col-span-2 xl:col-span-3 text-center py-10">
                                <h2 className="text-2xl font-semibold text-zinc-400">
                                    {searchTerm ? "No classes found" : "No classes created"}
                                </h2>
                                <p className="text-zinc-500 mt-2">
                                    {searchTerm 
                                        ? "No classes match your search term." 
                                        : "Click 'Add Class' to create your first one."}
                                </p>
                            </div>
                        )}
                        
                        {filteredClasses.map((cls) => (
                            <ClassGridCard 
                                key={cls._id} 
                                cls={cls} 
                                onSelect={setSelectedClass}
                                isSelected={selectedClass?._id === cls._id}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Detail Column (Right, Fixed Panel) --- */}
            {/* This is the new column you asked for. */}
            <div className={`
                fixed top-0 right-0 z-30 h-full w-full max-w-lg bg-zinc-900 border-l border-zinc-700 transition-transform duration-300 ease-in-out
                ${selectedClass ? 'translate-x-0' : 'translate-x-full'}
                lg:translate-x-0 lg:static lg:w-1/3 lg:max-w-md xl:w-2/5 xl:max-w-lg
            `}>
                {selectedClass ? (
                    <ClassDetailPanel cls={selectedClass} onClose={() => setSelectedClass(null)} />
                ) : (
                    // Placeholder for when no class is selected (on large screens)
                    <div className="hidden lg:flex items-center justify-center h-full">
                        <p className="text-zinc-500">Select a class to see details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerClasses;