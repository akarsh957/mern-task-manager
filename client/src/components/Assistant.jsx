import { useState } from "react";
import assistant from "../assets/assistant.svg";
import { getAISuggestion } from "../utils/aiAssistant";

const Assistant = ({ tasks }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I’m your productivity assistant!" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const reply = getAISuggestion(tasks, input);

    setMessages(prev => [
      ...prev,
      userMsg,
      { from: "bot", text: reply },
    ]);

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="bg-white w-80 rounded-xl shadow-xl p-4 mb-3 animate-fade-in">
          <div className="h-52 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.from === "bot"
                    ? "bg-gray-100"
                    : "bg-indigo-600 text-white text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1 text-sm"
              placeholder="Ask me..."
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-3 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <img
        src={assistant}
        className="w-20 cursor-pointer animate-bounce"
        onClick={() => setOpen(!open)}
      />
    </div>
  );
};

export default Assistant;
