
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type SymptomLevel = 'none' | 'mild' | 'moderate' | 'severe';

export interface SymptomEntry {
  mood?: 'happy' | 'calm' | 'irritable' | 'sad' | 'anxious';
  energy?: 'high' | 'normal' | 'low' | 'exhausted';
  cramps?: SymptomLevel;
  headache?: SymptomLevel;
  bloating?: SymptomLevel;
  breastTenderness?: SymptomLevel;
  cravings?: string[];
  flow?: 'light' | 'medium' | 'heavy' | 'spotting' | 'none';
  notes?: string;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  phase?: CyclePhase;
  hasSymptoms: boolean;
}

export interface CycleData {
  lastPeriodStartDate: Date;
  averageCycleLength: number;
  averagePeriodLength: number;
  symptoms: Record<string, SymptomEntry>; // dateString -> symptoms
}

export interface PartnerTip {
  phase: CyclePhase;
  title: string;
  description: string;
  icon: string;
}

export interface CyclePhaseInfo {
  phase: CyclePhase;
  title: string;
  description: string;
  emoji: string;
  tipText: string;
  daysRange: string;
}
