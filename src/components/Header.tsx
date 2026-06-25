import React from "react";
import { Sparkles, Plus, RefreshCw } from "lucide-react";

interface HeaderProps {
  onNewTask: () => void;
  onAIAdvice: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNewTask, onAIAdvice, isSyncing }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a0a0a]">
          AI Companion <span className="text-[#4f46e5]">Lumina</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
          <span>{today}</span>
          <span>•</span>
          <span className="text-indigo-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block"></span>
            Proactive Mode: Active
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
        <button
          onClick={onAIAdvice}
          className="bg-indigo-50 hover:bg-indigo-100 text-[#4f46e5] px-3.5 py-2 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95"
          title="Get AI Proactive Prioritization Plan"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4f46e5] animate-spin" style={{ animationDuration: '4s' }} />
          <span>AI Prioritize</span>
        </button>

        <button
          onClick={onNewTask}
          className="bg-[#0a0a0a] hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>

        <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-ping" : "bg-green-500 animate-pulse"}`}></div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
            {isSyncing ? "Syncing..." : "Synced"}
          </span>
        </div>

        <div className="w-9 h-9 bg-[#4f46e5] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs select-none">
          JD
        </div>
      </div>
    </header>
  );
};
