/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#B7F397',
          blue: '#6BB8FF',
          deep: '#0B3D2E',
          soft: '#E9FFF4'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 30px rgba(12, 78, 54, 0.12)'
      }
    }
  },
  plugins: []
};
