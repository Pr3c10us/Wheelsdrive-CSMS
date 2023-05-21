/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: "#191970",
                secondary: "#fdfdfc",
                accent: "#ed5331",
                background: "#fff",
                text: "#000000",
            },
            screens: {
                xs: "510px",
                xmd: "700px",
                "2xs": "365px",
            },
            fontFamily: {
                raleway: ["Raleway", "sans-serif"],
            },
        },
    },
    plugins: [],
};
