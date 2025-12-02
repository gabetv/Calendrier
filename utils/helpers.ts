import { DayData, TOTAL_DAYS, Person } from '../types';

export const getInitialData = (): DayData[] => {
  const saved = localStorage.getItem('mg_advent_calendar_data');
  if (saved) {
    return JSON.parse(saved);
  }

  // Create 24 days
  const days: DayData[] = [];
  const people: Person[] = ['Mathilde', 'Gaylord'];
  
  // Ensure roughly equal distribution
  let pool: Person[] = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    pool.push(people[i % 2]);
  }
  
  // Shuffle pool
  pool = pool.sort(() => Math.random() - 0.5);

  for (let i = 1; i <= TOTAL_DAYS; i++) {
    days.push({
      day: i,
      person: pool[i - 1],
      giftContent: '',
      isOpened: false,
    });
  }

  return days;
};

export const saveData = (days: DayData[]) => {
  localStorage.setItem('mg_advent_calendar_data', JSON.stringify(days));
};

export const isDayUnlockable = (day: number): boolean => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed, December is 11
  const currentDay = now.getDate();

  // If it's not December yet (month < 11), nothing is unlockable (unless purely testing)
  if (currentMonth < 11) return false;
  
  // If it's past December, everything is unlockable
  if (currentMonth > 11) return true;

  // It is December
  return currentDay >= day;
};

// Generic shuffle function (Fisher-Yates)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};