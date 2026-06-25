import React from "react";
import { Task, InsightsData } from "../types";
import { Sparkles, CheckCircle2, Circle, Clock, Split, Trash2, ArrowRight } from "lucide-react";

interface PrioritizationCardProps {
  tasks: Task[];
  insights: InsightsData;
  onToggleTask: (taskId: string) => void;
  onStartTask: (task: Task) => void;
  onBreakdownTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  companionMessage: string;
}

export const PrioritizationCard: React.FC<PrioritizationCardProps> = ({
  tasks,
  insights,
  onToggleTask,
  onStartTask,
  onBreakdownTask,
  onDeleteTask,
  companionMessage
}) => {
  const activeTasks = tasks.filter((t) => !t.completed);
  const criticalCount = activeTasks.filter((t) => t.urgency === "CRITICAL" || t.urgency === "HIGH").length;

  return (
    <div className="col-span-12 lg:col-span-7 row-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col h-full">
      {/* Card Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-lg font-bold flex items-center gap-2.5 text-[#0a0a0a]">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4f46e5]">
            <Sparkles className="w-4 h-4 text-[#4f46e5]" />
          </div>
          <span>Proactive Prioritization</span>
        </h2>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold tracking-wide">
          {criticalCount} {criticalCount === 1 ? "PRIORITY ITEM" : "PRIORITY ITEMS"}
        </span>
      </div>

      {/* Companion Proactive Quote Banner */}
      {companionMessage && (
        <div className="mb-4 p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#4f46e5] mt-1.5 shrink-0 animate-pulse"></div>
          <p className="text-xs font-medium text-indigo-950 italic leading-relaxed">
            <span className="font-bold not-italic text-indigo-800">Lumina Nudge: </span>
            "{companionMessage}"
          </p>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-grow max-h-[360px] min-h-[220px]">
        {tasks.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-2xl my-4">
            <p className="text-sm font-semibold text-gray-400">No pending tasks. Add a task or generate study flashcards!</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isCritical = task.urgency === "CRITICAL" && !task.completed;
            const isHigh = task.urgency === "HIGH" && !task.completed;

            return (
              <div
                key={task.id}
                className={`p-4 transition-all duration-200 group ${
                  task.completed
                    ? "bg-gray-50/70 border border-gray-100 opacity-60 rounded-xl"
                    : isCritical
                    ? "bg-red-50/80 border-l-4 border-red-500 rounded-r-xl border-y border-r border-red-100 shadow-xs"
                    : isHigh
                    ? "bg-amber-50/50 border-l-4 border-amber-500 rounded-r-xl border-y border-r border-amber-100 shadow-xs"
                    : "bg-white border border-gray-200/80 hover:border-indigo-200 rounded-xl shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-grow min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                      title={task.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`text-sm font-bold truncate ${
                            task.completed ? "line-through text-gray-500" : isCritical ? "text-red-950" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          task.category === "Study" ? "bg-blue-100 text-blue-800" :
                          task.category === "Research" ? "bg-purple-100 text-purple-800" :
                          task.category === "Project" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-700"
                        }`}>
                          {task.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {task.deadline}
                        </span>
                        <span>•</span>
                        <span>{task.estimatedMinutes} mins</span>
                      </div>

                      {/* Proactive AI Tip for Critical Items */}
                      {isCritical && (
                        <p className="text-xs text-red-700 mt-2 italic bg-white/60 p-2 rounded-lg border border-red-200/60">
                          ⚡ Lumina: "Low retention detected on recent quizzes. Practice flashcards now before deadline."
                        </p>
                      )}

                      {/* Progress Bar for In-Progress Tasks */}
                      {task.progress !== undefined && task.progress > 0 && !task.completed && (
                        <div className="mt-2.5">
                          <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                            <span>PROGRESS</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#4f46e5] h-full transition-all duration-500 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Pomodoro Effort Dots */}
                      {task.urgency === "MEDIUM" && !task.completed && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Pomodoro Blocks:</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500/40"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!task.completed && (
                      <>
                        <button
                          onClick={() => onBreakdownTask(task)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="AI Breakdown into Pomodoro subtasks"
                        >
                          <Split className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onStartTask(task)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-transform ${
                            isCritical
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-[#4f46e5] hover:bg-indigo-700 text-white"
                          }`}
                        >
                          <span>Start</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtasks if broken down */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100/80 pl-8 space-y-1.5">
                    {task.subtasks.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${st.completed ? "bg-green-500" : "bg-indigo-300"}`}></div>
                        <span className={st.completed ? "line-through text-gray-400" : ""}>{st.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Insights Dashboard Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Insights Dashboard</p>
        <div className="grid grid-cols-3 gap-3 mt-2.5">
          <div className="text-center bg-gray-50/80 p-2.5 rounded-2xl">
            <p className="text-xl sm:text-2xl font-black text-[#0a0a0a]">{insights.focusScore}%</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Focus Score</p>
          </div>
          <div className="text-center bg-gray-50/80 p-2.5 rounded-2xl border-x border-gray-100">
            <p className="text-xl sm:text-2xl font-black text-[#0a0a0a]">{insights.tasksAvoided}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Tasks Completed</p>
          </div>
          <div className="text-center bg-indigo-50/80 p-2.5 rounded-2xl">
            <p className="text-xl sm:text-2xl font-black text-[#4f46e5]">+{insights.savedHours}h</p>
            <p className="text-[10px] text-indigo-700 font-bold uppercase mt-0.5">Saved Weekly</p>
          </div>
        </div>
      </div>
    </div>
  );
};
