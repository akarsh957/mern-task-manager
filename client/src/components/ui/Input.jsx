import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Input = forwardRef(({ className, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <input
                ref={ref}
                className={twMerge(
                    clsx(
                        "w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-glass-200 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/40 transition-all backdrop-blur-sm",
                        error && "border-accent-rose focus:ring-accent-rose/30",
                        className
                    )
                )}
                {...props}
            />
            {error && <p className="text-accent-rose text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
