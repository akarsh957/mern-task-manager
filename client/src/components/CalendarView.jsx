import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const CalendarView = ({ tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getTasksForDay = (day) => {
        return tasks.filter((task) => {
            if (!task.dueDate) return false;
            return isSameDay(parseISO(task.dueDate), day);
        });
    };

    return (
        <div className="bg-glass-100 backdrop-blur-xl border border-glass-200 rounded-2xl shadow-xl overflow-hidden p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-glass-200 rounded-lg text-white transition">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-glass-200 rounded-lg text-white transition">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 gap-px flex-1">
                {days.map((day, dayIdx) => {
                    const dayTasks = getTasksForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[80px] p-2 border-t border-glass-200 relative ${!isCurrentMonth ? "opacity-30 bg-black/10" : "bg-transparent"
                                }`}
                        >
                            <span className={`text-sm ${isSameDay(day, new Date()) ? "bg-accent-blue text-white w-6 h-6 flex items-center justify-center rounded-full" : "text-gray-300"}`}>
                                {format(day, "d")}
                            </span>

                            <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                                {dayTasks.map((task) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`text-[10px] px-1 py-0.5 rounded truncate border ${task.priority === 'High' ? 'bg-red-500/20 border-red-500/30 text-red-200' :
                                                task.priority === 'Medium' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200' :
                                                    'bg-green-500/20 border-green-500/30 text-green-200'
                                            }`}
                                        title={task.title}
                                    >
                                        {task.title}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
