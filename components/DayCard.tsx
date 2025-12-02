import React from 'react';
import { DayData } from '../types';
import { isDayUnlockable } from '../utils/helpers';

interface DayCardProps {
  data: DayData;
  onClick: (day: number) => void;
}

const DayCard: React.FC<DayCardProps> = ({ data, onClick }) => {
  const canOpen = isDayUnlockable(data.day);
  // For demo purposes, if you want to test the UI without waiting for Dec 1st:
  // const canOpen = true; 

  const baseClasses = "relative w-full aspect-square rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2";
  
  let stateClasses = "";
  if (data.isOpened) {
    stateClasses = "bg-christmas-cream border-christmas-gold text-christmas-dark opacity-90";
  } else if (canOpen) {
    stateClasses = "bg-christmas-red border-white/20 text-white animate-pulse-slow hover:brightness-110";
  } else {
    stateClasses = "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed";
  }

  return (
    <div 
      onClick={() => canOpen || data.isOpened ? onClick(data.day) : null}
      className={`${baseClasses} ${stateClasses}`}
    >
      {/* Background decoration */}
      {!data.isOpened && (
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>
      )}

      {/* Number */}
      <span className={`font-display text-4xl md:text-5xl font-bold z-10 ${data.isOpened ? 'text-christmas-red' : 'text-white'}`}>
        {data.day}
      </span>

      {/* Lock Icon if locked */}
      {!canOpen && !data.isOpened && (
        <div className="absolute top-2 right-2 opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Checkmark if opened */}
      {data.isOpened && (
        <div className="absolute bottom-2 right-2 text-christmas-green">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DayCard;