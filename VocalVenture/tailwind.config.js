/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        rotate180: 'rotate180 1s ease-in-out',
        growth: 'rotate360 1s ease-in-out',
        fadeout: 'fadeout 2s ease-in-out',
        flipToWhite: 'flipToWhite 1s forwards',
        bounce1: 'bounce 0.6s ease-in-out infinite',
        bounce2: 'bounce 0.6s ease-in-out 0.2s infinite',
        bounce3: 'bounce 0.6s ease-in-out 0.4s infinite',
        bounce4: 'bounce 0.6s ease-in-out 0.6s infinite',
      },
      keyframes: {
        rotate180: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        widthFade:{
'0%':{
  width:"100%"
},
'50%':{
  width:'95%'
},
'100%':{
  width:'50%'
}
        },
        flipToWhite: { 
          '0%': {
            transform: 'rotateY(`80deg)',
            // zIndex: 1,
          },
          '50%': {
            background: 'white',
            // zIndex: 2,
          },
          '100%': {
            transform: 'rotateY(0deg)',
            // zIndex: 2,
          },
        },
        fadeout: {
          '0%': { opacity: 1 }, // Start fully visible
          '100%': { opacity: 0 }, // End completely transparent
        }
        ,
        
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
