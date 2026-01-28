import { useEffect, useState, useContext } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";
import Assistant from "../components/Assistant";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

 const addTask = async () => {
  if (!title.trim()) return;

  try {
    const newTask = await createTask(title, priority);
    setTasks(prev => [newTask, ...prev]);
    setTitle("");
    setPriority("Medium");
  } catch (err) {
    console.error(err);
    alert("Failed to add task");
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6 overflow-hidden">
      
      {/* Background Blob */}
      <svg
        className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] opacity-30"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          d="M47.3,-58.4C60.7,-48.6,70.4,-32.8,73.6,-16.1C76.8,0.7,73.4,18.3,64.4,32.5C55.3,46.8,40.6,57.7,24.2,64.7C7.8,71.8,-10.2,75,-25.8,69.1C-41.4,63.1,-54.6,48,-62.7,31.2C-70.8,14.3,-73.8,-4.2,-68.4,-20.6C-62.9,-36.9,-49,-51.1,-33.3,-60.2C-17.6,-69.3,0,-73.4,16.6,-69.3C33.2,-65.2,49.6,-53.8,47.3,-58.4Z"
          transform="translate(100 100)"
        />
      </svg>

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8 z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            My Tasks
          </h1>
          <button
            onClick={logout}
            className="text-red-600 font-semibold hover:underline"
          >
            Logout
          </button>
        </div>
<div className="flex gap-3 mb-6">
  <input
    type="text"
    placeholder="What do you need to do?"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="flex-1 px-4 py-3 rounded-xl border focus:outline-none"
  />

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="px-4 py-3 rounded-xl border"
  >
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  <button
    onClick={addTask}
    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
  >
    Add
  </button>
</div>

        {/* Tasks */}
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-xl p-5 mb-4 shadow-md hover:shadow-xl transition flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {task.title}
              </p>

              <div className="flex gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>

                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                  {task.status}
                </span>
              </div>
            </div>

            <div className="flex gap-4 font-semibold">
              {task.status !== "Completed" && (
                <button
                  onClick={() =>
                    updateTask(task._id, { status: "Completed" }).then(fetchTasks)
                  }
                  className="text-green-600 hover:scale-110 transition"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() =>
                  deleteTask(task._id).then(fetchTasks)
                }
                className="text-red-600 hover:scale-110 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Assistant tasks={tasks} />
    </div>
  );
};

export default Dashboard;
