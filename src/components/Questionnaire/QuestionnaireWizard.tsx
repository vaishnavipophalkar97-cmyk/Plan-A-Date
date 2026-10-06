import React, { useState } from 'react';
import {
  CompanionType,
  DurationOption,
  MoodOption,
  ActivityOption,
  BudgetOption,
  DistanceOption,
  QuestionnaireState,
  LocationData,
} from '../../types/index.js';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Check,
  Users,
  Navigation,
  Calendar,
  Search,
} from 'lucide-react';

interface QuestionnaireWizardProps {
  onComplete: (data: QuestionnaireState) => void;
  onCancel: () => void;
}

const COMPANIONS: { label: CompanionType; emoji: string; desc: string }[] = [
  { label: '❤️ Someone special' as CompanionType, emoji: '❤️', desc: 'Partner, date, or someone you love' },
  { label: '🫶 Best friend' as CompanionType, emoji: '🫶', desc: 'Unfiltered laughter, deep talks, zero pretense' },
  { label: '👯 Friend' as CompanionType, emoji: '👯', desc: 'Catching up, exploring, and sharing good food' },
  { label: '🏡 Family' as CompanionType, emoji: '🏡', desc: 'Parents, elders, or whole family outings' },
  { label: '🧑🤝🧑 Sibling' as CompanionType, emoji: '🧑🤝🧑', desc: 'Nostalgic banter and fun mischief' },
  { label: '🎉 Friend group' as CompanionType, emoji: '🎉', desc: 'High energy, communal tables, group fun' },
  { label: "🌱 Someone I'm getting to know" as CompanionType, emoji: '🌱', desc: 'Low pressure, natural conversation starters' },
  { label: '✨ Surprise me' as CompanionType, emoji: '✨', desc: 'Keep options flexible and delightful' },
];

const DURATIONS: { label: DurationOption; hint: string }[] = [
  { label: '45 minutes', hint: '1 focused stop + optional takeaway' },
  { label: '1–2 hours', hint: '1 main activity + short secondary stop' },
  { label: '2–4 hours', hint: '2–3 balanced stops with breathing room' },
  { label: '4–6 hours', hint: 'Connected afternoon journey' },
  { label: 'Half a day', hint: 'Morning or evening immersive flow' },
  { label: 'Full day', hint: 'Morning → afternoon → sunset journey' },
  { label: 'Custom duration', hint: 'Set your specific time window' },
];

const MOODS: { value: MoodOption; emoji: string }[] = [
  { value: 'Peaceful', emoji: '🌿' },
  { value: 'Cozy', emoji: '☕' },
  { value: 'Creative', emoji: '🎨' },
  { value: 'Adventurous', emoji: '🚲' },
  { value: 'Fun & playful', emoji: '😂' },
  { value: 'Foodie', emoji: '🍜' },
  { value: 'Scenic', emoji: '🌅' },
  { value: 'Memorable', emoji: '✨' },
  { value: 'Slow & relaxing', emoji: '🧘' },
  { value: 'Surprise me', emoji: '🎲' },
];

const ACTIVITIES: { value: ActivityOption; emoji: string }[] = [
  { value: 'Nature', emoji: '🌿' },
  { value: 'Cafés', emoji: '☕' },
  { value: 'Food', emoji: '🍜' },
  { value: 'Art & crafts', emoji: '🎨' },
  { value: 'Pottery', emoji: '🏺' },
  { value: 'Cycling', emoji: '🚲' },
  { value: 'Walking', emoji: '🚶' },
  { value: 'Movies', emoji: '🎬' },
  { value: 'Events', emoji: '🎭' },
  { value: 'Games', emoji: '🎮' },
  { value: 'Shopping', emoji: '🛍️' },
  { value: 'Photography', emoji: '📸' },
  { value: 'Sunset / scenic spots', emoji: '🌅' },
  { value: 'Parks', emoji: '🌳' },
  { value: 'Offbeat places', emoji: '🔎' },
  { value: 'Surprise me', emoji: '✨' },
];

const BUDGETS: BudgetOption[] = [
  'Free',
  'Under ₹300/person',
  '₹300–₹500/person',
  '₹500–₹1,000/person',
  '₹1,000–₹2,000/person',
  '₹2,000+/person',
  'No preference',
];

const DISTANCES: DistanceOption[] = [
  'Within 2 km',
  'Within 5 km',
  'Within 10 km',
  'Anywhere nearby',
];

const POPULAR_CITIES: LocationData[] = [
  { name: 'Indore (Vaishali Nagar / Central), MP', lat: 22.6808, lng: 75.8331 },
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai, Maharashtra', lat: 18.9220, lng: 72.8347 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
];

export const QuestionnaireWizard: React.FC<QuestionnaireWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 8;

  // Form State
  const [companion, setCompanion] = useState<CompanionType | ''>('');
  const [duration, setDuration] = useState<DurationOption | ''>('2–4 hours');
  const [customDurationHours, setCustomDurationHours] = useState<number>(3);
  const [moods, setMoods] = useState<MoodOption[]>(['Cozy', 'Peaceful']);
  const [activities, setActivities] = useState<ActivityOption[]>(['Cafés', 'Nature']);
  const [budget, setBudget] = useState<BudgetOption | ''>('₹500–₹1,000/person');
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [distance, setDistance] = useState<DistanceOption | ''>('Within 5 km');
  const [dateChoice, setDateChoice] = useState<'Today' | 'Tomorrow' | 'Choose a date'>('Today');
  const [customDate, setCustomDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('11:00 AM');
  const [location, setLocation] = useState<LocationData>({
    name: 'Indore (Vaishali Nagar / Central), MP',
    lat: 22.6808,
    lng: 75.8331,
  });

  interface LocationSuggestion {
    displayName: string;
    name: string;
    subTitle: string;
    lat: number;
    lng: number;
  }

  const [locationSearching, setLocationSearching] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualCityInput, setManualCityInput] = useState<string>('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

  // Handle Location Detection
  const handleDetectLocation = () => {
    setLocationSearching(true);
    setLocationError(null);
    setLocationSuggestions([]);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode with OpenStreetMap Nominatim for accurate neighborhood/city name
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'User-Agent': 'PlanADateApp/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || '';
            const city = addr.city || addr.town || addr.municipality || addr.county || 'Indore';
            const state = addr.state || '';

            const parts = [neighborhood, city, state].filter(Boolean);
            const displayName = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(', ') || 'Current Location';

            setLocation({
              name: displayName,
              lat: latitude,
              lng: longitude,
              isCurrentLocation: true,
            });
          } else {
            setLocation({
              name: `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
              lat: latitude,
              lng: longitude,
              isCurrentLocation: true,
            });
          }
        } catch {
          setLocation({
            name: `Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
            lat: latitude,
            lng: longitude,
            isCurrentLocation: true,
          });
        } finally {
          setLocationSearching(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError(
          err.code === 1
            ? 'Location access was declined. You can pick a city or enter one below.'
            : 'Unable to pinpoint current location. Please choose a city below.'
        );
        setLocationSearching(false);
      },
      { timeout: 8000 }
    );
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCityInput.trim()) return;

    setLocationSearching(true);
    setLocationError(null);
    setLocationSuggestions([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          manualCityInput.trim()
        )}&limit=5&addressdetails=1`,
        { headers: { 'User-Agent': 'PlanADateApp/1.0' } }
      );

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const suggestions: LocationSuggestion[] = data.map((item: any) => {
            const addr = item.address || {};
            const placeTitle = item.name || addr.suburb || addr.neighbourhood || addr.city || manualCityInput;
            const subtitleParts = [
              addr.city || addr.town || addr.county,
              addr.state,
              addr.country,
            ].filter(Boolean);

            return {
              displayName: item.display_name,
              name: placeTitle,
              subTitle: subtitleParts.join(', ') || item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            };
          });

          setLocationSuggestions(suggestions);

          // If user specifically typed "Indore" or there's an exact match in Indore, prioritize it
          const indoreMatch = suggestions.find(
            (s) =>
              s.displayName.toLowerCase().includes('indore') ||
              s.subTitle.toLowerCase().includes('indore')
          );

          if (manualCityInput.toLowerCase().includes('indore') && indoreMatch) {
            setLocation({
              name: `${indoreMatch.name}, ${indoreMatch.subTitle}`,
              lat: indoreMatch.lat,
              lng: indoreMatch.lng,
            });
            setLocationSuggestions([]);
            setManualCityInput('');
          } else if (suggestions.length === 1) {
            const first = suggestions[0];
            setLocation({
              name: `${first.name}, ${first.subTitle}`,
              lat: first.lat,
              lng: first.lng,
            });
            setLocationSuggestions([]);
            setManualCityInput('');
          }
        } else {
          setLocationError(`Could not find "${manualCityInput}". Try typing "Vaishali Nagar Indore" or picking Indore from the presets.`);
        }
      }
    } catch {
      // Fallback
      setLocation({
        name: manualCityInput,
        lat: 22.6808,
        lng: 75.8331,
      });
    } finally {
      setLocationSearching(false);
    }
  };

  const toggleMood = (m: MoodOption) => {
    if (m === 'Surprise me') {
      setMoods(['Surprise me']);
      return;
    }
    const filtered = moods.filter((item) => item !== 'Surprise me');
    if (filtered.includes(m)) {
      setMoods(filtered.filter((item) => item !== m));
    } else {
      setMoods([...filtered, m]);
    }
  };

  const toggleActivity = (a: ActivityOption) => {
    if (a === 'Surprise me') {
      setActivities(['Surprise me']);
      return;
    }
    const filtered = activities.filter((item) => item !== 'Surprise me');
    if (filtered.includes(a)) {
      setActivities(filtered.filter((item) => item !== a));
    } else {
      setActivities([...filtered, a]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!companion;
      case 2:
        return !!duration;
      case 3:
        return moods.length > 0;
      case 4:
        return activities.length > 0;
      case 5:
        return !!budget;
      case 6:
        return !!distance;
      case 7:
        return !!dateChoice && !!startTime;
      case 8:
        return !!location?.name;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        companion,
        duration,
        customDurationHours: duration === 'Custom duration' ? customDurationHours : undefined,
        moods,
        activities,
        budget,
        peopleCount,
        distance,
        dateChoice,
        customDate,
        startTime,
        location,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Back to Overview' : 'Previous Step'}</span>
          </button>
          <div className="text-xs font-semibold text-stone-700 tracking-wider">
            STEP {step} OF {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-800 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Container */}
      <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs min-h-[460px] flex flex-col justify-between">
        <div>
          {/* STEP 1: COMPANION */}
          {step === 1 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Who are you spending the day with?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                A date is any intentional time with someone you care about.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPANIONS.map((item) => {
                  const isSelected = companion === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setCompanion(item.label)}
                      className={`text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50/70 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <div className="font-medium text-stone-900 text-sm">{item.label}</div>
                        <div className="text-xs text-stone-700 mt-0.5">{item.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-800 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DURATION */}
          {step === 2 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                How much time do you have together?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                We strictly respect your time window. Never 6 hours squeezed into 1.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {DURATIONS.map((item) => {
                  const isSelected = duration === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setDuration(item.label)}
                      className={`text-left p-4 rounded-xl border transition-all duration-150 flex items-start justify-between focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50/70 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-stone-900 text-base">{item.label}</div>
                        <div className="text-xs text-stone-700 mt-1">{item.hint}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-800 mt-1" />}
                    </button>
                  );
                })}
              </div>

              {duration === 'Custom duration' && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl mt-3 flex items-center gap-4">
                  <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-amber-950 mb-1">
                      Set Duration: {customDurationHours} Hours
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="0.5"
                      value={customDurationHours}
                      onChange={(e) => setCustomDurationHours(parseFloat(e.target.value))}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: MOOD */}
          {step === 3 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                What kind of day are you imagining?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                Pick as many moods as match your current energy.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {MOODS.map((item) => {
                  const isSelected = moods.includes(item.value);
                  return (
                    <button
                      key={item.value}
                      onClick={() => toggleMood(item.value)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-medium'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      <span className="text-sm">{item.emoji} {item.value}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: ACTIVITIES */}
          {step === 4 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                What would you like to do?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                Select your preferred activities. Gemma will search for real candidates matching these.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {ACTIVITIES.map((item) => {
                  const isSelected = activities.includes(item.value);
                  return (
                    <button
                      key={item.value}
                      onClick={() => toggleActivity(item.value)}
                      className={`text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-medium shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      <span className="text-sm truncate">{item.emoji} {item.value}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: BUDGET & PEOPLE */}
          {step === 5 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                What's your comfortable budget?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                Meaningful outings don't need huge spending. Choose what feels right.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {BUDGETS.map((item) => {
                  const isSelected = budget === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setBudget(item)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50/70 font-medium text-emerald-950'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      <span className="text-sm">{item}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                    </button>
                  );
                })}
              </div>

              {/* Number of People Counter */}
              <div className="p-4 bg-stone-100/70 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-700" />
                  <span className="text-xs font-medium text-stone-900">Total People in Group:</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-50"
                  >
                    -
                  </button>
                  <span className="font-semibold text-stone-900 text-sm min-w-[20px] text-center">
                    {peopleCount}
                  </span>
                  <button
                    onClick={() => setPeopleCount(Math.min(12, peopleCount + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: TRAVEL DISTANCE */}
          {step === 6 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                How far are you willing to go?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                We prioritize close-knit clusters so you spend time together, not in traffic.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DISTANCES.map((item) => {
                  const isSelected = distance === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setDistance(item)}
                      className={`text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50/70 font-medium text-emerald-950 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      <span className="text-base">{item}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: DATE & TIME */}
          {step === 7 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                When are you going?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                We cross-reference opening hours so you never encounter closed doors.
              </p>

              {/* Day Selector */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {(['Today', 'Tomorrow', 'Choose a date'] as const).map((d) => {
                  const isSelected = dateChoice === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDateChoice(d)}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-medium'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {dateChoice === 'Choose a date' && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-stone-700 mb-1">Pick Specific Date</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              )}

              {/* Start Time Presets */}
              <div className="mb-2">
                <label className="block text-xs font-medium text-stone-700 mb-2">Approximate Start Time</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['9:30 AM', '11:00 AM', '3:30 PM', '6:00 PM'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setStartTime(t)}
                      className={`p-2.5 text-xs rounded-lg border transition-all ${
                        startTime === t
                          ? 'border-emerald-800 bg-emerald-50 font-medium text-emerald-950'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: LOCATION */}
          {step === 8 && (
            <div className="animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Where should we start?
              </h2>
              <p className="text-sm text-stone-700 mb-6">
                We discover real spots near your starting area.
              </p>

              {/* Explicit Geolocation Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locationSearching}
                className="w-full p-4 mb-4 rounded-xl border border-emerald-800/40 bg-emerald-50/70 hover:bg-emerald-100/60 transition-all flex items-center justify-center gap-2.5 text-emerald-950 font-medium cursor-pointer"
              >
                <Navigation className={`w-4 h-4 text-emerald-800 ${locationSearching ? 'animate-spin' : ''}`} />
                <span>
                  {locationSearching ? 'Locating your current coordinates...' : '📍 Use my current location'}
                </span>
              </button>

              {/* Manual City/Neighborhood Search */}
              <form onSubmit={handleManualSearch} className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-700" />
                    <input
                      type="text"
                      placeholder="Or search city, area or landmark..."
                      value={manualCityInput}
                      onChange={(e) => setManualCityInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!manualCityInput.trim()}
                    className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 disabled:opacity-40"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Location Suggestions Disambiguation Dropdown */}
              {locationSuggestions.length > 0 && (
                <div className="mb-4 bg-white border border-stone-200 rounded-2xl p-2.5 shadow-sm">
                  <div className="text-[11px] font-semibold text-stone-700 px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching locations found ({locationSuggestions.length}):</span>
                    <button
                      type="button"
                      onClick={() => setLocationSuggestions([])}
                      className="text-stone-700 hover:text-stone-900 text-xs lowercase"
                    >
                      clear
                    </button>
                  </div>
                  <div className="space-y-1.5 mt-1">
                    {locationSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setLocation({
                            name: `${sug.name}, ${sug.subTitle}`,
                            lat: sug.lat,
                            lng: sug.lng,
                          });
                          setLocationSuggestions([]);
                          setManualCityInput('');
                        }}
                        className="w-full text-left p-3 hover:bg-emerald-50/80 border border-stone-100 hover:border-emerald-300 rounded-xl transition-all flex items-start gap-3 group cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-950">
                            {sug.name}
                          </div>
                          <div className="text-[11px] text-stone-700 line-clamp-1">
                            {sug.subTitle}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-md shrink-0">
                          Use This ➔
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {locationError && (
                <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mb-3">
                  {locationError}
                </div>
              )}

              {/* Quick Presets */}
              <div className="mb-4">
                <div className="text-xs font-medium text-stone-700 mb-2">Popular Starting Hubs</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_CITIES.map((c) => {
                    const isSelected = location.name.includes(c.name.split(',')[0]);
                    return (
                      <button
                        key={c.name}
                        onClick={() => setLocation(c)}
                        className={`text-left p-2.5 text-xs rounded-lg border transition-all ${
                          isSelected
                            ? 'border-emerald-800 bg-emerald-50 font-semibold text-emerald-950'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Location Pill */}
              <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span className="font-medium text-stone-900">Starting from:</span>
                  <span className="font-semibold text-emerald-950">{location.name}</span>
                </div>
                {location.isCurrentLocation && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                    GPS Active
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 pt-5 border-t border-stone-200/80 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-xs font-medium text-stone-700 hover:text-stone-900 py-2.5 px-4 rounded-lg"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-sm rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{step === totalSteps ? 'Compose My Outing ✨' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
