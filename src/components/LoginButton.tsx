import { motion } from "framer-motion";
import osuLogo from "../../public/osu.svg";
import Image from "next/image";

interface LoginButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export function LoginButton({ onClick, disabled }: LoginButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            disabled={disabled}
            className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:enabled:bg-pink-700 transition-all flex items-center justify-center disabled:opacity-50">
            <Image src={osuLogo} alt="osu!" className="w-6 h-6 inline-block mr-2" />
            Who are you, anyways?
        </motion.button>
    );
}
