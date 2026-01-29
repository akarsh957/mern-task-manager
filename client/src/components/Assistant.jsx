import { useEffect, useState } from "react";
import assistant from "../assets/assistant.svg";

const Assistant = ({ tasks }) => {
  const [open, setOpen] = useState(false);
  const [reminder, setReminder] = useState("");

  const highTasks = tasks.filter(t => t.priority === "High");

  // 🔔 Auto reminder every 30s
  useEffect(() => {
    if (highTasks.length > 0) {
      const interval = setInterval(() => {
        setReminder("⚠️ You still have HIGH priority tasks!");
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [tasks]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {open && (
        <div className="mb-3 w-64 bg-white rounded-xl p-4 shadow-2xl animate-fade-in text-sm">
          <p className="font-semibold mb-1">🤖 Task Assistant</p>
          {highTasks.length > 0 ? (
            <p className="text-red-500">
              {highTasks.length} high priority task(s). Do them first!
            </p>
          ) : (
            <p className="text-green-600">
              You're all clear ✨
            </p>
          )}
          {reminder && <p className="mt-2 text-orange-500">{reminder}</p>}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-white shadow-xl hover:scale-110 transition animate-bounce"
      >
        <img src={assistant} alt="assistant" className="w-12 h-12 mx-auto" />
      </button>
    </div>
  );
};

export default Assistant;
