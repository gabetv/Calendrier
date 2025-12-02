import React, { useState, useEffect } from 'react';
import { DayData, Person } from '../types';
import { shuffleArray } from '../utils/helpers';

interface AdminPanelProps {
  days: DayData[];
  onSave: (updatedDays: DayData[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ days, onSave, onClose }) => {
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [giftInputs, setGiftInputs] = useState<string[]>([]);
  const [shuffleOnSave, setShuffleOnSave] = useState(true);

  // Determine who opens the gift (the target) based on who is logged in.
  // If I am Mathilde, I write gifts for Gaylord to open.
  const targetPerson: Person | null = currentUser === 'Mathilde' ? 'Gaylord' : 'Mathilde';

  useEffect(() => {
    if (currentUser && targetPerson) {
      // Find all days assigned to the target person
      const targetDays = days.filter(d => d.person === targetPerson);
      // Extract their current gifts (or empty strings)
      const currentGifts = targetDays.map(d => d.giftContent);
      setGiftInputs(currentGifts);
    }
  }, [currentUser, days, targetPerson]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...giftInputs];
    newInputs[index] = value;
    setGiftInputs(newInputs);
  };

  const handleSave = () => {
    if (!currentUser || !targetPerson) return;

    // Get the inputs to save
    let finalGifts = [...giftInputs];

    // Optionally shuffle them so the input order doesn't match the calendar date order
    if (shuffleOnSave) {
      finalGifts = shuffleArray(finalGifts);
    }

    // Map back to the original days array
    let giftIndex = 0;
    const updatedDays = days.map(day => {
      // If this day is for the target person, assign one of the gifts
      if (day.person === targetPerson) {
        const content = finalGifts[giftIndex] || '';
        giftIndex++;
        return { ...day, giftContent: content };
      }
      return day;
    });

    onSave(updatedDays);
    onClose();
  };

  // View 1: User Selection
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 text-center">
          <h2 className="text-3xl font-display text-christmas-gold mb-2">Configuration</h2>
          <p className="text-gray-400 mb-8">Qui est en train de configurer les lots ?</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setCurrentUser('Mathilde')}
              className="p-6 rounded-xl bg-slate-700 hover:bg-pink-900/50 border-2 border-transparent hover:border-pink-500 transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">👩‍🦰</div>
              <div className="font-bold text-white">Mathilde</div>
            </button>
            <button 
              onClick={() => setCurrentUser('Gaylord')}
              className="p-6 rounded-xl bg-slate-700 hover:bg-blue-900/50 border-2 border-transparent hover:border-blue-500 transition-all group"
            >
               <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🧔</div>
              <div className="font-bold text-white">Gaylord</div>
            </button>
          </div>

          <button onClick={onClose} className="mt-8 text-sm text-gray-500 hover:text-white underline">
            Retour au calendrier
          </button>
        </div>
      </div>
    );
  }

  // View 2: Gift Entry
  const filledCount = giftInputs.filter(g => g.trim().length > 0).length;
  const totalSlots = giftInputs.length;
  const progress = (filledCount / totalSlots) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto">
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 border-b border-gray-700 px-6 py-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-display text-white">
                Cadeaux pour <span className={targetPerson === 'Mathilde' ? 'text-pink-400' : 'text-blue-400'}>{targetPerson}</span>
              </h2>
              <p className="text-xs text-gray-400">Remplis les {totalSlots} cases. Elles seront mélangées !</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentUser(null)} className="px-3 py-2 text-sm text-gray-400 hover:text-white">
                Retour
              </button>
              <button 
                onClick={handleSave} 
                className="bg-christmas-green text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-lg hover:shadow-green-900/20"
              >
                Valider
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-christmas-gold' : 'bg-christmas-red'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{filledCount} lots définis</span>
            <span>{totalSlots - filledCount} restants</span>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="flex-1 p-6 space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6 text-sm text-blue-200 flex items-start gap-3">
             <span className="text-xl">🤫</span>
             <p>
               Tu ne vois pas les dates ici. Remplis simplement tes idées. 
               Lors de la sauvegarde, elles seront <strong>distribuées aléatoirement</strong> sur les jours où {targetPerson} doit ouvrir une case.
             </p>
          </div>

          {giftInputs.map((gift, index) => (
            <div key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                Lot #{index + 1}
              </label>
              <textarea
                rows={2}
                value={gift}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Une surprise pour ${targetPerson}...`}
                className="w-full bg-slate-900 border-none rounded-lg p-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-christmas-gold resize-none"
              />
            </div>
          ))}

          {/* Settings */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${shuffleOnSave ? 'bg-christmas-green' : 'bg-slate-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${shuffleOnSave ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <input 
                type="checkbox" 
                checked={shuffleOnSave} 
                onChange={(e) => setShuffleOnSave(e.target.checked)} 
                className="hidden"
              />
              <span className="text-gray-300 group-hover:text-white transition-colors">Mélanger les lots à la sauvegarde (Recommandé)</span>
            </label>
          </div>
        </div>
        
        <div className="h-12"></div> {/* Spacer for bottom scroll */}
      </div>
    </div>
  );
};

export default AdminPanel;