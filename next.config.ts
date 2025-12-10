import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
    // For GitHub Pages: https://username.github.io/elemonica_calendar/
    basePath:
        process.env.NODE_ENV === "production" ? "/elemonica_calendar" : "",
    trailingSlash: true,
};

export default nextConfig;
