const TaskItem = ({ task, onDelete, onComplete }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>

      {task.status !== "Completed" && (
        <button onClick={() => onComplete(task._id)}>Complete</button>
      )}
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  );
};

export default TaskItem;
