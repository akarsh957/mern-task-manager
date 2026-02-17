import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Card = ({ children, className, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -5 } : {}}
            className={twMerge(
                clsx(
                    "bg-glass-100 backdrop-blur-xl border border-glass-200 rounded-2xl shadow-2xl overflow-hidden glow-border",
                    className
                )
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
