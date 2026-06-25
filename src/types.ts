export type UrgencyLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ActionType = "FLASHCARDS" | "TASK" | "POMODORO";

export interface Task {
  id: string;
  title: string;
  deadline: string; // ISO or human readable like "Today 4:00 PM"
  estimatedMinutes: number;
  completed: boolean;
  progress?: number; // 0 - 100
  category: "Study" | "Project" | "Admin" | "Research";
  urgency: UrgencyLevel;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface PriorityItem {
  id: string;
  title: string;
  urgency: UrgencyLevel;
  reason: string;
  actionType: ActionType;
  targetId?: string;
  progress?: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export interface FlashcardSet {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
}

export type PomodoroMode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export interface PomodoroState {
  mode: PomodoroMode;
  timeLeftSeconds: number;
  isActive: boolean;
  totalFocusSecondsToday: number;
  completedPomodorosToday: number;
  activeTaskTitle: string;
}

export interface InsightsData {
  focusScore: number;
  tasksCompleted: number;
  tasksAvoided: number;
  savedHours: number;
}
