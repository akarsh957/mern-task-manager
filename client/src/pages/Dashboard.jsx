import { useEffect, useState, useContext } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";
import Assistant from "../components/Assistant";


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { logout } = useContext(AuthContext);

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

 return (
  <div className="min-h-screen relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    {/* Main Card */}
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white w-[450px] p-6 rounded-xl shadow-xl z-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <button onClick={logout} className="text-red-500">
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
            className="bg-indigo-600 text-white px-4 rounded"
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

            <div className="flex gap-2">
              <button
                onClick={() => updateTask(task._id).then(fetchTasks)}
                className="text-green-600"
              >
                Complete
              </button>
              <button
                onClick={() => deleteTask(task._id).then(fetchTasks)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 🤖 Floating Assistant */}
    <Assistant tasks={tasks} />
  </div>
)};


export default Dashboard;
