import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Moon, Sun, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Button from "./ui/Button";

const SettingsDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-glass-200"
            >
                <Settings size={20} />
                <span className="hidden md:inline">Settings</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 bottom-12 md:bottom-auto md:top-12 w-56 glass-panel rounded-xl p-2 z-50 text-white shadow-2xl origin-top-right"
                    >
                        <div className="px-4 py-3 border-b border-glass-200 mb-2">
                            <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>

                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-glass-200 rounded-lg transition-colors">
                                <User size={16} />
                                Profile
                            </button>

                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-glass-200 rounded-lg transition-colors">
                                <Moon size={16} />
                                Dark Mode (On)
                            </button>

                            <div className="h-px bg-glass-200 my-1"></div>

                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsDropdown;
