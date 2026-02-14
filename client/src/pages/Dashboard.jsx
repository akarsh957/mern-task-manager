import { useEffect, useState, useContext } from "react";
import {
  getTaskTree,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";
import TaskNode from "../components/TaskNode";
import Assistant from "../components/Assistant";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import CalendarView from "../components/CalendarView";
import SettingsDropdown from "../components/SettingsDropdown";
import { LogOut, Plus, Search, LayoutDashboard, Calendar, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list"); // 'list' | 'calendar'

  const { state, dispatch } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await getTaskTree();
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (Array.isArray(res.data?.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to load task tree", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddRoot = async () => {
    if (!title.trim()) return;
    await createTask({ title, priority, dueDate });
    setTitle("");
    setDueDate("");
    fetchTasks();
  };

  const handleAddChild = async (title, parentId) => {
    try {
      await createTask({ title, parentId });
      fetchTasks();
    } catch (err) {
      console.error("Failed to add subtask:", err);
      // Optionally set an error state here to show a notification
    }
  };

  const handleUpdate = async (id, data) => {
    await updateTask(id, data);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Flatten tasks for Calendar view
  const getAllTasksFlat = (nodes) => {
    let flat = [];
    nodes.forEach(node => {
      flat.push(node);
      if (node.children?.length > 0) {
        flat = flat.concat(getAllTasksFlat(node.children));
      }
    });
    return flat;
  };

  const flatTasks = getAllTasksFlat(tasks);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      </div>

      <aside className="w-64 glass-panel border-r border-glass-200 z-10 flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-glass-200">
          <h1 className="text-2xl font-bold text-gradient">TaskFlow</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={view === "list" ? "primary" : "ghost"}
            className={`w-full justify-start ${view === "list" ? "" : "text-white hover:bg-glass-100"}`}
            onClick={() => setView("list")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Button>
          <Button
            variant={view === "calendar" ? "primary" : "ghost"}
            className={`w-full justify-start ${view === "calendar" ? "" : "text-white hover:bg-glass-100"}`}
            onClick={() => setView("calendar")}
          >
            <Calendar size={20} />
            Calendar
          </Button>
        </nav>

        <div className="p-4 border-t border-glass-200">
          <SettingsDropdown
            user={state?.user}
            onLogout={() => dispatch({ type: "LOGOUT" })}
          />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 z-10 overflow-y-auto relative h-screen">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {view === "list" ? "My Tasks" : "Calendar View"}
            </h2>
            <p className="text-gray-400">
              {view === "list" ? "Manage your projects and subtasks efficiently" : "Visualize your schedule"}
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search tasks..."
                className="pl-10 py-2 bg-glass-200/50 border-glass-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:hidden">
              <SettingsDropdown
                user={state?.user}
                onLogout={() => dispatch({ type: "LOGOUT" })}
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex gap-4">
                      <Input
                        className="flex-1"
                        placeholder="New root task title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRoot()}
                      />
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="bg-glass-100 border border-glass-200 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                      >
                        <option value="Low" className="text-black">Low Priority</option>
                        <option value="Medium" className="text-black">Medium Priority</option>
                        <option value="High" className="text-black">High Priority</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <Input
                        type="date"
                        className="flex-1 input-date-dark"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                      <Button onClick={handleAddRoot} className="w-1/3">
                        <Plus size={20} />
                        Add Task
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 min-h-[400px]">
                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-glass-200 rounded-xl">
                        <LayoutDashboard size={48} className="mb-4 opacity-50" />
                        <p>No tasks found. Start by adding one!</p>
                      </div>
                    ) : (
                      <motion.div layout className="space-y-2">
                        {filteredTasks.map((task) => (
                          <TaskNode
                            key={task._id}
                            task={task}
                            onAdd={handleAddChild}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="bg-glass-100/50 backdrop-blur-sm rounded-2xl p-6 border border-glass-200 h-fit sticky top-8">
                <h3 className="text-xl font-bold mb-4 text-white">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="bg-glass-200 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">{flatTasks.length}</p>
                  </div>
                  <div className="bg-glass-200 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-green-400">
                      {flatTasks.filter(t => t.status === "Completed").length}
                    </p>
                  </div>
                  <div className="bg-glass-200 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">High Priority</p>
                    <p className="text-2xl font-bold text-red-400">
                      {flatTasks.filter(t => t.priority === "High").length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-[calc(100vh-140px)]"
            >
              <CalendarView tasks={flatTasks} />
            </motion.div>
          )}
        </AnimatePresence>

        <Assistant tasks={flatTasks} />
      </main>
    </div>
  );
};

export default Dashboard;
