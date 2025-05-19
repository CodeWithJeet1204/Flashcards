module.exports = {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        pingSmooth: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(3)", opacity: 0 },
        },
        themeTransition: {
          "0%": {
            transform: "scale(0)",
            opacity: 1,
            transformOrigin: "top right",
            backgroundImage:
              "radial-gradient(circle at top right, #2fb2ff, #004aad, #002f6e)",
          },
          "100%": {
            transform: "scale(3.5)",
            opacity: 0,
            backgroundImage:
              "radial-gradient(circle at top right, #2fb2ff, #004aad, #002f6e)",
          },
        },
        blurFade: {
          "0%": {
            opacity: 0.3,
            transform: "scale(1)",
          },
          "100%": {
            opacity: 0,
            transform: "scale(2.5)",
          },
        },
      },
      animation: {
        pop: "pop 150ms ease-out",
        fadeIn: "fadeIn 500ms ease-in",
        "ping-smooth": "pingSmooth 0.6s ease-out",
        themeTransition: "themeTransition 4s ease-in-out forwards", // slowed down
        blurFade: "blurFade 0.8s ease-out forwards",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
