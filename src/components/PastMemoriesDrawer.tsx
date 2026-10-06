import React from 'react';
import { OutingMemory } from '../types/index.js';
import { X, Trash2, Heart, Calendar, BookOpen, Compass } from 'lucide-react';

interface PastMemoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memories: OutingMemory[];
  onDeleteMemory: (id: string) => void;
}

export const PastMemoriesDrawer: React.FC<PastMemoriesDrawerProps> = ({
  isOpen,
  onClose,
  memories,
  onDeleteMemory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-2xs flex justify-end">
      <div className="bg-[#FAF8F5] w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-6 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Outing Memories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100"
            aria-label="Close memories drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {memories.length === 0 ? (
            <div className="text-center py-16 text-stone-700">
              <Compass className="w-10 h-10 mx-auto mb-3 text-stone-300" />
              <p className="font-serif text-lg font-bold text-stone-800 mb-1">
                No memories saved yet
              </p>
              <p className="text-xs text-stone-700 max-w-xs mx-auto">
                Once you finish an outing and click "I'm heading out", you can jot down what made the day memorable.
              </p>
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs relative group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{mem.ratingEmoji}</span>
                    <span className="text-xs font-semibold text-emerald-950 uppercase tracking-wide">
                      {mem.ratingLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-700">{mem.date}</span>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="text-stone-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-base mb-1">
                  {mem.title}
                </h3>

                <div className="text-xs text-stone-700 mb-2">
                  With {mem.companion}
                </div>

                {mem.stopsSummary && (
                  <div className="text-[11px] text-stone-700 mb-2 italic line-clamp-1">
                    📍 {mem.stopsSummary}
                  </div>
                )}

                {mem.note && (
                  <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    “{mem.note}”
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200/80 text-center text-xs text-stone-700 bg-stone-100/60">
          Saved locally on your device
        </div>
      </div>
    </div>
  );
};
