import React, { useState } from 'react';
import { ItineraryPlan } from '../types/index.js';
import { ExternalLink, ArrowRight, ArrowLeft, Heart, Sparkles, Check } from 'lucide-react';

interface TouchGrassModeProps {
  plan: ItineraryPlan;
  onFinishOuting: () => void;
  onExitTouchGrass: () => void;
}

export const TouchGrassMode: React.FC<TouchGrassModeProps> = ({
  plan,
  onFinishOuting,
  onExitTouchGrass,
}) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const currentStop = plan.stops[currentStopIndex] || plan.stops[0];
  const isLastStop = currentStopIndex >= plan.stops.length - 1;

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-2xl mx-auto px-6 py-10 sm:py-16 text-center animate-in fade-in duration-300">
      {/* Top minimal bar */}
      <div className="flex items-center justify-between text-xs text-stone-700">
        <button
          onClick={onExitTouchGrass}
          className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors py-1 px-2 rounded-md focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Full Itinerary</span>
        </button>
        <span className="font-semibold tracking-wider uppercase text-emerald-950">
          Stop {currentStopIndex + 1} of {plan.stops.length}
        </span>
      </div>

      {/* Center Main Stop Card */}
      <div className="my-auto py-8">
        <div className="text-xs uppercase font-bold tracking-widest text-emerald-900 mb-3">
          {currentStopIndex === 0 ? 'STARTING WITH' : 'NEXT STOP'}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-3">
          {currentStop.name}
        </h1>

        <div className="flex items-center justify-center gap-2 text-sm text-stone-700 font-medium mb-4">
          <span>{currentStop.time}</span>
          <span>·</span>
          <span>{currentStop.duration}</span>
          <span>·</span>
          <span>{currentStop.distance}</span>
        </div>

        <p className="text-sm text-stone-700 max-w-md mx-auto mb-6">
          {currentStop.address}
        </p>

        {/* Minimal Navigation Button */}
        {currentStop.mapUrl && (
          <div className="mb-8">
            <a
              href={currentStop.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Stop Tip */}
        {currentStop.tips && (
          <div className="text-xs text-stone-700 italic max-w-md mx-auto mb-10 px-4 py-2.5 bg-stone-100/70 rounded-xl">
            💡 {currentStop.tips}
          </div>
        )}

        {/* Stop Progression Controls */}
        <div className="flex items-center justify-center gap-3">
          {currentStopIndex > 0 && (
            <button
              onClick={() => setCurrentStopIndex((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 rounded-xl bg-white"
            >
              Previous Stop
            </button>
          )}

          {!isLastStop ? (
            <button
              onClick={() => setCurrentStopIndex((prev) => prev + 1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Next Stop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onFinishOuting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>We Finished Our Day 🌿</span>
            </button>
          )}
        </div>
      </div>

      {/* The Core Reminder */}
      <div className="border-t border-stone-200/60 pt-6">
        <p className="font-serif text-lg sm:text-xl font-bold text-stone-900 mb-1">
          Put your phone away. Enjoy the moment. ❤️
        </p>
        <p className="text-xs text-stone-700">
          The screen was the shortest part. The memory is what remains.
        </p>
      </div>
    </div>
  );
};
