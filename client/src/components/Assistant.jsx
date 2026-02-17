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
            className="mb-2 w-72 glass-panel p-4 rounded-2xl text-sm text-white glow-border"
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-glass-200">
              <Bot className="text-accent-cyan" size={18} />
              <p className="font-semibold text-sm">Task Assistant</p>
            </div>

            {highTasks.length > 0 ? (
              <div className="space-y-2">
                <p className="flex items-start gap-2 text-accent-rose text-sm">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{highTasks.length} high priority task(s). Do them first!</span>
                </p>
                <ul className="list-disc list-inside text-xs text-gray-400 pl-6 space-y-1">
                  {highTasks.slice(0, 3).map(t => (
                    <li key={t._id} className="truncate">{t.title}</li>
                  ))}
                  {highTasks.length > 3 && <li className="text-gray-500">...and more</li>}
                </ul>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 size={14} />
                <span>You're all clear! Great job! ✨</span>
              </p>
            )}

            {reminder && (
              <p className="mt-3 text-xs text-accent-amber bg-accent-amber/10 p-2 rounded-lg border border-accent-amber/20">
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
        className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet shadow-lg shadow-accent-violet/30 flex items-center justify-center text-white relative"
      >
        <Bot size={24} />
        {highTasks.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-rose rounded-full border-2 border-dark-900 animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default Assistant;
