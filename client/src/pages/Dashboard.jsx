import { useEffect, useState, useContext } from "react";
import {
  getTaskTree,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";
import TaskNode from "../components/TaskNode";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { dispatch } = useContext(AuthContext);

  const fetchTasks = async () => {
    const res = await getTaskTree();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddRoot = async () => {
    if (!title.trim()) return;

    await createTask({ title, priority });
    setTitle("");
    fetchTasks();
  };

  const handleAddChild = async (title, parentId) => {
    await createTask({ title, parentId });
    fetchTasks();
  };

  const handleUpdate = async (id, data) => {
    await updateTask(id, data);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur p-6 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Task Tree Dashboard</h2>
          <button
            onClick={() => dispatch({ type: "LOGOUT" })}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Add root task */}
        <div className="flex gap-2 mb-6">
          <input
            className="border p-2 rounded w-full"
            placeholder="New root task..."
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
            onClick={handleAddRoot}
            className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* Tree */}
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskNode
              key={task._id}
              task={task}
              onAdd={handleAddChild}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
