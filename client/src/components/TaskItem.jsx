const TaskItem = ({ task, onComplete, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-4 flex justify-between items-center">
      <div>
        <h3 className="text-gray-900 font-semibold text-lg">
          {task.title}
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          Priority:{" "}
          <span
            className={
              task.priority === "High"
                ? "text-red-600 font-semibold"
                : task.priority === "Medium"
                ? "text-yellow-600 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            {task.priority}
          </span>
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onComplete(task._id)}
          className="text-green-600 font-medium hover:underline"
        >
          Complete
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-600 font-medium hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
