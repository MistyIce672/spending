/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}","./pricing.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#1E1E1E",
        negative: "#CB3B3B",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        positive: "#18B560",
        ogDark: "#eb2d07",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif","Saira"],
      },
      boxShadow:{
        og : "0 0 10px #f35a0a",
        btn : "0 0 35px rgba(243, 90, 10,.3)",
      },
      animation: {
        ["infinite-slider"]: "infiniteSlider 70s linear infinite",
        ["brand-slider"]: "brandSlider 20s linear infinite",
        ["flow"]: "flow 4s linear infinite",
        ["flowI"]: "flowI 6s linear infinite",
        ["flowM"]: "flowM 8s linear infinite",
      },
      
      keyframes: {
        infiniteSlider: {
          "0%": { transform: "translateX(0)" },
          "100%": {
            transform: "translateX(calc(-412px * 12))",
          },
        },
        brandSlider: {
          "0%": { transform: "translateX(0)" },
          "100%": {
            transform: "translateX(calc(-297px * 4 ))",
          },
        },
        flow: {
          "0%":{transform: "translateY(-40%)"},
          "100%": {transform: "translateY(-40%)"},
          "50%": {transform: "translateY(0)"}
        },
        flowI: {
          "0%":{transform: "translateY(0)"},
          "100%": {transform: "translateY(0)"},
          "50%": {transform: "translateY(-25%)"}
        },
        flowM: {
          "25%":{transform: "translateY(0)"},
          "50%":{transform: "translateY(-12.5%)"},
          "75%": {transform: "translateY(-25%)"},
          "0%": {transform: "translateY(-12.5%)"},
          "100%": {transform: "translateY(-12.5%)"}
        },
        
        
      },
      gridAutoColumns: {
        '4i': 'calc((100% / 4) - 12px)',
        '3i': 'calc((100% / 3) - 12px)',
        '2i': 'calc((100% / 2) - 12px)',
        '1i': 'calc((100% / 1) - 12px)',
      },
      rotate: {
        '315': '315deg',
      }
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};