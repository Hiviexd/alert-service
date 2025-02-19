import { OsuUser } from "@/interfaces/osu";

/**
 * Parses a boolean from a string
 */
const parseBool = (value: string | undefined): boolean => {
    return value?.toLowerCase() === "true";
};

async function verifyOsuUsername(username: string): Promise<OsuUser | null> {
    try {
        const response = await fetch(
            `https://osu.ppy.sh/api/get_user?k=${process.env.OSU_API_KEY}&u=${encodeURIComponent(username)}`
        );

        if (!response.ok) {
            throw new Error("osu! user not found!");
        }

        const users = (await response.json()) as OsuUser[];
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error("Error verifying osu! user:", error);
        return null;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { parseBool, verifyOsuUsername };
