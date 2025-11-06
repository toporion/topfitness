import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import logImg from '../assets/bg.jpg'; // YOUR IMPORTED IMAGE IS HERE
import UseAxiosPublic from '../hook/UseAxiosPublic';
import UseAuth from '../hook/UseAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// --- SVG Icons (No changes here) ---

const MailIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const EyeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274 4.057 5.064 7 9.542-7 .847 0 1.67.129 2.452.37M8.11 8.111A5.942 5.942 0 0112 7a5 5 0 015 5c0 .34-.04.67-.11.99M12 15a3 3 0 110-6 3 3 0 010 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
);


const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { loginUser } = UseAuth()
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const onSubmit = async (data) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const res = await loginUser(data.email, data.password);
        console.log('login info', res.user);

        if (res.success) {
            Swal.fire({
                title: "Good job!",
                text: "You have successfully logged in!",
                icon: "success",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
        }
    };


    return (
        <div
            className="min-h-screen w-full flex items-center justify-end bg-gray-900 p-4 pr-4 sm:pr-12 lg:pr-24 overflow-hidden"
            style={{
                backgroundImage: `url(${logImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Form Container with animations and decorative elements */}
            <div className={`relative w-full max-w-md p-8 space-y-8 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1/4'}`}>
                {/* Decorative corner brackets */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl transition-all duration-500 animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-fuchsia-500/50 rounded-br-xl transition-all duration-500 animate-pulse"></div>

                {/* Header with animated gradient typography */}
                <div className={`text-center transition-all duration-700 ease-out delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500 animate-[shine_5s_linear_infinite]" style={{ backgroundSize: '200% auto' }}>
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-300">Sign in to unleash your potential.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Input */}
                    <div className={`transition-all duration-700 ease-out delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="relative group">
                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                                className={`w-full pl-10 pr-4 py-3 bg-white/5 text-white border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 group-hover:border-white/40`}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-2 absolute">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className={`transition-all duration-700 ease-out delay-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="relative group">
                            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", { required: "Password is required" })}
                                className={`w-full pl-10 pr-10 py-3 bg-white/5 text-white border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 group-hover:border-white/40`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-2 absolute">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button with animated gradient */}
                    <div className={`pt-4 transition-all duration-700 ease-out delay-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-black rounded-lg shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-l"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                {/* Sign Up Link */}
                <div className={`text-center transition-all duration-700 ease-out delay-[900ms] ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-sm text-gray-400">
                        Not a member?{' '}
                        <a href="/register" className=" font-bold text-red-800 hover:text-cyan-300 hover:underline underline-offset-2">
                            Start your journey
                        </a>
                    </p>
                </div>
            </div>
            {/* We need to define the animation keyframes for the shining text effect. 
                This can be done in your global CSS file (e.g., index.css) by adding:
                @keyframes shine {
                  to {
                    background-position: 200% center;
                  }
                }
            */}
        </div>
    );
};

export default Login;

