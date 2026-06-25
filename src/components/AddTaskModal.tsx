import React, { useState } from "react";
import { Task, UrgencyLevel } from "../types";
import { X, Plus, Clock, Sparkles } from "lucide-react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, "id">) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("Today, 5:00 PM");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [category, setCategory] = useState<Task["category"]>("Study");
  const [urgency, setUrgency] = useState<UrgencyLevel>("HIGH");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      deadline,
      estimatedMinutes: Number(estimatedMinutes) || 25,
      completed: false,
      progress: 0,
      category,
      urgency
    });

    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-gray-200 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-[#0a0a0a] flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#4f46e5]" />
            <span>Add Proactive Task</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Calculus Practice Set #3"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4f46e5] outline-none text-sm font-semibold text-gray-800 transition-colors"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#4f46e5] outline-none text-xs font-semibold text-gray-800"
                />
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Est. Minutes
              </label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                step={5}
                min={5}
                max={480}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#4f46e5] outline-none text-xs font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 outline-none"
              >
                <option value="Study">Study</option>
                <option value="Research">Research</option>
                <option value="Project">Project</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 outline-none"
              >
                <option value="CRITICAL">🔴 Critical</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🔵 Medium</option>
                <option value="LOW">⚪ Low</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
