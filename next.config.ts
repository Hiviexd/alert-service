import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NTFY_URL: process.env.NTFY_URL,
        OSU_CLIENT_ID: process.env.OSU_CLIENT_ID,
        OSU_CLIENT_SECRET: process.env.OSU_CLIENT_SECRET,
        OSU_CALLBACK_URL: process.env.OSU_CALLBACK_URL,
        ALERT_COOLDOWN_SECONDS: process.env.ALERT_COOLDOWN_SECONDS,
    },
    images: {
        domains: ["a.ppy.sh"],
    },
};

export default nextConfig;
