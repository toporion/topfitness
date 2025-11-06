// src/components/NewsAndUpdate.js
import React from 'react';

// --- MOCK DATA (Ready for your API) ---
const postsData = [
    {
        id: 1, title: "The Science of Hypertrophy: Unlocking Muscle Growth", category: "Training Science", date: "October 03, 2025", image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?&auto=format&fit=crop&w=800&q=60',
    },
    {
        id: 2, title: "Mental Fortitude: Training the Mind for Performance", category: "Mindset", date: "September 28, 2025", image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?&auto=format&fit=crop&w=800&q=60',
    },
    {
        id: 3, title: "The 2026 Fueling Protocol Revealed", category: "Nutrition", date: "September 15, 2025", image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?&auto=format&fit=crop&w=800&q=60',
    },
];

const categoriesData = ["Training Science", "Mindset", "Nutrition", "Community", "Recovery"];

const recentPostsData = [
    { id: 1, title: "The Science of Hypertrophy", image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?&auto=format&fit=crop&w=100&q=60' },
    { id: 2, title: "Mental Fortitude", image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?&auto=format&fit=crop&w=100&q=60' },
    { id: 3, title: "The 2026 Fueling Protocol", image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?&auto=format&fit=crop&w=100&q=60' },
    { id: 4, title: "Community Spotlight", image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?&auto=format&fit=crop&w=100&q=60' },
];

const NewsAndUpdate = () => {
    return (
        <div className='bg-black text-white py-20 sm:py-28'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* --- Header --- */}
                <div className='text-center mb-16'>
                    <h2 className='text-4xl lg:text-5xl font-extrabold'>
                        FitnessHub <span className='text-red-500'>Command Center</span>
                    </h2>
                    <p className='text-lg text-gray-400 mt-4 max-w-2xl mx-auto'>
                        Your central hub for the latest intel, training protocols, and community updates.
                    </p>
                </div>

                {/* --- Main Two-Column Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* --- Left Column: Post Cards --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {postsData.map(post => (
                            <a href="#" key={post.id} className="group block bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-red-500 transition-colors duration-300">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden rounded-lg">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="w-full md:w-2/3 flex flex-col justify-center">
                                        <p className="text-sm text-red-500 font-semibold">{post.category}</p>
                                        <h3 className="text-2xl font-bold text-white mt-2 mb-3">{post.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{post.date}</p>
                                        <span className="font-semibold text-cyan-400 mt-auto group-hover:text-white transition-colors duration-300">
                                            Read Transmission →
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                        {/* Load More Button */}
                        <div className="text-center pt-8">
                            <button className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600 transition-colors duration-300">
                                Load More Posts
                            </button>
                        </div>
                    </div>

                    {/* --- Right Column: Sidebar --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-gray-800 sticky top-28">
                            {/* Categories */}
                            <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {categoriesData.map(category => (
                                    <button key={category} className="bg-gray-800/50 text-gray-300 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-600/50 hover:text-white transition-colors duration-200">
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Divider */}
                            <hr className="border-t-2 border-gray-800 mb-8" />
                            
                            {/* Recent Posts with "Cool" Hover Effect */}
                            <h3 className="text-xl font-bold text-white mb-4">Recent Intel</h3>
                            <ul className="space-y-4">
                                {recentPostsData.map(post => (
                                    <li key={post.id}>
                                        <a href="#" className="group flex items-center gap-4">
                                            <p className="flex-grow text-gray-300 group-hover:text-red-400 transition-colors duration-200">{post.title}</p>
                                            {/* Hidden thumbnail that appears on hover */}
                                            <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsAndUpdate;