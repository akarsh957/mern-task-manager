import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Plus, Trash2, Edit3 } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const TaskNode = ({ task, onAdd, onUpdate, onDelete, level = 0 }) => {
  const [showInput, setShowInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [title, setTitle] = useState("");

  const handleAddChild = async () => {
    if (!title.trim()) return;
    try {
      await onAdd(title, task._id);
      setTitle("");
      setShowInput(false);
      setIsExpanded(true);
    } catch (error) {
      console.error("Failed to add child task", error);
    }
  };

  const handleToggleComplete = () => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    onUpdate(task._id, { status: newStatus });
  };

  const hasChildren = task.children && task.children.length > 0;
  const isCompleted = task.status === "Completed";

  return (
    <div className="ml-4 mt-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`group relative flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-glass-200 hover:bg-glass-100 transition-all duration-300
        ${isCompleted ? "opacity-60" : "opacity-100"}`}
      >
        {/* Connection Line */}
        {level > 0 && (
          <div className="absolute left-[-18px] top-1/2 w-4 h-[1px] bg-glass-200"></div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 rounded-full hover:bg-glass-200 transition-colors ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <button onClick={handleToggleComplete} className="text-gray-400 hover:text-accent-blue transition-colors">
            {isCompleted ? (
              <CheckCircle2 className="text-green-400" size={20} />
            ) : (
              <Circle className="text-gray-400 group-hover:text-accent-purple transition-colors" size={20} />
            )}
          </button>

          <div>
            <p className={`font-medium ${isCompleted ? "line-through text-gray-400" : "text-white"}`}>
              {task.title}
            </p>
            {task.dueDate && (
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${task.priority === 'High' ? 'border-red-500/30 text-red-300 bg-red-500/10' :
                task.priority === 'Medium' ? 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10' :
                  'border-green-500/30 text-green-300 bg-green-500/10'
                }`}>
                {task.priority || 'Medium'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowInput(!showInput)}
            className="p-2 text-gray-400 hover:text-accent-blue hover:bg-glass-200 rounded-lg transition-all"
            title="Add Subtask"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-glass-200 rounded-lg transition-all"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>

      <div className="relative pl-6 border-l border-glass-100 ml-4">
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-2 py-2"
          >
            <Input
              className="py-1 text-sm bg-glass-200/50"
              placeholder="Subtask title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
            />
            <Button
              onClick={handleAddChild}
              className="px-3 py-1 text-sm h-full"
              variant="secondary"
            >
              Add
            </Button>
          </motion.div>
        )}

        {isExpanded && task.children?.map((child) => (
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
    </div>
  );
};

export default TaskNode;
