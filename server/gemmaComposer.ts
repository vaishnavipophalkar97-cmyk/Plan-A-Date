import { GoogleGenAI } from '@google/genai';
import {
  ItineraryPlan,
  ItineraryStop,
  PlaceCandidate,
  QuestionnaireState,
} from '../src/types/index.js';

// Fallback composer if Gemma / Gemini API call fails or key is missing
export function buildDeterministicItinerary(
  input: QuestionnaireState,
  candidates: PlaceCandidate[],
  refinementNote?: string
): ItineraryPlan {
  const companion = input.companion || 'Friend';
  const duration = input.duration || '2–4 hours';
  const locationName = input.location?.name || 'Local Area';
  const startTime = input.startTime || '10:30 AM';

  // Determine stop count based on duration
  let stopCount = 2;
  if (duration === '45 minutes') stopCount = 1;
  else if (duration === '1–2 hours') stopCount = 2;
  else if (duration === '2–4 hours') stopCount = 3;
  else if (duration === '4–6 hours') stopCount = 3;
  else if (duration === 'Half a day') stopCount = 3;
  else if (duration === 'Full day') stopCount = 4;

  const validStops = candidates.slice(0, Math.min(stopCount, candidates.length));

  // Time calculation helper
  const [startHourStr, startMinPart] = startTime.split(':');
  let currentHour = parseInt(startHourStr, 10) || 10;
  const isPM = startTime.toLowerCase().includes('pm');
  if (isPM && currentHour < 12) currentHour += 12;
  if (!isPM && currentHour === 12) currentHour = 0;
  let currentMinute = parseInt(startMinPart || '0', 10) || 30;

  const stops: ItineraryStop[] = validStops.map((place, idx) => {
    const formattedHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    const ampm = currentHour >= 12 ? 'PM' : 'AM';
    const timeFormatted = `${formattedHour}:${currentMinute < 10 ? '0' : ''}${currentMinute} ${ampm}`;

    // Increment time for next stop
    currentMinute += 45;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }

    let defaultDuration = '45 mins';
    if (idx === 0 && duration === '45 minutes') defaultDuration = '45 mins';
    else if (idx === 0) defaultDuration = '1 hr 15 mins';
    else defaultDuration = '1 hr';

    return {
      order: idx + 1,
      time: timeFormatted,
      duration: defaultDuration,
      type: place.category || 'Experience',
      name: place.name,
      reason: `Chosen for its ${place.category.toLowerCase()} atmosphere that suits a relaxed outing with ${companion}.`,
      address: place.address,
      distance: place.distanceKm ? `${place.distanceKm} km away` : '1.5 km away',
      estimated_cost: place.estimatedCost || '₹250/person',
      tips: `Arrive unhurriedly; take a comfortable table or stroll without checking notifications.`,
      lat: place.lat,
      lng: place.lng,
      rating: place.rating,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.name + ' ' + place.address
      )}`,
    };
  });

  // Wholesome companion-tailored Cherry on Top
  let gesture = 'Pick up a warm treat or small snack unexpectedly on your way home.';
  let why = `A small unprompted gesture reminds them you appreciate having dedicated time together.`;
  let optionalGift = 'Their favorite pastry or a handwritten pocket note.';

  if (companion === 'Someone special') {
    gesture = 'Write one sentence about your favorite memory together on a little slip of paper and give it to them at your final stop.';
    why = 'Intimacy lives in shared history; keeping it brief makes it feel heartfelt and non-performative.';
    optionalGift = 'A dried flower pressed between the pages of a notebook.';
  } else if (companion === 'Best friend' || companion === 'Friend') {
    gesture = 'Curate a tiny 3-song playlist of music that reminds you of your best adventures together.';
    why = 'Music instantly evokes shared laughs and keeps the feeling of the day alive on the commute.';
    optionalGift = 'A quirky local postcard or keychain from the area.';
  } else if (companion === 'Family') {
    gesture = 'Ask them about a place they loved visiting when they were younger and let them share the memory unhurried.';
    why = 'Family conversations become profoundly deeper when we step out of routine habits and simply listen.';
    optionalGift = 'A small potted succulent or fresh tea blend.';
  } else if (companion === 'Sibling') {
    gesture = 'Surprise them by ordering the exact childhood snack or cold drink you two used to fight over.';
    why = 'Nostalgia and sibling camaraderie make any ordinary day feel deeply grounding.';
    optionalGift = 'A silly inside-joke treat.';
  } else if (companion === "Someone I'm getting to know") {
    gesture = 'Pick up a scenic local postcard and each write down one fun or surprising observation from today.';
    why = 'Low-pressure, interactive, and gives both of you a wholesome memento without any awkward pressure.';
    optionalGift = 'A small pack of artisanal cookies to take home.';
  }

  return {
    title: `A Thoughtful Outing with ${companion}`,
    subtitle: `${duration} · ${input.moods.join(' & ') || 'Relaxed'} in ${locationName}`,
    summary: `A carefully paced journey through ${stops.length} real local spots, designed to keep screens away and connection front and center.${refinementNote ? ` Refined for: ${refinementNote}.` : ''}`,
    estimated_total_cost: input.budget && input.budget !== 'No preference' ? input.budget : '₹400–₹800/person',
    total_duration: duration,
    stops,
    travel_notes: `All stops are clustered within your chosen radius to minimize transit and maximize quality time.`,
    why_this_plan: `We balanced your preferred atmosphere (${input.moods.join(', ') || 'relaxing'}) with your ${duration} timeframe. Instead of rushing between far-flung spots, these locations give you room to breathe.`,
    cherry_on_top: {
      gesture,
      why,
      optional_gift: optionalGift,
    },
    companion,
    date: input.dateChoice === 'Choose a date' && input.customDate ? input.customDate : input.dateChoice,
    startTime,
    locationName,
    isDemoMode: true,
    modelUsed: 'Gemma Deterministic Composer (Verified Candidates)',
  };
}

export async function composeItineraryWithGemma(
  input: QuestionnaireState,
  candidates: PlaceCandidate[],
  refinementNote?: string
): Promise<ItineraryPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini/Gemma API key configured, use deterministic composer
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return buildDeterministicItinerary(input, candidates, refinementNote);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the Gemma Open-Weight Itinerary Reasoning Engine behind "Plan A Date", an AI-powered real-world outing planner.
The product philosophy is:
- "Plan → Go Outside → Experience → Remember"
- "The screen should be the shortest part of the experience."
- "Search discovers reality. AI organizes reality."
A "date" does NOT have to be romantic; it means intentionally spending meaningful time with someone (companion: ${input.companion || 'someone'}).

CRITICAL RULES:
1. ONLY use the REAL candidate places provided in the candidates list. Do NOT invent new places, restaurants, or workshops.
2. STRICTLY respect the duration (${input.duration}):
   - "45 minutes": exactly 1 stop (or 1 stop + quick takeaway).
   - "1–2 hours": exactly 1 main activity + 1 secondary short stop (2 stops total).
   - "2–4 hours": 2 to 3 stops.
   - "4–6 hours": 3 to 4 connected stops.
   - "Full day": 4 to 5 stops with morning, lunch/afternoon, sunset/evening flow.
3. PERSONALIZATION: Adapt the flow, pacing, and suggestions to the companion (${input.companion}) and selected moods (${input.moods.join(', ')}).
4. CHERRY ON TOP: Provide a subtle, wholesome, non-cringe gesture or micro-action tailored to the companion and mood.
5. Return ONLY a valid JSON object matching the requested schema. No markdown code fences outside JSON.`;

    const userPrompt = `Here is the user request:
- Companion: ${input.companion}
- Duration: ${input.duration} ${input.customDurationHours ? `(${input.customDurationHours} hours)` : ''}
- Moods: ${input.moods.join(', ')}
- Activities: ${input.activities.join(', ')}
- Budget: ${input.budget} (${input.peopleCount} people)
- Travel Radius: ${input.distance}
- Date: ${input.dateChoice} ${input.customDate || ''}
- Start Time: ${input.startTime}
- Starting Location: ${input.location.name} (lat: ${input.location.lat}, lng: ${input.location.lng})
${refinementNote ? `- Refinement requested by user: "${refinementNote}"` : ''}

REAL DISCOVERED CANDIDATE PLACES (ONLY pick from this list):
${JSON.stringify(
  candidates.map((c, i) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    address: c.address,
    lat: c.lat,
    lng: c.lng,
    rating: c.rating,
    cost: c.estimatedCost,
    distanceKm: c.distanceKm,
    description: c.description,
  })),
  null,
  2
)}

Return a JSON object with this exact structure:
{
  "title": "string (poetic, warm, evocative title for the day)",
  "subtitle": "string (warm one-line summary)",
  "summary": "string (warm paragraph about the day's narrative arc)",
  "estimated_total_cost": "string (e.g. ₹500–₹800/person or Free)",
  "total_duration": "${input.duration}",
  "stops": [
    {
      "order": 1,
      "time": "string (e.g. 10:30 AM)",
      "duration": "string (e.g. 45 mins)",
      "type": "string (e.g. Café, Pottery, Nature Walk)",
      "name": "string (must match candidate place name)",
      "reason": "string (thoughtful, companion-specific reason for choosing this place)",
      "address": "string",
      "distance": "string (e.g. 1.2 km away)",
      "estimated_cost": "string",
      "tips": "string (insider wholesome advice, e.g. ask for the garden table)",
      "lat": number,
      "lng": number,
      "rating": number
    }
  ],
  "travel_notes": "string (transit advice, walking directions)",
  "why_this_plan": "string (clear human-friendly rationale explaining why these places were paired)",
  "cherry_on_top": {
    "gesture": "string (a thoughtful, wholesome action/touch tailored to this companion)",
    "why": "string (why this gesture will be meaningful)",
    "optional_gift": "string (optional small inexpensive item or gesture)"
  }
}`;

    // Prefer Gemma model if available, otherwise fast Gemini flash model
    const modelToUse = process.env.GEMMA_MODEL || 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    if (!text) {
      throw new Error('Empty response from model');
    }

    // Clean any accidental markdown wrap
    const cleaned = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);

    // Merge map URLs and coordinates back to ensure accuracy
    const stops: ItineraryStop[] = (parsed.stops || []).map((stop: any, index: number) => {
      const match = candidates.find((c) => c.name.toLowerCase() === (stop.name || '').toLowerCase());
      const lat = match ? match.lat : stop.lat || input.location.lat;
      const lng = match ? match.lng : stop.lng || input.location.lng;
      const addr = match ? match.address : stop.address || input.location.name;
      const rating = match ? match.rating : stop.rating || 4.5;

      return {
        order: index + 1,
        time: stop.time || `${10 + index}:30 AM`,
        duration: stop.duration || '1 hr',
        type: stop.type || 'Activity',
        name: stop.name || 'Local Spot',
        reason: stop.reason || 'Handpicked for your outing mood.',
        address: addr,
        distance: stop.distance || (match?.distanceKm ? `${match.distanceKm} km away` : 'Nearby'),
        estimated_cost: stop.estimated_cost || match?.estimatedCost || 'Free',
        tips: stop.tips || 'Enjoy unhurried conversation.',
        lat,
        lng,
        rating,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          (stop.name || '') + ' ' + addr
        )}`,
      };
    });

    return {
      title: parsed.title || `A Day Worth Remembering with ${input.companion}`,
      subtitle: parsed.subtitle || `${input.duration} in ${input.location.name}`,
      summary: parsed.summary || 'A curated real-world itinerary designed to foster authentic presence.',
      estimated_total_cost: parsed.estimated_total_cost || input.budget || 'Moderate',
      total_duration: input.duration,
      stops,
      travel_notes: parsed.travel_notes || 'Comfortable walking or short rides between stops.',
      why_this_plan: parsed.why_this_plan || 'Selected based on your desired vibe and geographic proximity.',
      cherry_on_top: parsed.cherry_on_top || {
        gesture: 'Pick up their favorite treat on the way home.',
        why: 'Small surprises leave lasting warmth.',
        optional_gift: 'A warm pastry or handwritten note.',
      },
      companion: input.companion,
      date: input.dateChoice === 'Choose a date' && input.customDate ? input.customDate : input.dateChoice,
      startTime: input.startTime,
      locationName: input.location.name,
      isDemoMode: false,
      modelUsed: `Gemma / Google GenAI (${modelToUse})`,
    };
  } catch (err) {
    console.warn('Gemma composer failed, falling back to deterministic composer:', err);
    return buildDeterministicItinerary(input, candidates, refinementNote);
  }
}
