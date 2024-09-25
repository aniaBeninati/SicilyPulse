import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        verde: "#4E614E",
        giallo: "#F2B85A",
        rosso: "#822225",
        bianco: "#FFFFFF",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        titolo: ['"Libre Bodoni"', ...fontFamily.serif],
        testo: ['Roboto', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;