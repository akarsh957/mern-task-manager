import { useEffect, useState, useContext } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { dispatch } = useContext(AuthContext);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await createTask({ title, priority });
    setTitle("");
    setPriority("Medium");
    fetchTasks();
  };

  const handleComplete = async (id) => {
    await updateTask(id, { status: "Completed" });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  // 🔥 GROUP TASKS BY PRIORITY
  const groupedTasks = {
    High: tasks.filter(t => t.priority === "High"),
    Medium: tasks.filter(t => t.priority === "Medium"),
    Low: tasks.filter(t => t.priority === "Low"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 px-4 py-6">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur p-6 rounded-2xl shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">Task Dashboard</h2>
          <button
            onClick={() => dispatch({ type: "LOGOUT" })}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* ADD TASK */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            className="border p-2 rounded w-full"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded transition"
          >
            Add
          </button>
        </div>

        {/* PRIORITY SECTIONS */}
        <PrioritySection
          title="🔥 High Priority"
          tasks={groupedTasks.High}
          onComplete={handleComplete}
          onDelete={handleDelete}
          accent="border-red-500"
        />

        <PrioritySection
          title="⚠️ Medium Priority"
          tasks={groupedTasks.Medium}
          onComplete={handleComplete}
          onDelete={handleDelete}
          accent="border-yellow-500"
        />

        <PrioritySection
          title="🟢 Low Priority"
          tasks={groupedTasks.Low}
          onComplete={handleComplete}
          onDelete={handleDelete}
          accent="border-green-500"
        />
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const PrioritySection = ({ title, tasks, onComplete, onDelete, accent }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{title}</h3>

      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task._id}
            className={`flex justify-between items-center bg-gray-100 p-3 rounded border-l-4 ${accent}`}
          >
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-xs text-gray-500">{task.status}</p>
            </div>

            <div className="flex gap-3 text-sm">
              {task.status !== "Completed" && (
                <button
                  onClick={() => onComplete(task._id)}
                  className="text-green-600 hover:underline"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => onDelete(task._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
