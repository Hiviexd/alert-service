/** ntfy allows at most three user actions per notification. */
export const NTFY_MAX_ACTIONS = 3;

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

/** Well-known hostnames → display labels for action buttons. */
const SITE_NAMES: Record<string, string> = {
    "github.com": "GitHub",
    "gist.github.com": "GitHub Gist",
    "twitter.com": "Twitter",
    "x.com": "X",
    "youtube.com": "YouTube",
    "youtu.be": "YouTube",
    "music.youtube.com": "YouTube Music",
    "twitch.tv": "Twitch",
    "reddit.com": "Reddit",
    "old.reddit.com": "Reddit",
    "discord.com": "Discord",
    "discord.gg": "Discord",
    "stackoverflow.com": "Stack Overflow",
    "osu.ppy.sh": "osu!",
    "open.spotify.com": "Spotify",
    "spotify.com": "Spotify",
    "docs.google.com": "Google Docs",
    "drive.google.com": "Google Drive",
    "google.com": "Google",
    "notion.so": "Notion",
    "figma.com": "Figma",
    "wikipedia.org": "Wikipedia",
    "en.wikipedia.org": "Wikipedia",
};

const GENERIC_SUBDOMAINS = new Set(["www", "m", "mobile", "api", "cdn"]);

function escapeActionValue(value: string): string {
    if (/[,;]/.test(value)) {
        return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
}

/** Extract unique http(s) URLs from plain text, in order of appearance. */
export function extractUrls(text: string): string[] {
    const seen = new Set<string>();
    const urls: string[] = [];

    for (const match of text.matchAll(URL_REGEX)) {
        const trimmed = match[0].replace(/[.,;:!?)]+$/g, "");
        try {
            const href = new URL(trimmed).href;
            if (!seen.has(href)) {
                seen.add(href);
                urls.push(href);
            }
        } catch {
            // skip invalid URLs
        }
    }

    return urls;
}

/** Derive a human-readable site name from a URL for action button labels. */
export function getSiteDisplayName(urlString: string): string {
    try {
        const { hostname } = new URL(urlString);
        const host = hostname.toLowerCase();
        const withoutWww = host.replace(/^www\./, "");

        if (SITE_NAMES[host]) return SITE_NAMES[host];
        if (SITE_NAMES[withoutWww]) return SITE_NAMES[withoutWww];

        const parts = withoutWww.split(".");
        if (parts.length >= 3) {
            const subdomain = parts[0];
            if (!GENERIC_SUBDOMAINS.has(subdomain)) {
                return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
            }
        }

        const main = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
        return main.charAt(0).toUpperCase() + main.slice(1);
    } catch {
        return "Link";
    }
}

/** Format actions for the ntfy `Actions` header (view = open URL). */
export function buildActionsHeader(actions: Array<{ label: string; url: string }>): string {
    return actions
        .map(
            ({ label, url }) =>
                `view, ${escapeActionValue(label)}, ${escapeActionValue(url)}`
        )
        .join("; ");
}

export function buildAlertActions(
    message: string,
    fixedActions: Array<{ label: string; url: string }>
): string {
    const actions = [...fixedActions];
    const usedLabels = new Set(fixedActions.map((a) => a.label));
    const fixedUrls = new Set(fixedActions.map((a) => a.url));

    for (const url of extractUrls(message)) {
        if (actions.length >= NTFY_MAX_ACTIONS) break;
        if (fixedUrls.has(url)) continue;

        const baseLabel = getSiteDisplayName(url);
        let label = baseLabel;
        let suffix = 2;
        while (usedLabels.has(label)) {
            label = `${baseLabel} (${suffix++})`;
        }
        usedLabels.add(label);
        actions.push({ label, url });
    }

    return buildActionsHeader(actions);
}
