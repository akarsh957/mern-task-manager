import API from "./authApi";

export const getTasks = () => API.get("/tasks");
export const createTask = async (title, priority) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, priority }),
  });

  return res.json();
};

export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
