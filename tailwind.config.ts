import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--void)",
        foreground: "var(--txt)",
        void: "#060A12",
        deep: "#0D1826",
        panel: "#111C2E",
        rim: "#1A2B40",
        gold: "#F0C040",
        'gold-dark': "#E07820",
        fire: "#FF4D1A",
        ice: "#38D9F5",
        emerald: "#00E5A0",
        purple: "#9D6FFF",
        txt: "#EAE6DA",
        txt2: "rgba(234,230,218,0.45)",
      },
      fontFamily: {
        display: ['var(--font-barlow-condensed)', 'sans-serif'],
        body: ['var(--font-barlow)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
