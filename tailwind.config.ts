import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#ff3b3b',
                secondary: '#e13434'
            },
            dropShadow: {
                'intense': '1px 1px 6px #000000',
            }
        }
    },
    plugins: [],
};

export default config;
