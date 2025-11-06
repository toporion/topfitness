// src/components/Footer.js
import React from 'react';

// SVG Icons for social media for a clean, consistent look
const socialLinks = [
    { href: '#', icon: <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.26C11.73,8.6 11.77,8.92 11.84,9.22C8.28,9.03 5.15,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16.03 6.02,17.25 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"></path></svg> },
    { href: '#', icon: <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85C2.253 3.854 3.726 2.31 6.974 2.163 8.24 2.11 8.618 2.098 12 2.098l.002.006zm0 2.755c-3.149 0-3.52.012-4.745.068-2.695.123-3.803 1.23-3.926 3.926-.056 1.225-.068 1.595-.068 4.745s.012 3.52.068 4.745c.123 2.695 1.23 3.803 3.926 3.926 1.225.056 1.595.068 4.745.068s3.52-.012 4.745-.068c2.695-.123 3.803-1.23 3.926-3.926.056-1.225.068-1.595.068-4.745s-.012-3.52-.068-4.745c-.123-2.695-1.23-3.803-3.926-3.926-1.225-.056-1.595-.068-4.745-.068zm0 4.41c-2.323 0-4.202 1.88-4.202 4.202s1.88 4.202 4.202 4.202 4.202-1.88 4.202-4.202-1.879-4.202-4.202-4.202zm0 6.948c-1.517 0-2.747-1.23-2.747-2.747s1.23-2.747 2.747-2.747 2.747 1.23 2.747 2.747-1.23 2.747-2.747 2.747zm5.09-8.423c-.742 0-1.343.602-1.343 1.343s.602 1.343 1.343 1.343 1.343-.602 1.343-1.343-.602-1.343-1.343-1.343z"></path></svg> },
    { href: '#', icon: <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.823v-7l6 3.5-6 3.5z"></path></svg> }
];

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-400">
            {/* Glowing Top Border */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

            {/* Main content area - REMOVED max-w-7xl and mx-auto for full-width content */}
            <div className="px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Column 1: Branding & Socials */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <a href="#" className="text-3xl font-extrabold text-white">
                            Fitness<span className="text-red-500">Hub</span>
                        </a>
                        <p className="mt-4 text-sm">
                            Engineered for peak performance. We provide the tools, protocols, and support to help you deconstruct your limits.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            {socialLinks.map((link, index) => (
                                <a key={index} href={link.href} className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Protocols */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Protocols</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Power Training</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Yoga & Mind</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Cycling Class</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Core Strength</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Intel */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Intel</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Why Choose Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">News & Updates</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter CTA */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Join the Roster</h3>
                        <p className="mt-4 text-sm">Get exclusive training tips, nutrition protocols, and updates directly in your inbox.</p>
                        <form className="mt-4 flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button
                                type="submit"
                                className="bg-red-600 text-white font-bold px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 flex-shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Sub-Footer */}
            <div className="border-t border-gray-800">
                {/* REMOVED max-w-7xl and mx-auto here as well */}
                <div className="px-4 sm:px-6 lg:px-8 py-6 text-center md:flex md:justify-between">
                    <p>&copy; {new Date().getFullYear()} FitnessHub. All Rights Reserved.</p>
                    <div className="flex justify-center space-x-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;