import React from "react";

interface FooterProps {
  sessionMinutes: number;
  onOpenOverview: () => void;
  onOpenStudyHub: () => void;
  onOpenAnalytics: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  sessionMinutes,
  onOpenOverview,
  onOpenStudyHub,
  onOpenAnalytics,
  onOpenSettings
}) => {
  const hours = Math.floor(sessionMinutes / 60);
  const mins = sessionMinutes % 60;
  const sessionStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <footer className="mt-6 pt-4 border-t border-gray-200/60 flex flex-wrap items-center justify-between px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-4">
      <div className="flex gap-6">
        <button
          onClick={onOpenOverview}
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Overview
        </button>
        <button
          onClick={onOpenStudyHub}
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Study Hub
        </button>
        <button
          onClick={onOpenAnalytics}
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Analytics
        </button>
        <button
          onClick={onOpenSettings}
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Settings
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span>Session: {sessionStr}</span>
        <span className="text-gray-200">|</span>
        <span className="text-green-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          System Optimal
        </span>
      </div>
    </footer>
  );
};
