import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, AlertCircle, CheckCircle2 } from "lucide-react";

const Assistant = ({ tasks }) => {
  const [open, setOpen] = useState(false);
  const [reminder, setReminder] = useState("");

  const highTasks = tasks.filter((t) => t.priority === "High" && t.status !== "Completed");

  useEffect(() => {
    if (highTasks.length > 0) {
      const interval = setInterval(() => {
        setReminder("⚠️ You still have HIGH priority tasks!");
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [tasks]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-2 w-72 glass-panel p-4 rounded-xl text-sm text-white"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-glass-200">
              <Bot className="text-accent-blue" size={20} />
              <p className="font-semibold">Task Assistant</p>
            </div>

            {highTasks.length > 0 ? (
              <div className="space-y-2">
                <p className="flex items-start gap-2 text-red-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{highTasks.length} high priority task(s). Do them first!</span>
                </p>
                <ul className="list-disc list-inside text-xs text-gray-300 pl-6">
                  {highTasks.slice(0, 3).map(t => (
                    <li key={t._id} className="truncate">{t.title}</li>
                  ))}
                  {highTasks.length > 3 && <li>...and more</li>}
                </ul>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-green-300">
                <CheckCircle2 size={16} />
                <span>You're all clear! Great job! ✨</span>
              </p>
            )}

            {reminder && (
              <p className="mt-3 text-xs text-orange-300 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                {reminder}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple shadow-lg shadow-accent-purple/40 flex items-center justify-center text-white relative"
      >
        <Bot size={28} />
        {highTasks.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-dark-900 animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default Assistant;
