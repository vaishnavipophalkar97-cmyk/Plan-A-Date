import React, { useState } from 'react';
import {
  ItineraryPlan,
  ItineraryStop,
  QuestionnaireState,
} from '../../types/index.js';
import { InteractiveMap } from './InteractiveMap.js';
import {
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  Coffee,
  Palette,
  Trees,
  Footprints,
} from 'lucide-react';

interface ItineraryViewProps {
  plan: ItineraryPlan;
  questionnaire: QuestionnaireState;
  onHeadOut: () => void;
  onPlanAgain: () => void;
  onRefine: (refinementLabel: string) => Promise<void>;
  isRefining: boolean;
}

const REFINEMENTS = [
  '💰 Cheaper',
  '🌿 More nature',
  '🎨 More creative',
  '🍜 More food',
  '🚶 Less travel',
  '✨ More memorable',
  '😌 More relaxed',
  '🎲 Surprise me',
];

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  plan,
  questionnaire,
  onHeadOut,
  onPlanAgain,
  onRefine,
  isRefining,
}) => {
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(0);
  const [whyOpen, setWhyOpen] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyPlan = () => {
    const textLines = [
      `🌿 Outing Plan: ${plan.title}`,
      `With: ${plan.companion} · Duration: ${plan.total_duration}`,
      `Starting from: ${plan.locationName}`,
      '',
      ...plan.stops.map(
        (s) =>
          `${s.time} - ${s.name} (${s.type})\n📍 ${s.address}\n💡 ${s.tips}\n`
      ),
      `✨ Cherry on Top: ${plan.cherry_on_top.gesture}`,
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('café') || t.includes('coffee')) return <Coffee className="w-4 h-4 text-amber-700" />;
    if (t.includes('art') || t.includes('pottery') || t.includes('craft'))
      return <Palette className="w-4 h-4 text-purple-700" />;
    if (t.includes('nature') || t.includes('park')) return <Trees className="w-4 h-4 text-emerald-700" />;
    if (t.includes('walk')) return <Footprints className="w-4 h-4 text-stone-700" />;
    return <Compass className="w-4 h-4 text-emerald-700" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200/80">
        <button
          onClick={onPlanAgain}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md p-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Plan Another Date</span>
        </button>

        <div className="flex items-center gap-2">
          {plan.isDemoMode && (
            <span className="text-[11px] font-medium text-amber-900 bg-amber-100/90 border border-amber-200/80 px-2 py-0.5 rounded-md">
              Curated Verified Catalog Mode
            </span>
          )}

          <button
            onClick={handleCopyPlan}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Share Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Main Outing Hero Card */}
      <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs mb-8 text-left">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-700 font-medium mb-3">
          <span className="text-emerald-950 font-semibold">{plan.companion}</span>
          <span>·</span>
          <span>{plan.total_duration}</span>
          <span>·</span>
          <span>{plan.estimated_total_cost}</span>
          <span>·</span>
          <span>{plan.date} at {plan.startTime}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-3">
          {plan.title}
        </h1>

        <p className="text-base sm:text-lg text-emerald-950/80 font-normal mb-4">
          {plan.subtitle}
        </p>

        <p className="text-sm text-stone-700 max-w-3xl leading-relaxed mb-6">
          {plan.summary}
        </p>

        {/* Travel & Flow Note */}
        {plan.travel_notes && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-100/90 rounded-xl text-xs text-stone-700">
            <Footprints className="w-3.5 h-3.5 text-emerald-800" />
            <span>{plan.travel_notes}</span>
          </div>
        )}
      </div>

      {/* Grid: Timeline and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Timeline Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              The Journey Timeline
            </h2>
            <span className="text-xs text-stone-700">
              {plan.stops.length} thoughtful stops
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-emerald-800/30 space-y-8">
            {plan.stops.map((stop, index) => {
              const isSelected = activeStopIndex === index;
              return (
                <div
                  key={stop.order}
                  onClick={() => setActiveStopIndex(index)}
                  className={`relative group cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-[1.01]' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Step Marker Pin on line */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all shadow-xs ${
                      isSelected
                        ? 'bg-emerald-800 ring-4 ring-emerald-100 scale-110'
                        : 'bg-stone-700 hover:bg-emerald-800'
                    }`}
                  >
                    {stop.order}
                  </div>

                  {/* Stop Card */}
                  <div
                    className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-800/50 shadow-sm'
                        : 'bg-[#FAF8F5] border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-stone-100/90 text-stone-700">
                          {getCategoryIcon(stop.type)}
                        </span>
                        <span className="text-xs font-semibold text-emerald-950 uppercase tracking-wide">
                          {stop.time} · {stop.duration}
                        </span>
                      </div>
                      <div className="text-xs text-stone-700 font-medium">
                        {stop.estimated_cost}
                      </div>
                    </div>

                    {/* Place Name & Distance */}
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-emerald-950 transition-colors">
                        {stop.name}
                      </h3>
                      <span className="text-xs text-stone-700 shrink-0">
                        {stop.distance}
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 mb-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                      <span className="line-clamp-1">{stop.address}</span>
                    </div>

                    {/* Reasoning */}
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                      {stop.reason}
                    </p>

                    {/* Tips & External link */}
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-emerald-950 font-normal italic flex items-center gap-1.5">
                        <span className="font-semibold not-italic text-emerald-900">Tip:</span>
                        <span>{stop.tips}</span>
                      </div>

                      {stop.mapUrl && (
                        <a
                          href={stop.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-emerald-900 hover:text-emerald-950 font-medium hover:underline ml-auto"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map & Context Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-20 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Interactive Route Map
                </h3>
                <span className="text-xs text-stone-700">Click pins to inspect</span>
              </div>
              <InteractiveMap
                stops={plan.stops}
                activeStopIndex={activeStopIndex}
                onSelectStop={(idx) => setActiveStopIndex(idx)}
                startLocation={{
                  name: plan.locationName,
                  lat: questionnaire.location.lat,
                  lng: questionnaire.location.lng,
                }}
              />
            </div>

            {/* "Why We Picked This" Accordion */}
            <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl overflow-hidden">
              <button
                onClick={() => setWhyOpen(!whyOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-800" />
                  <span className="font-serif font-bold text-sm text-stone-900">
                    Why we picked this plan
                  </span>
                </div>
                {whyOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-700" />
                )}
              </button>
              {whyOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-200/60">
                  {plan.why_this_plan}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Feature: CHERRY ON TOP */}
      <div className="bg-gradient-to-br from-[#FFFBF5] via-[#FFF9F2] to-[#FAF5EE] border border-amber-300/60 rounded-3xl p-6 sm:p-8 shadow-xs mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-amber-200/20 select-none pointer-events-none">
          <Sparkles className="w-32 h-32" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Signature Touch · Cherry on Top</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            {plan.cherry_on_top.gesture}
          </h3>

          <p className="text-sm text-stone-700 leading-relaxed max-w-2xl mb-4">
            {plan.cherry_on_top.why}
          </p>

          {plan.cherry_on_top.optional_gift && (
            <div className="text-xs text-amber-950 font-medium bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 inline-block">
              <span className="font-semibold text-amber-900">Thoughtful idea:</span>{' '}
              {plan.cherry_on_top.optional_gift}
            </div>
          )}
        </div>
      </div>

      {/* "Make It More..." Refinement Buttons */}
      <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-6 mb-10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
            Make it more...
          </h4>
          <span className="text-xs text-stone-700">Quickly refine this outing</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {REFINEMENTS.map((refine) => (
            <button
              key={refine}
              onClick={() => onRefine(refine)}
              disabled={isRefining}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-emerald-700 text-stone-800 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              {refine}
            </button>
          ))}
        </div>
        {isRefining && (
          <div className="text-xs text-emerald-950 font-medium mt-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin" />
            <span>Gemma is adjusting your itinerary according to your refinement...</span>
          </div>
        )}
      </div>

      {/* Primary Big CTA: "I'm heading out 🌿" */}
      <div className="text-center py-6">
        <button
          onClick={onHeadOut}
          className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>🌿 I'm heading out</span>
          <ArrowRight className="w-5 h-5 text-amber-300 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="text-xs text-stone-700 mt-3 italic">
          Switch to Touch Grass Mode: Put your phone away and be present.
        </p>
      </div>
    </div>
  );
};
