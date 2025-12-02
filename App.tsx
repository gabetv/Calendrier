import React, { useEffect, useState } from 'react';
import { AppState, DayData } from './types';
import { getInitialData, saveData } from './utils/helpers';
import DayCard from './components/DayCard';
import GiftModal from './components/GiftModal';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    days: [],
    isConfigMode: false,
  });

  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    // Load data from local storage on mount
    const initialDays = getInitialData();
    setState(prev => ({ ...prev, days: initialDays }));
  }, []);

  const handleDayClick = (dayNum: number) => {
    const dayData = state.days.find(d => d.day === dayNum);
    if (dayData) {
      setSelectedDay(dayData);
    }
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  const handleOpenConfirm = (dayNum: number, aiMessage?: string) => {
    const updatedDays = state.days.map(d => {
      if (d.day === dayNum) {
        return { ...d, isOpened: true, aiMessage: aiMessage || d.aiMessage };
      }
      return d;
    });
    
    setState(prev => ({ ...prev, days: updatedDays }));
    saveData(updatedDays);
  };

  const handleAdminSave = (updatedDays: DayData[]) => {
    setState(prev => ({ ...prev, days: updatedDays }));
    saveData(updatedDays);
  };

  // Calculate progress
  const openedCount = state.days.filter(d => d.isOpened).length;
  const totalCount = state.days.length;

  return (
    <div className="min-h-screen flex flex-col items-center pb-12 px-4 relative">
      
      {/* Header */}
      <header className="w-full max-w-4xl pt-8 pb-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-display text-christmas-gold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Calendrier de l'Avent
        </h1>
        <p className="text-xl md:text-2xl mt-2 font-light tracking-wide text-christmas-cream">
          Mathilde & Gaylord
        </p>
        
        {/* Progress bar */}
        <div className="w-full max-w-xs mt-6 bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-christmas-red h-full transition-all duration-1000" 
            style={{ width: `${(openedCount / totalCount) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{openedCount} / {totalCount} cases ouvertes</p>
      </header>

      {/* Grid */}
      <main className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {state.days.map(day => (
          <DayCard 
            key={day.day} 
            data={day} 
            onClick={handleDayClick} 
          />
        ))}
      </main>

      {/* Admin Toggle (Hidden-ish) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button 
          onClick={() => setState(prev => ({ ...prev, isConfigMode: true }))}
          className="bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 text-gray-500 hover:text-white transition-all"
          title="Paramètres"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Modals */}
      <GiftModal 
        data={selectedDay} 
        onClose={handleCloseModal} 
        onOpenConfirm={handleOpenConfirm}
      />

      {state.isConfigMode && (
        <AdminPanel 
          days={state.days} 
          onSave={handleAdminSave} 
          onClose={() => setState(prev => ({ ...prev, isConfigMode: false }))} 
        />
      )}

      {/* Snowfall effect overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
           <div 
             key={i}
             className="absolute bg-white rounded-full opacity-20 animate-snow"
             style={{
               left: `${Math.random() * 100}%`,
               animationDelay: `${Math.random() * 5}s`,
               animationDuration: `${5 + Math.random() * 10}s`,
               width: `${Math.random() * 6 + 2}px`,
               height: `${Math.random() * 6 + 2}px`,
             }}
           />
        ))}
      </div>
    </div>
  );
};

export default App;