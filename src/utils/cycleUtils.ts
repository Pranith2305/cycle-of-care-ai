
import { addDays, differenceInDays, format, startOfDay } from "date-fns";
import { CycleData, CyclePhase, CyclePhaseInfo } from "@/types";

/**
 * Calculate the current cycle day based on the last period start date
 */
export const getCurrentCycleDay = (lastPeriodStartDate: Date): number => {
  const today = startOfDay(new Date());
  return differenceInDays(today, startOfDay(lastPeriodStartDate)) + 1;
};

/**
 * Predict the phase for a specific date based on cycle data
 */
export const predictPhase = (
  date: Date, 
  cycleData: CycleData
): CyclePhase | undefined => {
  if (!cycleData.lastPeriodStartDate) return undefined;
  
  const { lastPeriodStartDate, averageCycleLength, averagePeriodLength } = cycleData;
  
  // Calculate days since last period
  const daysSinceStart = differenceInDays(date, startOfDay(lastPeriodStartDate));
  
  // If we're past a full cycle, we need to calculate based on predicted cycles
  if (daysSinceStart >= averageCycleLength) {
    const cyclesCompleted = Math.floor(daysSinceStart / averageCycleLength);
    const adjustedDay = daysSinceStart - (cyclesCompleted * averageCycleLength);
    return getPhaseFromCycleDay(adjustedDay + 1, averagePeriodLength, averageCycleLength);
  }
  
  // Within the first cycle
  return getPhaseFromCycleDay(daysSinceStart + 1, averagePeriodLength, averageCycleLength);
};

/**
 * Get the phase based on the cycle day
 */
export const getPhaseFromCycleDay = (
  cycleDay: number,
  periodLength: number = 5,
  cycleLength: number = 28
): CyclePhase => {
  if (cycleDay <= periodLength) {
    return "menstrual";
  } else if (cycleDay <= Math.floor(cycleLength / 2)) {
    return "follicular";
  } else if (cycleDay === Math.floor(cycleLength / 2) + 1) {
    return "ovulation";
  } else {
    return "luteal";
  }
};

/**
 * Get the current cycle phase
 */
export const getCurrentPhase = (cycleData: CycleData): CyclePhase | undefined => {
  const today = new Date();
  return predictPhase(today, cycleData);
};

/**
 * Predict the next period start date
 */
export const getNextPeriodDate = (cycleData: CycleData): Date => {
  const { lastPeriodStartDate, averageCycleLength } = cycleData;
  return addDays(lastPeriodStartDate, averageCycleLength);
};

/**
 * Get days until next period
 */
export const getDaysUntilNextPeriod = (cycleData: CycleData): number => {
  const nextPeriod = getNextPeriodDate(cycleData);
  const today = startOfDay(new Date());
  return differenceInDays(nextPeriod, today);
};

/**
 * Format a date to a string (YYYY-MM-DD)
 */
export const formatDateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get information about each phase
 */
export const getCyclePhaseInfo = (cycleLength: number = 28): CyclePhaseInfo[] => {
  const periodLength = 5;
  const follicularEnd = Math.floor(cycleLength / 2);
  const ovulationDay = follicularEnd + 1;
  
  return [
    {
      phase: 'menstrual',
      title: 'Menstrual Phase',
      description: 'This is when the period occurs as the uterine lining sheds.',
      emoji: '🟥',
      tipText: 'Consider gentle exercises, warm compresses for cramps, and iron-rich foods.',
      daysRange: `Days 1-${periodLength}`
    },
    {
      phase: 'follicular',
      title: 'Follicular Phase',
      description: 'The time between the end of the period and ovulation. Energy levels often rise during this phase.',
      emoji: '🌱',
      tipText: 'Energy is typically higher. Good time for new projects and physical activity.',
      daysRange: `Days ${periodLength + 1}-${follicularEnd}`
    },
    {
      phase: 'ovulation',
      title: 'Ovulation',
      description: 'When an egg is released. Many experience peak energy and libido during this time.',
      emoji: '🧡',
      tipText: 'Often a time of peak energy and increased libido for many.',
      daysRange: `~Day ${ovulationDay}`
    },
    {
      phase: 'luteal',
      title: 'Luteal Phase',
      description: 'The time between ovulation and the next period. PMS symptoms may appear in the later part.',
      emoji: '🌕',
      tipText: 'Self-care is important as PMS symptoms may appear. Consider comfort foods and rest.',
      daysRange: `Days ${ovulationDay + 1}-${cycleLength}`
    }
  ];
};

/**
 * Get partner tips based on phase
 */
export const getPartnerTips = (phase: CyclePhase): string => {
  switch (phase) {
    case 'menstrual':
      return "She may appreciate comfort items like warm tea, chocolate, or a heating pad. Physical comfort is key.";
    case 'follicular':
      return "Energy is typically rising. Great time for dates, activities, and new experiences together.";
    case 'ovulation':
      return "Many experience peak energy and increased libido. A good time for romantic connection.";
    case 'luteal':
      return "PMS symptoms may appear. Extra patience, understanding, and small gestures of care can mean a lot.";
    default:
      return "Be attentive to her needs and moods, and ask how you can best support her.";
  }
};
