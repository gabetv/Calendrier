import React, { useEffect, useState } from 'react';
import { DayData } from '../types';
import { generateHolidayMessage } from '../services/geminiService';

interface GiftModalProps {
  data: DayData | null;
  onClose: () => void;
  onOpenConfirm: (day: number, aiMessage?: string) => void;
}

const GiftModal: React.FC<GiftModalProps> = ({ data, onClose, onOpenConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [aiText, setAiText] = useState<string | undefined>(data?.aiMessage);

  useEffect(() => {
    if (data && !data.isOpened && !revealed) {
      // It's a fresh open attempt
    } else if (data && data.isOpened) {
      // Already opened, show immediately
      setRevealed(true);
    }
  }, [data, revealed]);

  if (!data) return null;

  const handleReveal = async () => {
    setLoading(true);
    let message = data.aiMessage;

    // If no manual gift and no existing AI message, generate one
    if (!data.giftContent && !message) {
      message = await generateHolidayMessage(data.person, data.day);
      setAiText(message);
    }

    setLoading(false);
    setRevealed(true);
    onOpenConfirm(data.day, message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-christmas-dark w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transform transition-all relative">
        
        {/* Header Image Placeholder */}
        <div className="h-32 bg-christmas-red flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
           <h2 className="text-4xl font-display text-white drop-shadow-md z-10">Le {data.day} Décembre</h2>
        </div>

        <div className="p-6 flex flex-col items-center text-center space-y-6">
          
          {!revealed ? (
            <div className="space-y-6 animate-fade-in">
              <p className="text-lg text-gray-600">C'est au tour de...</p>
              <div className="w-24 h-24 bg-christmas-gold rounded-full flex items-center justify-center mx-auto animate-bounce-slow text-4xl shadow-lg">
                ❓
              </div>
              <button
                onClick={handleReveal}
                disabled={loading}
                className="w-full bg-christmas-green text-white py-4 rounded-xl font-bold text-xl shadow-md hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Chargement...' : 'Découvrir qui ouvre !'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 w-full animate-fade-in-up">
              <div className="text-center">
                 <p className="uppercase tracking-widest text-xs text-gray-500 mb-1">C'est à</p>
                 <h3 className={`text-4xl font-display font-bold ${data.person === 'Mathilde' ? 'text-pink-600' : 'text-blue-600'}`}>
                    {data.person}
                 </h3>
                 <p className="text-gray-400 text-sm">d'ouvrir la case !</p>
              </div>

              <div className="my-4 border-t border-b border-gray-100 py-6">
                {data.giftContent ? (
                  <div className="text-xl font-medium text-gray-800">
                    🎁 {data.giftContent}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Pas de cadeau physique enregistré, mais...
                  </div>
                )}
                
                {/* AI Message Section */}
                {(aiText || data.aiMessage) && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 italic border border-yellow-100">
                    ✨ "{aiText || data.aiMessage}"
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="mt-4 w-full border-2 border-christmas-dark text-christmas-dark py-3 rounded-xl font-bold hover:bg-christmas-dark hover:text-white transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftModal;