/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        /* BASE */
        border: "hsl(214 32% 91%)",
        input: "hsl(214 32% 91%)",
        ring: "hsl(246 83% 64%)",

        background: "hsl(220 43% 98%)",
        foreground: "hsl(224 33% 17%)",

        /* PRIMARY */
        primary: {
          DEFAULT: "hsl(246 83% 64%)",
          foreground: "hsl(0 0% 100%)",
        },

        /* SECONDARY */
        secondary: {
          DEFAULT: "hsl(217 32% 96%)",
          foreground: "hsl(224 33% 17%)",
        },

        /* MUTED */
        muted: {
          DEFAULT: "hsl(216 33% 97%)",
          foreground: "hsl(217 16% 46%)",
        },

        /* ACCENT */
        accent: {
          DEFAULT: "hsl(246 83% 97%)",
          foreground: "hsl(246 83% 40%)",
        },

        /* CARD */
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(224 33% 17%)",
        },

        /* STATUS COLORS (for badges) */
        success: "hsl(142 76% 36%)",
        warning: "hsl(38 92% 50%)",
        destructive: "hsl(0 84% 60%)",
      },

      /* BORDER RADIUS */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      /* SHADOWS */
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        glow: "0 0 40px rgba(99, 102, 241, 0.25)",
      },

      /* ANIMATIONS */
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
      },
    },
  },

  plugins: [],
};