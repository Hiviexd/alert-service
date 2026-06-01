export function getAlertCooldownMs(): number {
    return process.env.ALERT_COOLDOWN_SECONDS
        ? parseInt(process.env.ALERT_COOLDOWN_SECONDS, 10) * 1000
        : 60000;
}

export function getAlertCooldownSeconds(): number {
    return getAlertCooldownMs() / 1000;
}

export function getAlertCooldownRemainingSeconds(lastAlertAt?: number): number {
    if (!lastAlertAt) return 0;

    const remainingMs = getAlertCooldownMs() - (Date.now() - lastAlertAt);
    return remainingMs <= 0 ? 0 : Math.ceil(remainingMs / 1000);
}
