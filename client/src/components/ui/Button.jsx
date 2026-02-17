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
        primary: "bg-gradient-to-r from-accent-cyan to-accent-violet text-white shadow-lg shadow-accent-violet/25 hover:shadow-accent-cyan/30 hover:brightness-110",
        secondary: "bg-glass-100 hover:bg-glass-200 text-white border border-glass-200 backdrop-blur-md hover:border-accent-cyan/30",
        danger: "bg-accent-rose/80 hover:bg-accent-rose text-white shadow-lg shadow-accent-rose/25",
        ghost: "bg-transparent hover:bg-glass-100 text-gray-400 hover:text-white",
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
