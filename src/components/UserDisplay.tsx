import { motion } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { OsuUser } from "@/interfaces/osu";

interface UserDisplayProps {
    user: OsuUser;
    onLogout: () => void;
}

export function UserDisplay({ user, onLogout }: UserDisplayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full px-4 py-2 mb-6 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/50 flex items-center">
            <div className="flex items-center gap-3 flex-1">
                <Image src={user.avatar_url} alt={user.username} width={32} height={32} className="rounded-full" />
                <a
                    href={`https://osu.ppy.sh/users/${user.id}`}
                    target="_blank"
                    className="text-gray-100 relative group">
                    {user.username}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-100 transition-all duration-300 group-hover:w-full" />
                </a>
            </div>
            <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-gray-600/50 rounded">
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
}
