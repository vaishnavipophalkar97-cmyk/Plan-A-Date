import React from 'react';
import { Compass, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onOpenMemories: () => void;
  memoriesCount: number;
  isLiveMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenMemories,
  memoriesCount,
  isLiveMode = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-1"
          aria-label="Go to Plan A Date home"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-50 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Compass className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors">
              Plan A Date
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-normal text-stone-700">
              Go outside · Make memories
            </span>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Subtle real-world discovery indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
            <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isLiveMode ? 'Live Discovery Active' : 'Curated Verified Places'}</span>
          </div>

          <button
            onClick={onOpenMemories}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-lg shadow-2xs transition-all focus-visible:ring-2 focus-visible:ring-emerald-700"
            title="View saved memories"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>Memories</span>
            {memoriesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-full">
                {memoriesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
