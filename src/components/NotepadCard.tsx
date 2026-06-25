import React, { useState, useEffect } from "react";
import { Sparkles, BookOpen } from "lucide-react";

interface NotepadCardProps {
  notepad: string;
  onChangeNotepad: (text: string) => void;
  onGenerateFlashcardsFromNotes: (text: string) => void;
}

export const NotepadCard: React.FC<NotepadCardProps> = ({
  notepad,
  onChangeNotepad,
  onGenerateFlashcardsFromNotes
}) => {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeNotepad(e.target.value);
    setSaveStatus("Saving...");
  };

  useEffect(() => {
    if (saveStatus === "Saving...") {
      const timer = setTimeout(() => {
        setSaveStatus("Last saved just now");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notepad, saveStatus]);

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 bg-[#fdf2f8] border border-pink-100 rounded-3xl p-6 flex flex-col justify-between shadow-xs min-h-[220px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-bold text-pink-900 uppercase tracking-tight">Quick Scratchpad</h3>
        </div>

        <button
          onClick={() => onGenerateFlashcardsFromNotes(notepad)}
          disabled={!notepad.trim()}
          className="bg-white/80 hover:bg-white text-pink-700 hover:text-pink-900 disabled:opacity-40 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border border-pink-200/80 shadow-2xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
          title="Turn notes into study flashcards using AI"
        >
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>Flashcards</span>
        </button>
      </div>

      <textarea
        value={notepad}
        onChange={handleChange}
        className="w-full flex-grow bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-pink-950 focus:ring-0 placeholder:text-pink-300 min-h-[100px] custom-scrollbar"
        placeholder="Capture study notes, lecture insights, or quick reminders..."
      />

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-pink-200/40">
        <span className="text-[10px] text-pink-500/80 font-medium flex items-center gap-1">
          <BookOpen className="w-3 h-3 inline" />
          Capture for Lumina AI context
        </span>
        <p className="text-[10px] text-pink-400 text-right font-mono font-medium">
          {saveStatus}
        </p>
      </div>
    </div>
  );
};
