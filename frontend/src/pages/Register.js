import React from 'react';
import { useForm } from 'react-hook-form';
import bgImg from '../assets/RegisterForm.jpg';
import UseAxiosPublic from '../hook/UseAxiosPublic';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const axiosPublic = UseAxiosPublic();
    // const password = watch('password');

    const onSubmit = async (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        if (data.profileImage || data.profileImage[0]) {
            formData.append('profileImage', data.profileImage[0]);
        }
        try {
            const res = await axiosPublic.post('/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log(res.data.data);
            if (res.data?.success) {
                Swal.fire({
                    title: "Good job!",
                    text: "You have registered successfully",
                    icon: "success"
                });
            }
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center animate-bg-pan"
                style={{ backgroundImage: `url(${bgImg})` }}
            ></div>
            <div className="absolute inset-0 bg-black/70"></div>

            <div className="relative container mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">

                {/* Left Side: Registration Form */}
                <div className="w-full max-w-md">
                    <div className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl p-8">

                        {/* SVG for the animated border */}
                        <svg className="absolute -inset-px w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <rect
                                className="w-full h-full stroke-red-500 animate-glow-pulse"
                                fill="none"
                                strokeWidth="2"
                                rx="16"
                                ry="16"
                                pathLength="1"
                            />
                        </svg>

                        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
                            <h2 className="text-3xl font-bold text-white text-center mb-8">Create Your Account</h2>

                            {/* Floating Label Inputs (unchanged) */}
                            <div className="relative mb-6">
                                <input type="text" id="fullName" placeholder=" " {...register('name', { required: 'Full name is required' })} className="block px-3 py-3 w-full text-white bg-transparent rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer transition" />
                                <label htmlFor="fullName" className="absolute text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Full Name</label>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="relative mb-6">
                                <input type="email" id="email" placeholder=" " {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="block px-3 py-3 w-full text-white bg-transparent rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer transition" />
                                <label htmlFor="email" className="absolute text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Email Address</label>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="relative mb-6">
                                <input type="password" id="password" placeholder=" " {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Must be 6+ characters' } })} className="block px-3 py-3 w-full text-white bg-transparent rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer transition" />
                                <label htmlFor="password" className="absolute text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Password</label>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="relative mb-4">
                                <input type="file" id="profileImage" placeholder=" " {...register('profileImage')} className="block px-3 py-3 w-full text-white bg-transparent rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-500 peer transition" />
                                <label htmlFor="profileImage" className="absolute text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Profile Image</label>
                                {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>}
                            </div>
                            <p className='text-white mb-4'>Already have an account? <Link to="/login" className="text-red-500 hover:underline">Login</Link></p>

                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg">Register</button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Fitness Typography with Animated Heart */}
                <div className="text-white text-center lg:text-left relative">
                    <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider">
                        Forge Your <span className="text-red-500">Legacy.</span>

                        {/* The Animated 3D-ish Heart */}
                        <div className="absolute top-[-20px] right-[-20px] sm:right-[-40px] lg:right-[-60px] w-16 h-16 animate-heart-beat"
                            style={{
                                // Subtle glow when in dark
                                filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))',
                                transform: 'scale(1) rotate(-15deg)' // Slight rotation for character
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Bottom-left lobe with a dark gradient for depth */}
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="url(#heartGradientDark)" opacity="0.8" />
                                {/* Top-right lobe with a slightly brighter gradient for light source */}
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="url(#heartGradientLight)" opacity="0.9" style={{ transform: 'translateX(1px) translateY(-1px)' }} /> {/* Slight offset for 3D effect */}

                                {/* Main heart shape (middle layer for vibrance) */}
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="url(#heartGradientRed)" />

                                {/* SVG Gradient Definitions */}
                                <defs>
                                    {/* Darker gradient for shadow/depth */}
                                    <linearGradient id="heartGradientDark" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#880808" /> {/* Darker red */}
                                        <stop offset="100%" stopColor="#440404" /> {/* Even darker red */}
                                    </linearGradient>
                                    {/* Slightly lighter gradient for perceived light source */}
                                    <linearGradient id="heartGradientLight" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#ff4444" /> {/* Brighter red */}
                                        <stop offset="100%" stopColor="#cc2222" /> {/* Medium red */}
                                    </linearGradient>
                                    {/* Main vibrant red gradient */}
                                    <linearGradient id="heartGradientRed" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" /> {/* Tailwind red-500 */}
                                        <stop offset="100%" stopColor="#dc2626" /> {/* Tailwind red-600 */}
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">Don't just dream of a better body. Build it. Every rep, every set, every drop of sweat is a step towards the person you were born to be.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;