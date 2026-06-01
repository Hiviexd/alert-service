import { useCallback, useEffect, useState } from "react";

interface AlertParams {
    message: string;
}

interface AlertCooldownResponse {
    remainingSeconds: number;
    cooldownSeconds: number;
}

export function useAlert(enabled: boolean) {
    const [sending, setSending] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    const refreshCooldown = useCallback(async () => {
        if (!enabled) return;

        try {
            const response = await fetch("/api/alert");
            if (!response.ok) return;

            const data: AlertCooldownResponse = await response.json();
            setCooldownRemaining(data.remainingSeconds);
        } catch {
            // ignore — button stays enabled if status can't be fetched
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) {
            setCooldownRemaining(0);
            return;
        }
        refreshCooldown();
    }, [enabled, refreshCooldown]);

    useEffect(() => {
        if (cooldownRemaining <= 0) return;

        const id = setInterval(() => {
            setCooldownRemaining((seconds) => Math.max(0, seconds - 1));
        }, 1000);

        return () => clearInterval(id);
    }, [cooldownRemaining > 0]);

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

            if (typeof data.remainingSeconds === "number") {
                setCooldownRemaining(data.remainingSeconds);
            }

            return { success: response.ok, error: data.error };
        } catch (error) {
            return { success: false, error: `Failed to send alert: ${error}` };
        } finally {
            setSending(false);
        }
    };

    const onCooldown = cooldownRemaining > 0;

    return { sendAlert, sending, cooldownRemaining, onCooldown, refreshCooldown };
}
