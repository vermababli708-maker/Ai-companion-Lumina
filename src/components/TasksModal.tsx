import React, { useState } from "react";
import { Task } from "../types";
import { X, CheckCircle2, Circle, Clock, Plus, Trash2, Calendar as CalendarIcon, Filter } from "lucide-react";

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTaskModal: () => void;
}

export const TasksModal: React.FC<TasksModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenAddTaskModal
}) => {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "PENDING") return !t.completed;
    if (filter === "COMPLETED") return t.completed;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-gray-200 shadow-xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#0a0a0a] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#4f46e5]" />
            <span>Schedule & All Tasks ({tasks.length})</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAddTaskModal();
              }}
              className="bg-[#0a0a0a] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl mb-3 shrink-0">
          {(["ALL", "PENDING", "COMPLETED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === f ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {f === "ALL" ? `All (${tasks.length})` : f === "PENDING" ? `Pending (${tasks.filter(t => !t.completed).length})` : "Done"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2.5 overflow-y-auto flex-grow pr-1 my-1">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-gray-400">No tasks match this view.</p>
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  t.completed ? "bg-gray-50/60 border-gray-100 opacity-60" : "bg-white border-gray-200 shadow-2xs hover:border-indigo-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-grow">
                  <button onClick={() => onToggleTask(t.id)} className="text-gray-400 hover:text-indigo-600 cursor-pointer shrink-0">
                    {t.completed ? <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="min-w-0 flex-grow">
                    <p className={`text-xs font-bold truncate ${t.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.deadline}</span>
                      <span>•</span>
                      <span>{t.estimatedMinutes}m</span>
                      <span>•</span>
                      <span className="font-bold text-indigo-600">{t.urgency}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(t.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
