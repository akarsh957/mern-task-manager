import { useState } from "react";

const TaskNode = ({ task, onAdd, onUpdate, onDelete, level = 0 }) => {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  const handleAddChild = () => {
    if (!title.trim()) return;
    onAdd(title, task._id);
    setTitle("");
    setShowInput(false);
  };

  return (
    <div className="ml-4 mt-2">
      <div
        className={`flex items-center justify-between p-2 rounded 
        ${task.status === "Completed" ? "bg-green-100" : "bg-gray-100"}`}
        style={{ marginLeft: level * 12 }}
      >
        <div>
          <p className="font-semibold">{task.title}</p>
          <p className="text-xs text-gray-500">
            {task.priority} • {task.status}
          </p>
        </div>

        <div className="flex gap-2 text-sm">
          <button
            onClick={() =>
              onUpdate(task._id, {
                status: task.status === "Completed" ? "Pending" : "Completed",
              })
            }
            className="text-green-600 hover:underline"
          >
            Toggle
          </button>

          <button
            onClick={() => setShowInput(!showInput)}
            className="text-blue-600 hover:underline"
          >
            + Subtask
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {showInput && (
        <div className="flex gap-2 mt-2 ml-6">
          <input
            className="border p-1 rounded w-full"
            placeholder="Subtask title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleAddChild}
            className="bg-indigo-600 text-white px-2 rounded"
          >
            Add
          </button>
        </div>
      )}

      {/* Render children recursively */}
      {task.children?.map((child) => (
        <TaskNode
          key={child._id}
          task={child}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export default TaskNode;
