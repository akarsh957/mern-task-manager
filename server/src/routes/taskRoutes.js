import express from "express";
import {
  getTasks,
  getTaskTree,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/tree", getTaskTree);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;

