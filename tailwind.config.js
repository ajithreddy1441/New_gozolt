// tailwind.config.js
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(.4,0,.2,1)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
};