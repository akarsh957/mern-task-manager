import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
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
    <div className="ml-4 mt-1">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`group relative flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-glass-200 hover:bg-dark-800/30 transition-all duration-300
        ${isCompleted ? "opacity-50" : "opacity-100"}`}
      >
        {/* Connection Line */}
        {level > 0 && (
          <div className="absolute left-[-18px] top-1/2 w-4 h-[1px] bg-glass-200"></div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 rounded-lg hover:bg-glass-200 transition-colors text-gray-500 hover:text-white ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          <button onClick={handleToggleComplete} className="transition-colors">
            {isCompleted ? (
              <CheckCircle2 className="text-emerald-400" size={18} />
            ) : (
              <Circle className="text-gray-600 group-hover:text-accent-cyan transition-colors" size={18} />
            )}
          </button>

          <div>
            <p className={`font-medium text-sm ${isCompleted ? "line-through text-gray-500" : "text-gray-200"}`}>
              {task.title}
            </p>
            {task.dueDate && (
              <span className="text-[10px] text-gray-500 block mt-0.5">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${task.priority === 'High' ? 'bg-accent-rose/15 text-accent-rose border border-accent-rose/20' :
                task.priority === 'Medium' ? 'bg-accent-amber/15 text-accent-amber border border-accent-amber/20' :
                  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                }`}>
                {task.priority || 'Medium'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowInput(!showInput)}
            className="p-2 text-gray-500 hover:text-accent-cyan hover:bg-glass-100 rounded-lg transition-all"
            title="Add Subtask"
          >
            <Plus size={14} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-500 hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-all"
            title="Delete Task"
          >
            <Trash2 size={14} />
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
              className="py-2 text-sm bg-dark-800/40"
              placeholder="Subtask title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
            />
            <Button
              onClick={handleAddChild}
              className="px-3 py-2 text-sm h-full"
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
