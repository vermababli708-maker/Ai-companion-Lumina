import React, { useState, useEffect } from "react";
import { Task } from "../types";
import { X, Sparkles, Split, ArrowRight, CheckCircle2 } from "lucide-react";

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onApplySubtasks: (taskId: string, subtasks: { id: string; title: string; completed: boolean }[]) => void;
  onStartPomodoroForSubtask: (task: Task, subtaskTitle: string) => void;
}

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  onClose,
  task,
  onApplySubtasks,
  onStartPomodoroForSubtask
}) => {
  const [subtasks, setSubtasks] = useState<{ title: string; pomodoros: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && task) {
      if (task.subtasks && task.subtasks.length > 0) {
        setSubtasks(task.subtasks.map((st) => ({ title: st.title, pomodoros: 1 })));
        return;
      }

      setIsLoading(true);
      setError("");

      fetch("/api/breakdown-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskTitle: task.title, deadline: task.deadline })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.subtasks) {
            setSubtasks(data.subtasks);
          } else {
            setSubtasks([
              { title: `Prepare resources for ${task.title}`, pomodoros: 1 },
              { title: "Execute core work interval", pomodoros: 2 },
              { title: "Final review & quality check", pomodoros: 1 }
            ]);
          }
        })
        .catch((err) => {
          setError("Could not generate breakdown. Using default template.");
          setSubtasks([
            { title: `Initial preparation for ${task.title}`, pomodoros: 1 },
            { title: "Deep focus execution block", pomodoros: 2 },
            { title: "Review and mark complete", pomodoros: 1 }
          ]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleSaveToTask = () => {
    const formatted = subtasks.map((st, i) => ({
      id: `st-${Date.now()}-${i}`,
      title: `${st.title} (${st.pomodoros} Pomodoros)`,
      completed: false
    }));
    onApplySubtasks(task.id, formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-gray-200 shadow-xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
              AI POMODORO PLANNER
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-1">{task.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#4f46e5] animate-spin" />
            <p className="text-xs font-bold text-gray-700">Lumina is carving this task into 25-minute Pomodoro sprints...</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-1 flex-grow my-2">
            <p className="text-xs text-gray-500 font-medium">
              Estimated effort breakdown before <span className="font-bold text-gray-800">{task.deadline}</span>:
            </p>

            {subtasks.map((st, i) => (
              <div
                key={i}
                className="p-3.5 bg-gray-50 hover:bg-indigo-50/50 border border-gray-100 hover:border-indigo-200 rounded-2xl flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="min-w-0 flex-grow">
                  <p className="text-xs font-bold text-gray-900 truncate">{st.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: st.pomodoros || 1 }).map((_, di) => (
                      <span key={di} className="w-2 h-2 rounded-full bg-[#4f46e5]"></span>
                    ))}
                    <span className="text-[10px] font-mono text-gray-500 ml-1.5">
                      {st.pomodoros * 25} mins
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onStartPomodoroForSubtask(task, st.title);
                    onClose();
                  }}
                  className="bg-white group-hover:bg-[#4f46e5] text-[#4f46e5] group-hover:text-white border border-indigo-200 group-hover:border-transparent px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Focus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex gap-2 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleSaveToTask}
            disabled={isLoading || subtasks.length === 0}
            className="flex-1 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Split className="w-3.5 h-3.5" />
            <span>Save Sprints to Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
