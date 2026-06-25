import React, { useState } from "react";
import { FlashcardSet } from "../types";
import { X, Sparkles, Plus, Layers, BookOpen } from "lucide-react";

interface StudyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcardSets: FlashcardSet[];
  activeSetId: string;
  onSelectSet: (setId: string) => void;
  onAddSet: (newSet: FlashcardSet) => void;
}

export const StudyHubModal: React.FC<StudyHubModalProps> = ({
  isOpen,
  onClose,
  flashcardSets,
  activeSetId,
  onSelectSet,
  onAddSet
}) => {
  const [activeTab, setActiveTab] = useState<"DECKS" | "GENERATE">("DECKS");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !notes.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, sourceText: notes })
      });

      if (!res.ok) throw new Error("Generation request failed");

      const data = await res.json();
      const newSet: FlashcardSet = {
        id: `deck-${Date.now()}`,
        title: data.title || topic || "AI Generated Deck",
        subject: "Study Hub",
        cards: (data.cards || []).map((c: any, i: number) => ({
          id: `fc-${Date.now()}-${i}`,
          front: c.front,
          back: c.back,
          mastered: false
        }))
      };

      if (newSet.cards.length > 0) {
        onAddSet(newSet);
        onSelectSet(newSet.id);
        onClose();
      } else {
        setError("AI returned no flashcards. Try more descriptive notes!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate flashcards.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-gray-200 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#0a0a0a] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Study Hub & Flashcard AI</span>
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab("DECKS")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "DECKS" ? "bg-white text-blue-800 shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Decks ({flashcardSets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("GENERATE")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "GENERATE" ? "bg-blue-600 text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generator</span>
          </button>
        </div>

        {activeTab === "DECKS" ? (
          <div className="space-y-2.5 overflow-y-auto flex-grow pr-1">
            {flashcardSets.map((deck) => {
              const mastered = deck.cards.filter((c) => c.mastered).length;
              const isSelected = deck.id === activeSetId;

              return (
                <div
                  key={deck.id}
                  onClick={() => {
                    onSelectSet(deck.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-400 shadow-xs"
                      : "bg-white border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{deck.title}</p>
                      {isSelected && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-extrabold">ACTIVE</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Subject: {deck.subject} • {mastered}/{deck.cards.length} Mastered
                    </p>
                  </div>
                  <button className="text-xs font-bold text-blue-600 bg-blue-100/60 hover:bg-blue-200/80 px-3 py-1.5 rounded-xl transition-colors">
                    Study
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => setActiveTab("GENERATE")}
              className="w-full py-3.5 border-2 border-dashed border-blue-200 rounded-2xl text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Deck with AI</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Topic / Exam Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Organic Chemistry Reactions"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Paste Study Notes or Lecture Summary
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Paste raw notes, notepad scratchpad, or article text here for Lumina to extract active recall questions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-xs font-medium leading-relaxed resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
                  {error}
                </p>
              )}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isGenerating || (!topic.trim() && !notes.trim())}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Lumina Generating Deck...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Active Recall Deck</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
