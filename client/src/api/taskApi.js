import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token on every request
API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    const { token } = JSON.parse(localStorage.getItem("user"));
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Get tree
export const getTaskTree = () => API.get("/tasks/tree");

// Create task
export const createTask = (data) => API.post("/tasks", data);

// Update task
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

// Delete task
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
