import { useState } from "react";

interface NotifyParams {
    message: string;
}

export function useNotify() {
    const [sending, setSending] = useState(false);

    const sendNotification = async ({ message }: NotifyParams) => {
        setSending(true);

        try {
            const response = await fetch("/api/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
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
