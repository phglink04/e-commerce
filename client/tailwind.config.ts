import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
      },
      colors: {
        brand: {
          bg: "#ecffed",
          green: "#2f6f3e",
          dark: "#173320",
        },
      },
    },
  },
  plugins: [],
};

export default config;
