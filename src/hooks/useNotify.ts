import { useState } from "react";
import helpers from "@/helpers";

interface NotifyParams {
    username: string;
    message: string;
    verifyUser?: boolean;
}

export function useNotify() {
    const [sending, setSending] = useState(false);

    const sendNotification = async ({ username, message }: NotifyParams) => {
        setSending(true);
        console.log(process.env.VERIFY_OSU_USERS);
        console.log(helpers.parseBool(process.env.VERIFY_OSU_USERS));

        try {
            const response = await fetch("/api/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    message,
                    verifyUser: helpers.parseBool(process.env.VERIFY_OSU_USERS),
                }),
            });

            if (response.ok) {
                return { success: true };
            }
            const res = await response.json();
            return { success: false, error: `Failed to send alert: ${res.error}` };
        } catch (error) {
            return { success: false, error: `Failed to send alert: ${error}` };
        } finally {
            setSending(false);
        }
    };

    return { sendNotification, sending };
}
