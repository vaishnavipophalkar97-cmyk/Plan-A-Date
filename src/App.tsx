import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { LandingHero } from './components/LandingHero.js';
import { QuestionnaireWizard } from './components/Questionnaire/QuestionnaireWizard.js';
import { PlanningLoader } from './components/PlanningLoader.js';
import { ItineraryView } from './components/Itinerary/ItineraryView.js';
import { TouchGrassMode } from './components/TouchGrassMode.js';
import { MemoryModal } from './components/MemoryModal.js';
import { PastMemoriesDrawer } from './components/PastMemoriesDrawer.js';
import {
  QuestionnaireState,
  ItineraryPlan,
  OutingMemory,
} from './types/index.js';

type ViewMode = 'landing' | 'questionnaire' | 'loading' | 'itinerary' | 'touch_grass';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireState | null>(null);
  const [itineraryPlan, setItineraryPlan] = useState<ItineraryPlan | null>(null);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);

  // Memories Management
  const [memories, setMemories] = useState<OutingMemory[]>([]);
  const [memoriesDrawerOpen, setMemoriesDrawerOpen] = useState<boolean>(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState<boolean>(false);

  // Error Banner State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved memories & system status on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('plan_a_date_memories');
      if (stored) {
        setMemories(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to load stored memories:', err);
    }

    // Check system status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setIsLiveMode(data.mode === 'live_production');
      })
      .catch(() => {
        setIsLiveMode(false);
      });
  }, []);

  const saveMemoryToStorage = (memory: OutingMemory) => {
    const updated = [memory, ...memories];
    setMemories(updated);
    try {
      localStorage.setItem('plan_a_date_memories', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save memory:', err);
    }
  };

  const deleteMemoryFromStorage = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    try {
      localStorage.setItem('plan_a_date_memories', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete memory:', err);
    }
  };

  // Flow handlers
  const handleStartPlanning = () => {
    setErrorMessage(null);
    setCurrentView('questionnaire');
  };

  const handleCancelQuestionnaire = () => {
    setCurrentView('landing');
  };

  const handleQuestionnaireComplete = async (data: QuestionnaireState) => {
    setQuestionnaireData(data);
    setCurrentView('loading');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaire: data }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      if (resData.itinerary) {
        setItineraryPlan(resData.itinerary);
        setCurrentView('itinerary');
      } else {
        throw new Error('No itinerary was returned.');
      }
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      setErrorMessage(
        'We encountered a momentary delay connecting to the reasoning layer. Please retry or adjust location.'
      );
      setCurrentView('questionnaire');
    }
  };

  const handleRefineItinerary = async (refinementLabel: string) => {
    if (!questionnaireData || !itineraryPlan) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/refine-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaire: questionnaireData,
          refinement: refinementLabel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine plan');
      }

      const resData = await response.json();
      if (resData.itinerary) {
        setItineraryPlan(resData.itinerary);
      }
    } catch (err) {
      console.error('Failed to refine itinerary:', err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleHeadOut = () => {
    setCurrentView('touch_grass');
  };

  const handleFinishOuting = () => {
    setMemoryModalOpen(true);
  };

  const handlePlanAgain = () => {
    setItineraryPlan(null);
    setQuestionnaireData(null);
    setCurrentView('questionnaire');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between selection:bg-amber-200 selection:text-stone-900">
      {/* Navigation Bar (hidden in Touch Grass mode to minimize distractions) */}
      {currentView !== 'touch_grass' && (
        <Navbar
          onGoHome={() => setCurrentView('landing')}
          onOpenMemories={() => setMemoriesDrawerOpen(true)}
          memoriesCount={memories.length}
          isLiveMode={isLiveMode}
        />
      )}

      {/* Global Error Banner if any */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto my-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-stone-500 hover:text-stone-800 text-sm font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingHero onStartPlanning={handleStartPlanning} />
        )}

        {currentView === 'questionnaire' && (
          <QuestionnaireWizard
            onComplete={handleQuestionnaireComplete}
            onCancel={handleCancelQuestionnaire}
          />
        )}

        {currentView === 'loading' && (
          <PlanningLoader
            locationName={questionnaireData?.location.name || 'Your Area'}
            companion={questionnaireData?.companion || 'Someone Special'}
          />
        )}

        {currentView === 'itinerary' && itineraryPlan && questionnaireData && (
          <ItineraryView
            plan={itineraryPlan}
            questionnaire={questionnaireData}
            onHeadOut={handleHeadOut}
            onPlanAgain={handlePlanAgain}
            onRefine={handleRefineItinerary}
            isRefining={isRefining}
          />
        )}

        {currentView === 'touch_grass' && itineraryPlan && (
          <TouchGrassMode
            plan={itineraryPlan}
            onFinishOuting={handleFinishOuting}
            onExitTouchGrass={() => setCurrentView('itinerary')}
          />
        )}
      </main>

      {/* Footer (hidden in Touch Grass mode) */}
      {currentView !== 'touch_grass' && (
        <footer className="border-t border-stone-200/70 py-8 px-4 text-center text-xs text-stone-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-stone-800">Plan A Date</span>
              <span>·</span>
              <span>Search discovers reality. Gemma organizes reality.</span>
            </div>
            <div className="flex items-center gap-4 text-stone-400">
              <span>Touch Grass Mindset</span>
              <span>·</span>
              <span>Open AI Architecture</span>
            </div>
          </div>
        </footer>
      )}

      {/* Memory Modal */}
      {itineraryPlan && (
        <MemoryModal
          plan={itineraryPlan}
          isOpen={memoryModalOpen}
          onClose={() => {
            setMemoryModalOpen(false);
            setCurrentView('landing');
          }}
          onSaveMemory={saveMemoryToStorage}
        />
      )}

      {/* Past Memories Drawer */}
      <PastMemoriesDrawer
        isOpen={memoriesDrawerOpen}
        onClose={() => setMemoriesDrawerOpen(false)}
        memories={memories}
        onDeleteMemory={deleteMemoryFromStorage}
      />
    </div>
  );
}
