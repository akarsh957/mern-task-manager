import { useState } from "react";
import assistant from "../assets/assistant.svg";

const Assistant = ({ tasks = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end"
    >
      {open && (
        <div className="mb-3 w-64 rounded-xl bg-white shadow-2xl p-4 text-sm animate-fade-in">
          👋 Hi!  
          <br />
          You have <b>{tasks.length}</b> tasks.
          <br />
          Try finishing high-priority ones first 🔥
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-white shadow-2xl hover:scale-105 transition"
      >
        <img
          src={assistant}
          alt="Assistant"
          className="w-full h-full"
        />
      </button>
    </div>
  );
};

export default Assistant;
