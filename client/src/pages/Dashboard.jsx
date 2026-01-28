import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskApi";
import TaskItem from "../components/TaskItem";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    await createTask({ title });
    setTitle("");
    fetchTasks();
  };

  const deleteHandler = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const completeHandler = async (id) => {
    await updateTask(id, { status: "Completed" });
    fetchTasks();
  };

  return (
    <div>
      <h2>My Tasks</h2>

      <form onSubmit={addTask}>
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={deleteHandler}
          onComplete={completeHandler}
        />
      ))}
    </div>
  );
};

export default Dashboard;
