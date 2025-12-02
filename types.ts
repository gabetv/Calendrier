export type Person = 'Mathilde' | 'Gaylord';

export interface DayData {
  day: number;
  person: Person;
  giftContent: string; // The manual gift text
  aiMessage?: string; // Generated message if gift is empty or supplementary
  isOpened: boolean;
}

export interface AppState {
  days: DayData[];
  isConfigMode: boolean;
}

export const TOTAL_DAYS = 24;
