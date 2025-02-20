import { motion } from "framer-motion";
import osuLogo from "../../public/osu.svg";
import Image from "next/image";

interface LoginButtonProps {
    onClick: () => void;
}

export function LoginButton({ onClick }: LoginButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all flex items-center justify-center">
            <Image src={osuLogo} alt="osu!" className="w-6 h-6 inline-block mr-2" />
            Who are you, anyways?
        </motion.button>
    );
}
