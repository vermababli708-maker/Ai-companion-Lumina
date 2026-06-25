import React from "react";
import { Task } from "../types";
import { Sparkles, Calendar as CalendarIcon } from "lucide-react";

interface CalendarCardProps {
  tasks: Task[];
  onOpenTasksModal: () => void;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({ tasks, onOpenTasksModal }) => {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dayNum = today.getDate();

  const nextUpcomingTask = tasks.find((t) => !t.completed) || {
    title: "Evening Review Session",
    deadline: "7:00 PM",
    category: "Study"
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div
      onClick={onOpenTasksModal}
      className="col-span-12 lg:col-span-5 row-span-1 bg-white border border-gray-200 hover:border-indigo-200 rounded-3xl p-5 flex items-center justify-between shadow-xs transition-all cursor-pointer group min-h-[90px]"
    >
      <div className="flex items-center gap-4 min-w-0 flex-grow">
        <div className="flex flex-col items-center justify-center bg-gray-50 group-hover:bg-indigo-50/60 px-3.5 py-2 rounded-2xl border border-gray-100 transition-colors shrink-0">
          <span className="text-[10px] font-extrabold text-gray-400 group-hover:text-indigo-600">{dayName}</span>
          <span className="text-xl font-black text-[#0a0a0a] group-hover:text-indigo-950 leading-none mt-0.5">{dayNum}</span>
        </div>

        <div className="h-10 w-[1px] bg-gray-100 shrink-0"></div>

        <div className="min-w-0 flex-grow pr-2">
          <div className="flex items-center gap-1.5">
            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#4f46e5] transition-colors">
              {nextUpcomingTask.title}
            </p>
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5 flex items-center gap-1 truncate">
            <span>{nextUpcomingTask.deadline}</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 inline" /> Lumina Assistant
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center -space-x-2 shrink-0">
        <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-2xs">
          📚
        </div>
        <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700 shadow-2xs">
          ⏱️
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-indigo-600 group-hover:text-white border-2 border-white flex items-center justify-center transition-colors shadow-2xs">
          <span className="text-[9px] font-black">+{pendingCount}</span>
        </div>
      </div>
    </div>
  );
};
