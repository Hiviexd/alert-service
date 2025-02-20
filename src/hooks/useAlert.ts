import { useState } from "react";

interface AlertParams {
    message: string;
}

export function useAlert() {
    const [sending, setSending] = useState(false);

    const sendAlert = async ({ message }: AlertParams) => {
        setSending(true);

        try {
            const response = await fetch("/api/alert", {
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

    return { sendAlert, sending };
}
