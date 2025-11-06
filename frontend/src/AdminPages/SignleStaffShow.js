import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaCalendarAlt, FaUserTag, FaBolt } from 'react-icons/fa';
import UseAxiosSecure from '../hook/UseAxiosSecure';

// Animation variants for the modal backdrop and container
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { y: "-100vh", opacity: 0, scale: 0.5 },
    visible: { 
        y: "0", 
        opacity: 1, 
        scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 15 } 
    },
    exit: { 
        y: "100vh", 
        opacity: 0, 
        scale: 0.5,
        transition: { ease: "easeInOut" }
    }
};

const SignleStaffShow = ({ isOpen, onClose, staffId }) => {
    const axiosSecure = UseAxiosSecure();

    // Fetch specific staff data when a staffId is provided
    const { data: staff, isLoading, isError } = useQuery({
        queryKey: ['staffDetail', staffId],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/getStaffById/${staffId}`);
            return data.staff;
        },
        enabled: !!staffId, // Only run the query if staffId is not null
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-lg bg-gray-900 border-2 border-red-500 rounded-lg shadow-lg shadow-red-500/30 text-gray-200 p-6"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <IoClose size={24} />
                        </button>

                        {/* Content */}
                        {isLoading ? (
                            <div className="text-center text-violet-400">Loading Staff Details...</div>
                        ) : isError ? (
                            <div className="text-center text-red-500">Failed to load staff details.</div>
                        ) : staff ? (
                            <div>
                                {/* Header */}
                                <div className="text-center mb-6">
                                    <img
                                        src={staff.profileImage || `https://ui-avatars.com/api/?name=${staff.name}&background=1f2937&color=ef4444&size=128`}
                                        alt={staff.name}
                                        className="w-32 h-32 rounded-full mx-auto border-4 border-violet-500 object-cover shadow-md shadow-violet-500/40"
                                    />
                                    <h2 className="text-3xl font-bold mt-4 text-white">{staff.name}</h2>
                                    <p className="text-lg text-red-400 capitalize font-semibold">{staff.role}</p>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <InfoItem icon={<FaEnvelope className="text-violet-400" />} label="Email" value={staff.email} />
                                    <InfoItem icon={<FaPhone className="text-violet-400" />} label="Phone" value={staff.phone} />
                                    <InfoItem icon={<FaBuilding className="text-violet-400" />} label="Department" value={staff.department || 'N/A'} />
                                    <InfoItem icon={<FaCalendarAlt className="text-violet-400" />} label="Hire Date" value={new Date(staff.hireDate).toLocaleDateString()} />
                                    <InfoItem icon={<FaBolt className="text-violet-400" />} label="Skill" value={staff.skill || 'N/A'} />
                                    <InfoItem icon={<FaUserTag className="text-violet-400" />} label="Status" value={staff.status} statusColor={staff.status === 'active' ? 'text-green-400' : 'text-gray-500'} />
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Helper component for displaying info items consistently
const InfoItem = ({ icon, label, value, statusColor }) => (
    <div className="flex items-center gap-3 bg-black bg-opacity-30 p-3 rounded-md">
        {icon}
        <div>
            <p className="text-gray-400">{label}</p>
            <p className={`font-semibold ${statusColor || 'text-white'}`}>{value}</p>
        </div>
    </div>
);


export default SignleStaffShow;