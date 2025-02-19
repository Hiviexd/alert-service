"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNotify } from "@/hooks/useNotify";
import { Alert } from "@/components/Alert";

export default function Home() {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState<{ message: string | null; type: "success" | "error" | null }>({
        message: null,
        type: null,
    });
    const { sendNotification, sending } = useNotify();

    const handleClientNotification = (message: string, type: "success" | "error" | null, timeout = 3000) => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: null, type: null }), timeout);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sanitizedUsername = username.trim();
        const sanitizedMessage = message.trim();

        // Form validation
        if (!sanitizedUsername) {
            handleClientNotification("Please provide your osu! username", "error");
            return;
        }

        if (!sanitizedMessage) {
            handleClientNotification("Please describe your issue", "error");
            return;
        }

        // Send notification
        const result = await sendNotification({
            username: sanitizedUsername,
            message: sanitizedMessage,
        });

        if (result.success) {
            setMessage("");
            handleClientNotification("Alert sent successfully!", "success");
        } else {
            handleClientNotification(result.error as string, "error", 5000);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
            <Alert message={alert.message} type={alert.type} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md mx-4 backdrop-blur-sm bg-gray-800/30 rounded-xl shadow-xl p-8 border border-gray-700/50 backdrop-filter">
                <h1 className="text-2xl font-bold text-gray-100 mb-6">Alert</h1>
                <p className="text-gray-300 mb-6">
                    Something broke that needs my immediate attention? Use this to alert me if I&apos;m not responsive.
                    <br />
                    Chances this gets my attention faster than a Discord notification.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            What&apos;s your osu! username?
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600/50 bg-gray-700/50 text-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all placeholder-gray-400 backdrop-blur-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                            Describe your issue
                        </label>
                        <motion.textarea
                            whileFocus={{ scale: 1.01 }}
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-600/50 bg-gray-700/50 text-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all placeholder-gray-400 backdrop-blur-sm"
                            rows={4}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={sending}
                        className="w-full bg-gray-200/80 backdrop-blur-sm text-gray-900 py-2 rounded-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50">
                        {sending ? "Sending..." : "Send Alert"}
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}
