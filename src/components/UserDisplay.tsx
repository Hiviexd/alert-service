import { motion } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

interface UserDisplayProps {
    username: string;
    avatar_url: string;
    onLogout: () => void;
}

export function UserDisplay({ username, avatar_url, onLogout }: UserDisplayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/50 flex items-center">
            <div className="flex items-center gap-3 flex-1">
                <Image src={avatar_url} alt={username} width={32} height={32} className="rounded-full" />
                <span className="text-gray-100">{username}</span>
            </div>
            <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-red-600 transition-colors p-1">
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
}
