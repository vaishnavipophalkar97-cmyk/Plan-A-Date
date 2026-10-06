# Plan A Date 🌿

> **"Search discovers reality. AI organizes reality."**
> 
> *A date doesn't have to be romantic. It just means making time for someone.*

---

## 1. What is Plan A Date?

**Plan A Date** is an AI-powered real-world outing planner built around a simple truth: our digital devices should help us disconnect and spend meaningful time with the people we care about.

You can go on a **“date”** with:
* ❤️ Someone special / partner
* 🫶 Best friend
* 👯 Friend
* 🏡 Family (parents, relatives)
* 🧑🤝🧑 Sibling
* 🎉 Friend group
* 🌱 Someone you are getting to know
* ✨ Anyone else

Instead of scrolling endlessly through endless recommendation lists or chatbot conversations, Plan A Date asks a small number of thoughtful questions (companion, exact duration, desired mood, activities, budget, distance, time, and location) and instantly composes a complete personalized outing using **REAL places and activities near your location**.

---

## 2. The Product Philosophy: Touch Grass

The philosophy is:

$$\text{\bfseries Plan} \longrightarrow \text{\bfseries Go Outside} \longrightarrow \text{\bfseries Experience} \longrightarrow \text{\bfseries Remember}$$

**The screen should be the shortest part of the experience.**

Once you've reviewed your plan and its signature *Cherry on Top*, you tap **“🌿 I'm heading out”**. The interface immediately sheds all distractions and transforms into **Touch Grass Mode**: a minimal screen showing just your active stop, a quick button for directions, and a clear reminder:

> **Put your phone away. Enjoy the moment. ❤️**

---

## 3. How the Application Works

```
                               ┌────────────────────────────────┐
                               │       User Questionnaire       │
                               │ (Companion, Time, Mood, Loc)   │
                               └───────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴────────────────────────┐
                       ▼                                                ▼
         ┌───────────────────────────┐                    ┌───────────────────────────┐
         │     SerpApi / Discovery   │                    │     Browser Geolocation   │
         │ (Google Local / Real Venues│                   │  (Reverse geocoded via    │
         │  Ratings, Hours, Lat/Lng) │                    │    OpenStreetMap / GPS)   │
         └─────────────┬─────────────┘                    └─────────────┬─────────────┘
                       │                                                │
                       └───────────────────────┬────────────────────────┘
                                               ▼
                               ┌────────────────────────────────┐
                               │   Gemma Reasoning Layer (AI)   │
                               │ • Companion-specific pacing    │
                               │ • Rigid time window budgeting  │
                               │ • Real-candidate composition   │
                               │ • Signature "Cherry on Top"    │
                               └───────────────┬────────────────┘
                                               ▼
                               ┌────────────────────────────────┐
                               │    The Outing Story Screen     │
                               │ • Interactive Timeline         │
                               │ • Leaflet Route Map            │
                               │ • "Why this plan?" rationale   │
                               │ • Refinements ("Make it more") │
                               │ • "🌿 I'm heading out" Mode    │
                               └────────────────────────────────┘
```

---

## 4. Why Open Innovation Matters

Plan A Date is built around **open-weight AI principles with Gemma**:

1. **Search Discovers Reality**: Search engines (SerpApi / Google Local) find what actually exists—real coordinates, open hours, authentic reviews, and local venues. AI should never hallucinate a restaurant or pottery studio.
2. **Gemma Organizes Reality**: Open-weight Gemma acts as the personalization, composition, and constraint-satisfaction engine. It analyzes candidate places and stitches them into a coherent narrative suited to the relationship and schedule.
3. **Open AI Freedom**: Open-weight models like Gemma allow developers and communities to run inference locally, deploy on edge devices, inspect prompt behavior, and avoid proprietary closed-platform vendor lock-in.

---

## 5. Key Features

* **Multi-Step Editorial Questionnaire**: Step-by-step questions with clean typographic cues and smooth navigation.
* **Strict Time Window Adherence**:
  * *45 minutes* $\rightarrow$ 1 focused stop + optional takeaway.
  * *1–2 hours* $\rightarrow$ 1 main activity + short secondary stop.
  * *2–4 hours* $\rightarrow$ 2–3 balanced stops with breathing room.
  * *4–6 hours / Full day* $\rightarrow$ Connected morning-to-sunset journeys.
* **Real Place Discovery**: Real venues with verified coordinates, addresses, opening hours, and budget tiers.
* **Interactive Route Map**: Leaflet map with custom numbered markers, routing lines, and active stop synchronization.
* **Signature “Cherry on Top”**: A wholesome gesture, action, or small gift tailored specifically to your companion (e.g. surprising a sibling with their childhood favorite snack or writing a one-sentence memory at sunset).
* **“Make it more...” Refinement Bar**: Instant 1-click modifications (`💰 Cheaper`, `🌿 More nature`, `🎨 More creative`, `🍜 More food`, `🚶 Less travel`, `😌 More relaxed`).
* **Touch Grass Mode**: Minimal, low-distraction mode showing only current stop details so you can put your phone away.
* **Memory Journal**: A warm, low-pressure post-outing log to remember the day.

---

## 6. Architecture & Tech Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons, Leaflet.
* **Backend**: Express (Node.js/tsx) providing server-side proxy routes for secure API calls.
* **AI Model**:Google Gemma (open-weight model), accessed through the Gemini API (@google/genai).
* **Real-World Discovery**: SerpApi (Google Local engine) with automatic fallback to high-fidelity verified catalog and OpenStreetMap Nominatim reverse geocoding.

---



## 10. Limitations & Future Roadmap

* **Live Weather Integration**: Factoring in sudden rain forecasts to dynamically swap outdoor gardens for cozy indoor roasteries.
* **Calendar Sync**: One-tap export to Google Calendar or Apple Calendar.
* **Split Bill Estimator**: Real-time group expense splitting for friend group outings.
