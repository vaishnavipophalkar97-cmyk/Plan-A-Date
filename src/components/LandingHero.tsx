import React from 'react';
import { Sparkles, MapPin, Clock, Compass, Heart, Coffee, Palette, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onStartPlanning: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartPlanning }) => {
  return (
    <div className="relative overflow-hidden py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtle decorative eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs font-medium text-emerald-900 mb-6">
          <Compass className="w-3.5 h-3.5 text-emerald-700" />
          <span>Real-World Outing Planner · Powered by Gemma & Open AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-6">
          Plan a day worth remembering.
        </h1>

        {/* Supporting text */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-stone-700 font-normal leading-relaxed mb-8">
          Tell us who you're with, how much time you have, and what kind of day you want. We'll take care of the rest.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col items-center justify-center gap-4 mb-5">
          <button
            onClick={onStartPlanning}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-stone-50 font-medium text-lg rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-700/50 cursor-pointer"
          >
            <span>Plan My Date</span>
            <Sparkles className="w-5 h-5 text-amber-300 transition-transform group-hover:rotate-12" />
          </button>

          {/* Secondary subtle text */}
          <p className="text-sm text-stone-700 italic max-w-md">
            “A date doesn't have to be romantic. It just means making time for someone.”
          </p>
        </div>

        {/* Philosophy micro-strip */}
        <div className="mt-12 py-3 px-6 bg-stone-100/80 rounded-xl inline-flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-700">
          <span className="font-semibold text-emerald-900">Plan</span>
          <span className="text-stone-300">→</span>
          <span className="font-semibold text-emerald-900">Go Outside</span>
          <span className="text-stone-300">→</span>
          <span className="font-semibold text-emerald-900">Experience</span>
          <span className="text-stone-300">→</span>
          <span className="font-semibold text-emerald-900">Remember</span>
        </div>
      </div>

      {/* Visual Outing Showcase Grid (Editorial cards showing genuine non-cliché dates) */}
      <div className="max-w-5xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Sibling / Playful */}
        <div className="bg-[#FAF6F0] border border-amber-200/50 rounded-2xl p-6 text-left shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-amber-900 font-medium mb-3">
            <span>With a Sibling</span>
            <span>·</span>
            <span>2–4 Hours</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
            Clay Studios & Childhood Snacks
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed mb-4">
            Hands-on pottery wheel session followed by a stop at your old favorite childhood bakery for cream buns and laughs.
          </p>
          <div className="text-xs text-stone-700 flex items-center gap-1.5 pt-3 border-t border-amber-200/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Cherry on Top: Surprising them with their favorite childhood treat</span>
          </div>
        </div>

        {/* Card 2: Best Friend / Peaceful */}
        <div className="bg-[#F4F7F4] border border-emerald-200/50 rounded-2xl p-6 text-left shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-emerald-900 font-medium mb-3">
            <span>With Best Friend</span>
            <span>·</span>
            <span>Half a Day</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
            Independent Books & Quiet Pour-Overs
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed mb-4">
            Browsing dusty second-hand book stacks on Church Street, followed by a shaded garden café and sunset lake stroll.
          </p>
          <div className="text-xs text-stone-700 flex items-center gap-1.5 pt-3 border-t border-emerald-200/40">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Cherry on Top: 3-song playlist of tracks from your first trip together</span>
          </div>
        </div>

        {/* Card 3: Someone Special / Cozy */}
        <div className="bg-[#FDF6F5] border border-rose-200/50 rounded-2xl p-6 text-left shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-rose-900 font-medium mb-3">
            <span>Someone Special</span>
            <span>·</span>
            <span>1–2 Hours</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
            Twilight Botanical Stroll & Chai
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed mb-4">
            Catching the golden hour glow beneath heritage trees before heading to an intimate corner bistro for hot chai.
          </p>
          <div className="text-xs text-stone-700 flex items-center gap-1.5 pt-3 border-t border-rose-200/40">
            <Sparkles className="w-3.5 h-3.5 text-rose-700" />
            <span>Cherry on Top: A handwritten single-sentence memory given at dusk</span>
          </div>
        </div>
      </div>

      {/* Product Principles Banner */}
      <div className="max-w-4xl mx-auto mt-16 pt-10 border-t border-stone-200/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="text-emerald-900 font-semibold text-sm mb-1">Real Places Only</div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Discovered from real local search data. No hallucinated restaurants or fictional venues.
            </p>
          </div>
          <div>
            <div className="text-emerald-900 font-semibold text-sm mb-1">Strict Time Fit</div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Got 45 minutes? You get one tight stop. Never 6 hours of plans squeezed into 1.
            </p>
          </div>
          <div>
            <div className="text-emerald-900 font-semibold text-sm mb-1">Signature Touch</div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Every outing includes a subtle, wholesome “Cherry on Top” tailored to who you're with.
            </p>
          </div>
          <div>
            <div className="text-emerald-900 font-semibold text-sm mb-1">Touch Grass Mode</div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Once planned, hit “I'm heading out”. The screen gets minimal so you can be present.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
