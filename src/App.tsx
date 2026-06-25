/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Task, FlashcardSet, PomodoroState, InsightsData } from "./types";
import { DEFAULT_TASKS, DEFAULT_FLASHCARDS, DEFAULT_NOTEPAD } from "./data";
import { Header } from "./components/Header";
import { PrioritizationCard } from "./components/PrioritizationCard";
import { PomodoroCard } from "./components/PomodoroCard";
import { NotepadCard } from "./components/NotepadCard";
import { FlashcardCard } from "./components/FlashcardCard";
import { CalendarCard } from "./components/CalendarCard";
import { Footer } from "./components/Footer";
import { AddTaskModal } from "./components/AddTaskModal";
import { StudyHubModal } from "./components/StudyHubModal";
import { BreakdownModal } from "./components/BreakdownModal";
import { TasksModal } from "./components/TasksModal";

export default function App() {
  // Core Application States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("lumina_tasks");
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(() => {
    const saved = localStorage.getItem("lumina_flashcards");
    return saved ? JSON.parse(saved) : DEFAULT_FLASHCARDS;
  });

  const [activeSetId, setActiveSetId] = useState<string>("calc-set");

  const [notepad, setNotepad] = useState<string>(() => {
    const saved = localStorage.getItem("lumina_notepad");
    return saved !== null ? saved : DEFAULT_NOTEPAD;
  });

  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    mode: "FOCUS",
    timeLeftSeconds: 20 * 60 + 42, // matching exact 20:42 visual mockup
    isActive: false,
    totalFocusSecondsToday: 105 * 60, // 1h 45m
    completedPomodorosToday: 3,
    activeTaskTitle: "Midterm Flashcard Set: Calculus II"
  });

  const [insights, setInsights] = useState<InsightsData>({
    focusScore: 84,
    tasksCompleted: tasks.filter((t) => t.completed).length,
    tasksAvoided: 12,
    savedHours: 2.4
  });

  const [companionMessage, setCompanionMessage] = useState<string>(
    'Low retention detected on recent quizzes. Practice flashcards now before 4 PM deadline.'
  );

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isStudyHubOpen, setIsStudyHubOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [selectedTaskForBreakdown, setSelectedTaskForBreakdown] = useState<Task | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem("lumina_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("lumina_flashcards", JSON.stringify(flashcardSets));
  }, [flashcardSets]);

  useEffect(() => {
    localStorage.setItem("lumina_notepad", notepad);
  }, [notepad]);

  // AI Proactive Prioritization Trigger
  const handleTriggerAIAdvice = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/proactive-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          notepad,
          flashcardSets,
          focusMinutesToday: Math.round(pomodoro.totalFocusSecondsToday / 60)
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.companionMessage) {
          setCompanionMessage(data.companionMessage);
        }
        if (data.insights) {
          setInsights((prev) => ({
            ...prev,
            focusScore: data.insights.focusScore || prev.focusScore,
            tasksAvoided: data.insights.tasksAvoided || prev.tasksAvoided,
            savedHours: data.insights.savedHours || prev.savedHours
          }));
        }
      }
    } catch (e) {
      console.error("AI Advice sync error", e);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTaskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`
    };
    setTasks((prev) => [newTask, ...prev]);
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 600);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleStartTask = (task: Task) => {
    setPomodoro((prev) => ({
      ...prev,
      mode: "FOCUS",
      timeLeftSeconds: 25 * 60,
      isActive: true,
      activeTaskTitle: task.title
    }));
  };

  const handleBreakdownTask = (task: Task) => {
    setSelectedTaskForBreakdown(task);
    setIsBreakdownOpen(true);
  };

  const handleApplySubtasks = (taskId: string, subtasks: { id: string; title: string; completed: boolean }[]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks } : t))
    );
  };

  // Flashcards Handlers
  const handleAddFlashcardSet = (newSet: FlashcardSet) => {
    setFlashcardSets((prev) => [newSet, ...prev]);
  };

  const handleToggleMastered = (setId: string, cardId: string) => {
    setFlashcardSets((prev) =>
      prev.map((set) => {
        if (set.id !== setId) return set;
        return {
          ...set,
          cards: set.cards.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c))
        };
      })
    );
  };

  // Pomodoro Handlers
  const handleUpdatePomodoro = (newState: Partial<PomodoroState>) => {
    setPomodoro((prev) => ({ ...prev, ...newState }));
  };

  const handleCompletePomodoro = () => {
    setPomodoro((prev) => ({
      ...prev,
      completedPomodorosToday: prev.completedPomodorosToday + 1,
      mode: "SHORT_BREAK",
      timeLeftSeconds: 5 * 60,
      isActive: false
    }));
  };

  // Notepad to Flashcards trigger
  const handleGenerateFlashcardsFromNotes = (notesText: string) => {
    setIsStudyHubOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] p-4 sm:p-6 font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <div className="w-full max-w-[1140px] mx-auto flex flex-col flex-grow">
        {/* Header Bar */}
        <Header
          onNewTask={() => setIsAddTaskOpen(true)}
          onAIAdvice={handleTriggerAIAdvice}
          isSyncing={isSyncing}
        />

        {/* Main Dashboard Bento Grid */}
        <main className="grid grid-cols-12 lg:grid-rows-6 gap-4 flex-grow my-1">
          {/* AI RECOMMENDATIONS & PRIORITIES (Left Large: col-span-7 row-span-4) */}
          <PrioritizationCard
            tasks={tasks}
            insights={insights}
            onToggleTask={handleToggleTask}
            onStartTask={handleStartTask}
            onBreakdownTask={handleBreakdownTask}
            onDeleteTask={handleDeleteTask}
            companionMessage={companionMessage}
          />

          {/* POMODORO TIMER (Top Right: col-span-5 row-span-3) */}
          <PomodoroCard
            pomodoro={pomodoro}
            onUpdatePomodoro={handleUpdatePomodoro}
            onCompletePomodoro={handleCompletePomodoro}
          />

          {/* QUICK NOTEPAD (Bottom Left: col-span-4 row-span-2) */}
          <NotepadCard
            notepad={notepad}
            onChangeNotepad={setNotepad}
            onGenerateFlashcardsFromNotes={handleGenerateFlashcardsFromNotes}
          />

          {/* FLASHCARD PREVIEW (Middle Center: col-span-3 row-span-2) */}
          <FlashcardCard
            flashcardSets={flashcardSets}
            activeSetId={activeSetId}
            onSelectSet={setActiveSetId}
            onToggleMastered={handleToggleMastered}
            onOpenDeckModal={() => setIsStudyHubOpen(true)}
          />

          {/* CALENDAR MINI (Bottom Right: col-span-5 row-span-1) */}
          <CalendarCard
            tasks={tasks}
            onOpenTasksModal={() => setIsTasksModalOpen(true)}
          />
        </main>

        {/* Footer Bar */}
        <Footer
          sessionMinutes={Math.round(pomodoro.totalFocusSecondsToday / 60)}
          onOpenOverview={() => setIsTasksModalOpen(true)}
          onOpenStudyHub={() => setIsStudyHubOpen(true)}
          onOpenAnalytics={handleTriggerAIAdvice}
          onOpenSettings={() => setIsTasksModalOpen(true)}
        />
      </div>

      {/* Modals Layer */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <StudyHubModal
        isOpen={isStudyHubOpen}
        onClose={() => setIsStudyHubOpen(false)}
        flashcardSets={flashcardSets}
        activeSetId={activeSetId}
        onSelectSet={setActiveSetId}
        onAddSet={handleAddFlashcardSet}
      />

      <BreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => {
          setIsBreakdownOpen(false);
          setSelectedTaskForBreakdown(null);
        }}
        task={selectedTaskForBreakdown}
        onApplySubtasks={handleApplySubtasks}
        onStartPomodoroForSubtask={(t, stTitle) => {
          setPomodoro((prev) => ({
            ...prev,
            mode: "FOCUS",
            timeLeftSeconds: 25 * 60,
            isActive: true,
            activeTaskTitle: `${t.title}: ${stTitle}`
          }));
        }}
      />

      <TasksModal
        isOpen={isTasksModalOpen}
        onClose={() => setIsTasksModalOpen(false)}
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onOpenAddTaskModal={() => setIsAddTaskOpen(true)}
      />
    </div>
  );
}
