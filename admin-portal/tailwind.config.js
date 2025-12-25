/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-bg': {
                    primary: '#0f172a',
                    secondary: '#1e293b',
                    tertiary: '#334155',
                },
                'accent': {
                    blue: '#3b82f6',
                    purple: '#a855f7',
                    pink: '#ec4899',
                    green: '#10b981',
                    orange: '#f97316',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
