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
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            return { success: response.ok, error: data.error };
        } catch (error) {
            return { success: false, error: `Failed to send alert: ${error}` };
        } finally {
            setSending(false);
        }
    };

    return { sendAlert, sending };
};
