import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NTFY_URL: process.env.NTFY_URL,
        OSU_API_KEY: process.env.OSU_API_KEY,
        VERIFY_OSU_USERS: process.env.VERIFY_OSU_USERS,
    },
};

export default nextConfig;
