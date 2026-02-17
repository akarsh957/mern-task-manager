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
        <div className="glass-panel rounded-2xl overflow-hidden p-6 h-full flex flex-col glow-border">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-glass-200 rounded-lg text-gray-400 hover:text-white transition-all">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-glass-200 rounded-lg text-gray-400 hover:text-white transition-all">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 gap-px flex-1">
                {days.map((day, dayIdx) => {
                    const dayTasks = getTasksForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[80px] p-2 border-t border-glass-100 relative ${!isCurrentMonth ? "opacity-20" : ""
                                } ${isToday ? "bg-accent-cyan/5" : ""}`}
                        >
                            <span className={`text-sm font-medium ${isToday ? "bg-accent-cyan text-dark-900 w-6 h-6 flex items-center justify-center rounded-full font-bold" : "text-gray-400"}`}>
                                {format(day, "d")}
                            </span>

                            <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px]">
                                {dayTasks.map((task) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium truncate ${task.priority === 'High' ? 'bg-accent-rose/15 text-accent-rose' :
                                            task.priority === 'Medium' ? 'bg-accent-amber/15 text-accent-amber' :
                                                'bg-emerald-500/15 text-emerald-400'
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
