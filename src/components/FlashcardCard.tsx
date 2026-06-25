import React, { useState } from "react";
import { FlashcardSet } from "../types";
import { Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Layers } from "lucide-react";

interface FlashcardCardProps {
  flashcardSets: FlashcardSet[];
  activeSetId: string;
  onSelectSet: (setId: string) => void;
  onToggleMastered: (setId: string, cardId: string) => void;
  onOpenDeckModal: () => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({
  flashcardSets,
  activeSetId,
  onSelectSet,
  onToggleMastered,
  onOpenDeckModal
}) => {
  const activeSet = flashcardSets.find((s) => s.id === activeSetId) || flashcardSets[0];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!activeSet || activeSet.cards.length === 0) {
    return (
      <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 bg-[#f0f9ff] border border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xs min-h-[220px]">
        <Layers className="w-8 h-8 text-blue-400 mb-2" />
        <p className="text-xs font-bold text-blue-900">No Flashcards Available</p>
        <button
          onClick={onOpenDeckModal}
          className="mt-3 py-1.5 px-3 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Create Deck
        </button>
      </div>
    );
  }

  const safeIndex = currentIndex % activeSet.cards.length;
  const currentCard = activeSet.cards[safeIndex];
  const masteredCount = activeSet.cards.filter((c) => c.mastered).length;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeSet.cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeSet.cards.length) % activeSet.cards.length);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 bg-[#f0f9ff] border border-blue-100 rounded-3xl p-6 flex flex-col justify-between shadow-xs min-h-[220px] relative overflow-hidden group">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-1 rounded tracking-wide uppercase">
            STUDY MODE
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDeckModal}
            className="text-[10px] bg-white hover:bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold transition-all cursor-pointer truncate max-w-[85px]"
            title="Switch or manage decks"
          >
            {activeSet.title}
          </button>
          <span className="text-[10px] text-blue-500 font-mono font-bold shrink-0">
            {safeIndex + 1}/{activeSet.cards.length}
          </span>
        </div>
      </div>

      {/* Flashcard Interactive Flip Area */}
      <div
        onClick={toggleFlip}
        className="my-3 flex-grow flex flex-col justify-center cursor-pointer select-none p-3 rounded-2xl bg-white/70 hover:bg-white border border-blue-100/80 transition-all shadow-2xs relative min-h-[110px]"
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
            {isFlipped ? "💡 Card Back (Answer):" : "❓ Card Front (Question):"}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMastered(activeSet.id, currentCard.id);
            }}
            className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              currentCard.mastered
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{currentCard.mastered ? "Mastered" : "Learn"}</span>
          </button>
        </div>

        <p className={`text-sm sm:text-base font-bold transition-colors ${
          isFlipped ? "text-indigo-950 font-semibold" : "text-blue-950"
        } leading-snug`}>
          {isFlipped ? currentCard.back : currentCard.front}
        </p>

        <span className="text-[9px] text-blue-400 absolute bottom-1.5 right-2 font-mono flex items-center gap-1 opacity-70">
          <RotateCw className="w-2.5 h-2.5 inline" /> Click to flip
        </span>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={handlePrev}
          className="p-2 bg-white hover:bg-blue-50 text-blue-700 rounded-xl border border-blue-200/80 shadow-2xs cursor-pointer active:scale-95 transition-all"
          title="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFlip}
          className="flex-grow py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer active:scale-95 text-center tracking-wider uppercase"
        >
          {isFlipped ? "SHOW QUESTION" : "REVEAL ANSWER"}
        </button>

        <button
          onClick={handleNext}
          className="p-2 bg-white hover:bg-blue-50 text-blue-700 rounded-xl border border-blue-200/80 shadow-2xs cursor-pointer active:scale-95 transition-all"
          title="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
