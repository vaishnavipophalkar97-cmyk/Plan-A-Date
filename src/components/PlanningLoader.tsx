import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, MapPin, Clock, Heart } from 'lucide-react';

interface PlanningLoaderProps {
  locationName: string;
  companion: string;
}

const STEPS = [
  'Querying real-world places & spots near your starting area...',
  'Checking open hours and travel distances between candidates...',
  'Gemma reasoning about flow, pacing, and companion compatibility...',
  'Composing timeline story and handpicking your Cherry on Top...',
];

export const PlanningLoader: React.FC<PlanningLoaderProps> = ({
  locationName,
  companion,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in duration-300">
      {/* Decorative animated icon */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-emerald-100/80 animate-ping opacity-30" />
        <div className="relative w-16 h-16 rounded-2xl bg-emerald-800 text-amber-50 flex items-center justify-center shadow-md">
          <Compass className="w-8 h-8 text-emerald-100 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
        Crafting your outing with {companion}
      </h2>
      <p className="text-sm text-stone-700 mb-8">
        Starting around <span className="font-semibold text-emerald-950">{locationName}</span>
      </p>

      {/* Progress Checklist */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 text-left shadow-2xs space-y-3.5 mb-8">
        {STEPS.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? 'text-stone-700'
                  : isCurrent
                  ? 'text-emerald-950 font-medium scale-[1.01]'
                  : 'text-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-700 text-white'
                    : isCurrent
                    ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-800/30'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span>{stepText}</span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-stone-700 italic">
        “Search discovers reality. Gemma organizes reality.”
      </div>
    </div>
  );
};
