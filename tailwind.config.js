module.exports = {
    mode: "jit",
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: (theme) => ({
                backDrop: "url('/images/back-drop.png')"
            }),
            fontFamily: {
                Poppins: ["Poppins", "sans-serif"],
                Sora: ["Sora", "sans-serif"]
            },
            colors: {
                primary: "#FFD700",
                secondary: "#0066CC"
            }
        }
    },
    plugins: []
};
