"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNotify } from "@/hooks/useNotify";
import { useAuth } from "@/hooks/useAuth";
import { Alert } from "@/components/Alert";
import logo from "../../public/logo.svg";
import Image from "next/image";

export default function Home() {
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState<{ message: string | null; type: "success" | "error" | null }>({
        message: null,
        type: null,
    });
    const { sendNotification, sending } = useNotify();
    const { user, loading, login } = useAuth();

    const handleClientNotification = (message: string, type: "success" | "error" | null, timeout = 3000) => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: null, type: null }), timeout);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sanitizedMessage = message.trim();

        // Form validation
        if (!sanitizedMessage) {
            handleClientNotification("Please describe your issue", "error");
            return;
        }

        // Send notification
        const result = await sendNotification({
            message: sanitizedMessage,
        });

        if (result.success) {
            setMessage("");
            handleClientNotification("Alert sent successfully!", "success");
        } else {
            handleClientNotification(result.error as string, "error", 5000);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen-dvh flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
                <motion.button
                    onClick={login}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all">
                    Login with osu!
                </motion.button>
            </main>
        );
    }

    return (
        <main className="min-h-screen-dvh flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
            <Alert message={alert.message} type={alert.type} />
            {!loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full max-w-md m-6 backdrop-blur-sm bg-gray-800/30 rounded-xl shadow-xl p-8 border border-gray-700/50 backdrop-filter">
                    <span className="text-2xl font-bold text-gray-100 mb-4 flex items-center">
                        <Image src={logo} alt="logo" className="w-10 h-10 inline-block mr-2" />
                        Alert
                    </span>
                    <p className="text-gray-300 mb-3">
                        Something broke that needs my immediate attention? Use this to alert me if I&apos;m not
                        responsive.
                    </p>
                    <p className="text-gray-300 mb-6">
                        Chances this gets my attention faster than a Discord notification.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
            )}
        </main>
    );
}
