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
import { LogOut, Plus, Search, LayoutDashboard, Calendar, Settings, Sparkles } from "lucide-react";
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
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-glass-200 border-t-accent-cyan"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-2 border-transparent border-b-accent-violet" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[150px] animate-glow-pulse"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-accent-violet/8 rounded-full blur-[150px] animate-glow-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-accent-rose/5 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-glass-200 z-10 flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-glass-200">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-cyan" size={24} />
            <h1 className="text-2xl font-bold text-gradient">TaskFlow</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant={view === "list" ? "primary" : "ghost"}
            className={`w-full justify-start ${view === "list" ? "" : "text-gray-400 hover:text-white hover:bg-glass-100"}`}
            onClick={() => setView("list")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Button>
          <Button
            variant={view === "calendar" ? "primary" : "ghost"}
            className={`w-full justify-start ${view === "calendar" ? "" : "text-gray-400 hover:text-white hover:bg-glass-100"}`}
            onClick={() => setView("calendar")}
          >
            <Calendar size={18} />
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 z-10 overflow-y-auto relative h-screen">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {view === "list" ? "My Tasks" : "Calendar View"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {view === "list" ? "Manage your projects and subtasks efficiently" : "Visualize your schedule"}
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <Input
                placeholder="Search tasks..."
                className="pl-10 py-2.5 bg-dark-800/40 border-glass-200"
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
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  {/* Add task form */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex gap-3">
                      <Input
                        className="flex-1"
                        placeholder="Add a new task..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRoot()}
                      />
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="bg-dark-800/60 border border-glass-200 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/40 transition-all text-sm"
                      >
                        <option value="Low" className="bg-dark-800 text-white">Low Priority</option>
                        <option value="Medium" className="bg-dark-800 text-white">Medium Priority</option>
                        <option value="High" className="bg-dark-800 text-white">High Priority</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <Input
                        type="date"
                        className="flex-1"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                      <Button onClick={handleAddRoot} className="w-1/3">
                        <Plus size={18} />
                        Add Task
                      </Button>
                    </div>
                  </div>

                  {/* Task list */}
                  <div className="space-y-2 min-h-[400px]">
                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-glass-200 rounded-2xl">
                        <LayoutDashboard size={40} className="mb-4 opacity-30" />
                        <p className="text-sm">No tasks yet. Create your first one above!</p>
                      </div>
                    ) : (
                      <motion.div layout className="space-y-1">
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

              {/* Quick Stats Panel */}
              <div className="glass-panel rounded-2xl p-6 h-fit sticky top-8 glow-border">
                <h3 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-accent-cyan" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="bg-dark-800/40 p-4 rounded-xl border border-glass-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan rounded-r"></div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider ml-2">Total Tasks</p>
                    <p className="text-2xl font-bold text-white ml-2 mt-1">{flatTasks.length}</p>
                  </div>
                  <div className="bg-dark-800/40 p-4 rounded-xl border border-glass-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r"></div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider ml-2">Completed</p>
                    <p className="text-2xl font-bold text-emerald-400 ml-2 mt-1">
                      {flatTasks.filter(t => t.status === "Completed").length}
                    </p>
                  </div>
                  <div className="bg-dark-800/40 p-4 rounded-xl border border-glass-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-rose rounded-r"></div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider ml-2">High Priority</p>
                    <p className="text-2xl font-bold text-accent-rose ml-2 mt-1">
                      {flatTasks.filter(t => t.priority === "High").length}
                    </p>
                  </div>
                  <div className="bg-dark-800/40 p-4 rounded-xl border border-glass-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-amber rounded-r"></div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider ml-2">In Progress</p>
                    <p className="text-2xl font-bold text-accent-amber ml-2 mt-1">
                      {flatTasks.filter(t => t.status === "Pending").length}
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
