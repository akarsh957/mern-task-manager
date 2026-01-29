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
  const { logout } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks failed");
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-indigo-900">
      <div className="bg-white/90 backdrop-blur w-[460px] p-6 rounded-2xl shadow-2xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <button onClick={logout} className="text-red-500 hover:underline">
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="What do you need to do?"
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

        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded"
          >
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-500">
                {task.priority} • {task.status}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleComplete(task._id)}
                className="text-green-600 hover:underline"
              >
                Complete
              </button>
              <button
                onClick={() => handleDelete(task._id)}
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
