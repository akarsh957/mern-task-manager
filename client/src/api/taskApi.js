import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Get full task tree
export const getTaskTree = () => API.get("/tasks");

// Create task (root or child)
export const createTask = (data) => API.post("/tasks", data);

// Update task
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

// Delete task (cascade)
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
