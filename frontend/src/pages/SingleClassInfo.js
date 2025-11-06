import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import banner from '../assets/bannerA.png';
import { useQuery } from '@tanstack/react-query';
import UseAxiosPublic from '../hook/UseAxiosPublic';

import { FaClock, FaUsers, FaDollarSign, FaFire, FaTimes, FaUser, FaEnvelope, FaPhone, FaDumbbell, FaStar } from 'react-icons/fa';
import UseAuth from '../hook/UseAuth';

// ===============================================================
//  REDESIGNED: "Player Card" Trainer Modal
// ===============================================================
const TrainerModal = ({ trainer, onClose }) => {
    if (!trainer) return null;

    return (
        // Modal Overlay
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
        >
            {/* Modal Content */}
            <div
                onClick={(e) => e.stopPropagation()}
                // Increased width for the new layout
                className="bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl shadow-red-900/50 w-full max-w-4xl transform transition-all duration-300 scale-95 hover:scale-100 overflow-hidden"
            >
                {/* --- PLAYER CARD LAYOUT --- */}
                <div className="grid grid-cols-1 md:grid-cols-5">

                    {/* --- Left Column: Trainer Image --- */}
                    <div className="md:col-span-2">
                        <img
                            src={trainer.profileImage}
                            alt={trainer.name}
                            className="w-full h-64 md:h-full object-cover object-center"
                        />
                    </div>

                    {/* --- Right Column: Trainer Details --- */}
                    <div className="md:col-span-3 p-8 flex flex-col relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                            <FaTimes size={24} />
                        </button>

                        {/* Name & Title */}
                        <div className="mb-6">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-white">{trainer.name}</h2>
                            <p className="text-xl text-red-400">{trainer.department} Specialist</p>
                        </div>

                        {/* Bio */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold uppercase text-red-500 mb-2">Bio</h3>
                            <p className="text-gray-300 text-base">{trainer.description}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center mb-6">
                            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <FaStar className="mx-auto text-red-500 text-2xl mb-1" />
                                <span className="block font-bold text-lg">{trainer.experience} yrs</span>
                                <span className="text-xs text-gray-400">Experience</span>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <FaDumbbell className="mx-auto text-red-500 text-2xl mb-1" />
                                <span className="block font-bold text-lg capitalize">{trainer.skill}</span>
                                <span className="text-xs text-gray-400">Skill</span>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                                <FaUser className="mx-auto text-red-500 text-2xl mb-1" />
                                <span className="block font-bold text-lg">{trainer.age}</span>
                                <span className="text-xs text-gray-400">Age</span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-lg font-bold uppercase text-red-500 mb-2">Contact</h3>
                            <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md text-gray-300">
                                <FaEnvelope className="text-red-500 flex-shrink-0" />
                                <span>{trainer.email}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// ===============================================================
//  Main Page Component
// ===============================================================
const SingleClassInfo = () => {
    const { id } = useParams();
    const axiosPublic = UseAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = UseAuth();
    const navigate = useNavigate();
    const { data: classInfo, isLoading, isError, error } = useQuery({
        queryKey: ['classInfo', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/get-class/${id}`);
            return res.data.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-red-500">
                Error loading data.
            </div>
        );
    }



    const handleEnroll = () => {
        if (!user) {
            // not logged in
            navigate("/client-create");
            return;
        }

        if (user.role === "user") {
            // user but not client yet
            navigate("/client-create");
            return;
        }

        if (user.role === "client") {
            // already client, go directly to enrollment
            navigate(`/admin/enroll-class/${id}`); // later you’ll add this
            return;
        }

        alert("Only clients can enroll in classes.");
    };
    return (
        <>
            <div className="bg-gray-900 text-white min-h-screen font-sans">
                {/* ====== Banner Section ====== */}
                <header
                    className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
                    style={{ backgroundImage: `url(${banner})` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-widest" style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.7)' }}>
                            {classInfo?.name}
                        </h1>
                    </div>
                </header>

                {/* ====== Main Content Section ====== */}
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

                        {/* --- Left Column: Class Cover Image --- */}
                        <div className="lg:col-span-3">
                            <img
                                src={classInfo?.coverImage}
                                alt={`${classInfo?.name} class visual`}
                                className="w-full h-auto object-cover rounded-lg border-2 border-red-800 shadow-2xl shadow-red-900/40"
                            />
                        </div>

                        {/* --- Right Column: All Details --- */}
                        <div className="lg:col-span-2 flex flex-col space-y-8">

                            {/* Class Description */}
                            <div>
                                <h2 className="text-3xl font-bold border-b-2 border-red-500 pb-2 mb-4 uppercase flex items-center gap-3">
                                    <FaFire className="text-red-500" />
                                    Class Details
                                </h2>
                                <p className="text-gray-300 leading-relaxed text-base">
                                    {classInfo?.description}
                                </p>
                            </div>

                            {/* Class Stats Section */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 transition-transform hover:scale-105 hover:border-red-500">
                                    <FaClock className="mx-auto text-red-500 text-3xl mb-2" />
                                    <span className="block font-bold text-xl">{classInfo?.duration}</span>
                                    <span className="text-sm text-gray-400">Minutes</span>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 transition-transform hover:scale-105 hover:border-red-500">
                                    <FaUsers className="mx-auto text-red-500 text-3xl mb-2" />
                                    <span className="block font-bold text-xl">{classInfo?.capacity}</span>
                                    <span className="text-sm text-gray-400">Slots</span>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 transition-transform hover:scale-105 hover:border-red-500">
                                    <FaDollarSign className="mx-auto text-red-500 text-3xl mb-2" />
                                    <span className="block font-bold text-xl">${classInfo?.price}</span>
                                    <span className="text-sm text-gray-400">Price</span>
                                </div>
                            </div>

                            {/* Trainer Info Card (Clickable) */}
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-br from-gray-800 to-black p-5 rounded-lg border border-gray-700 flex items-center gap-5 cursor-pointer transition-transform hover:scale-105 hover:border-red-500"
                            >
                                <img
                                    src={classInfo?.trainer?.profileImage}
                                    alt={classInfo?.trainer?.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-red-500"
                                />
                                <div>
                                    <p className="text-gray-400 text-sm uppercase">Your Trainer</p>
                                    <h3 className="text-2xl font-bold text-white">{classInfo?.trainer?.name}</h3>
                                    <p className="text-red-400 text-md">{classInfo?.trainer?.department} Specialist</p>
                                </div>
                            </div>

                            {/* Enroll Button */}
                            <button
                                onClick={handleEnroll}
                                className="w-full mt-auto bg-red-600 text-white font-bold text-xl uppercase py-4 rounded-lg hover:bg-red-700 hover:scale-105 transition-all"
                            >
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && <TrainerModal trainer={classInfo?.trainer} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default SingleClassInfo;