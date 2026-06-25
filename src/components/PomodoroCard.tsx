import React, { useState, useEffect } from "react";
import { PomodoroMode, PomodoroState } from "../types";
import confetti from "canvas-confetti";
import { Play, Pause, SkipForward, RotateCcw, Flame } from "lucide-react";

interface PomodoroCardProps {
  pomodoro: PomodoroState;
  onUpdatePomodoro: (newState: Partial<PomodoroState>) => void;
  onCompletePomodoro: () => void;
}

const TIMER_DURATIONS: Record<PomodoroMode, number> = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60
};

export const PomodoroCard: React.FC<PomodoroCardProps> = ({
  pomodoro,
  onUpdatePomodoro,
  onCompletePomodoro
}) => {
  const { mode, timeLeftSeconds, isActive, completedPomodorosToday, activeTaskTitle } = pomodoro;
  const totalDuration = TIMER_DURATIONS[mode];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        onUpdatePomodoro({
          timeLeftSeconds: timeLeftSeconds - 1,
          totalFocusSecondsToday: mode === "FOCUS" ? pomodoro.totalFocusSecondsToday + 1 : pomodoro.totalFocusSecondsToday
        });
      }, 1000);
    } else if (isActive && timeLeftSeconds === 0) {
      // Timer finished!
      onUpdatePomodoro({ isActive: false });
      if (mode === "FOCUS") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onCompletePomodoro();
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeftSeconds, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const switchMode = (newMode: PomodoroMode) => {
    onUpdatePomodoro({
      mode: newMode,
      timeLeftSeconds: TIMER_DURATIONS[newMode],
      isActive: false
    });
  };

  const toggleActive = () => {
    onUpdatePomodoro({ isActive: !isActive });
  };

  const skipTimer = () => {
    onUpdatePomodoro({
      timeLeftSeconds: 0,
      isActive: false
    });
  };

  const resetTimer = () => {
    onUpdatePomodoro({
      timeLeftSeconds: totalDuration,
      isActive: false
    });
  };

  // Calculate circle dashoffset
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~440
  const progress = timeLeftSeconds / totalDuration;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="col-span-12 lg:col-span-5 row-span-3 bg-[#1a1a1a] text-white rounded-3xl p-6 flex flex-col items-center justify-between relative overflow-hidden shadow-xs min-h-[320px]">
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="w-full flex justify-between items-center z-10">
        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
          Focus Timer v2.1
        </span>
        <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[11px] font-bold">
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{completedPomodorosToday} Pomodoros</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl z-10 my-2">
        {(["FOCUS", "SHORT_BREAK", "LONG_BREAK"] as PomodoroMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              mode === m
                ? "bg-[#4f46e5] text-white shadow-xs"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {m === "FOCUS" ? "Focus" : m === "SHORT_BREAK" ? "Short" : "Long"}
          </button>
        ))}
      </div>

      {/* Circular Progress Ring & Time */}
      <div className="relative flex items-center justify-center my-2 select-none">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={mode === "FOCUS" ? "#4f46e5" : mode === "SHORT_BREAK" ? "#10b981" : "#3b82f6"}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center text-center px-4">
          <span className="text-4xl sm:text-5xl font-mono font-light tracking-tight leading-none text-white">
            {formatTime(timeLeftSeconds)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] mt-2 text-indigo-300 font-semibold truncate max-w-[130px]">
            {activeTaskTitle || (mode === "FOCUS" ? "Deep Focus" : "Rest & Recharge")}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 z-10 mt-2">
        <button
          onClick={toggleActive}
          className="px-6 py-2.5 bg-white hover:bg-gray-100 active:scale-95 text-black rounded-full text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          {isActive ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
          <span>{isActive ? "PAUSE" : "START"}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 bg-transparent hover:bg-white/10 active:scale-95 border border-white/20 rounded-full text-white transition-all cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={skipTimer}
          className="px-5 py-2.5 bg-transparent hover:bg-white/10 active:scale-95 border border-white/20 rounded-full text-xs font-bold tracking-wider uppercase text-white transition-all cursor-pointer flex items-center gap-1"
          title="Skip interval"
        >
          <span>SKIP</span>
          <SkipForward className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
