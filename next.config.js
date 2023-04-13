/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || "",
        BASE_URL: process.env.BASE_URL || "http://localhost:3000",
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "http://localhost:8080/graphql"
    }
};

module.exports = nextConfig;
