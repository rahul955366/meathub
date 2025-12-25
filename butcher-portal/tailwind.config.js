/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Warm, Simple Colors for Butcher Portal
                'warm': {
                    cream: '#faf8f3',
                    beige: '#f5f1e8',
                    brown: '#8b4513',
                    orange: '#f97316'
                }
            },
            fontSize: {
                // Extra large for readability
                'xxl': '1.75rem',
                'xxxl': '2.5rem'
            }
        },
    },
    plugins: [],
}
