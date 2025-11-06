/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'flow-line': {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
        'glow-pulse': {
          '50%': { filter: 'drop-shadow(0 0 6px #ef4444)', opacity: '0.8' },
        },
        'bg-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'heart-beat': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '25%': { transform: 'scale(1.1)', opacity: '1', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' },
          '50%': { transform: 'scale(1)', opacity: '0.7' },
          '75%': { transform: 'scale(1.1)', opacity: '1', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' },
          '100%': { transform: 'scale(1)', opacity: '0.7' },
        },
        // --- This is the fadeIn animation you requested ---
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'flow-line': 'flow-line 4s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'bg-pan': 'bg-pan 15s ease-in-out infinite',
        'heart-beat': 'heart-beat 2s ease-in-out infinite',
        // --- This adds the 'animate-fadeIn' utility class ---
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [require("daisyui")],
}