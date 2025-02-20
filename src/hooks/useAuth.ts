import { useState, useEffect } from "react";
import { OsuUser } from "@/interfaces/osu";

export function useAuth() {
    const [user, setUser] = useState<OsuUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/user");
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        window.location.href = "/api/auth/login";
    };

    const logout = async () => {
        await fetch("/api/auth/logout");
        setUser(null);

        // needed for triggering the form animation
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 50);
    };

    return { user, loading, login, logout };
}
