import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Button = ({
    children,
    className,
    variant = "primary",
    isLoading = false,
    ...props
}) => {
    const baseStyles = "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-purple/30 hover:shadow-accent-purple/50",
        secondary: "bg-glass-100 hover:bg-glass-200 text-white border border-glass-200 backdrop-blur-md",
        danger: "bg-red-500/80 hover:bg-red-600 text-white shadow-lg shadow-red-500/30",
        ghost: "bg-transparent hover:bg-glass-100 text-gray-300 hover:text-white",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </motion.button>
    );
};

export default Button;
