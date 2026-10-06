import React, { useState } from 'react';
import { OutingMemory, ItineraryPlan } from '../types/index.js';
import { Sparkles, Heart, Check, X } from 'lucide-react';

interface MemoryModalProps {
  plan: ItineraryPlan;
  isOpen: boolean;
  onClose: () => void;
  onSaveMemory: (memory: OutingMemory) => void;
}

const RATINGS = [
  { emoji: '✨', label: 'Great' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🌿', label: 'Peaceful' },
  { emoji: '😂', label: 'We laughed a lot' },
  { emoji: '❤️', label: 'One to remember' },
];

export const MemoryModal: React.FC<MemoryModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSaveMemory,
}) => {
  const [selectedRating, setSelectedRating] = useState(RATINGS[4]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMemory: OutingMemory = {
      id: `mem-${Date.now()}`,
      title: plan.title,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      companion: plan.companion,
      ratingEmoji: selectedRating.emoji,
      ratingLabel: selectedRating.label,
      note: note.trim(),
      stopsSummary: plan.stops.map((s) => s.name).join(' → '),
      createdAt: new Date().toISOString(),
    };
    onSaveMemory(newMemory);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl text-left relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-700 hover:text-stone-900 p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-800">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">
            How was your day?
          </h2>
          <p className="text-xs text-stone-700">
            Outing with <span className="font-semibold text-stone-900">{plan.companion}</span>
          </p>
        </div>

        {saved ? (
          <div className="py-8 text-center text-emerald-800">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-800" />
            </div>
            <p className="font-serif font-bold text-lg text-stone-900">
              Memory saved to your journal!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reactions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RATINGS.map((r) => {
                const isSelected = selectedRating.label === r.label;
                return (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setSelectedRating(r)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{r.emoji}</span>
                    <span className="text-xs leading-tight">{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Note Textarea */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Save a short note or favorite moment (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you talk about? What made you smile?"
                rows={3}
                className="w-full p-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900"
              >
                Skip
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                Save Memory ✨
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
