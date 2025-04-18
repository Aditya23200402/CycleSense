
import { addDays, differenceInDays, format, parseISO, subDays } from 'date-fns';
import { CycleData, CyclePhase, DayData, FlowIntensity, Symptom } from '../types/cycle';

// Generate a unique ID (simple implementation for now)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Get today's date in YYYY-MM-DD format
export const getTodayFormatted = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Calculate cycle length in days
export const calculateCycleLength = (cycle: CycleData): number => {
  if (!cycle.endDate) return 0;
  
  const start = parseISO(cycle.startDate);
  const end = parseISO(cycle.endDate);
  return differenceInDays(end, start) + 1;
};

// Calculate period length in days (days with flow)
export const calculatePeriodLength = (cycle: CycleData): number => {
  return cycle.days.filter(day => day.flow).length;
};

// Predict the next period start date based on average cycle length
export const predictNextPeriod = (
  lastPeriodStart: string, 
  averageCycleLength: number
): string => {
  const lastStartDate = parseISO(lastPeriodStart);
  const predictedNextDate = addDays(lastStartDate, averageCycleLength);
  return format(predictedNextDate, 'yyyy-MM-dd');
};

// Determine the current cycle phase based on the last period start date and average cycle length
export const determineCyclePhase = (
  today: Date,
  lastPeriodStart: string,
  averageCycleLength: number,
  averagePeriodLength: number
): CyclePhase => {
  const lastStart = parseISO(lastPeriodStart);
  const daysSinceStart = differenceInDays(today, lastStart);
  
  // Default values if not enough data
  const periodLength = averagePeriodLength || 5;
  const cycleLength = averageCycleLength || 28;
  
  // Estimated ovulation is 14 days before the next period
  const ovulationDay = cycleLength - 14;
  
  if (daysSinceStart < 0) {
    // If today is before the last period start (shouldn't happen in normal usage)
    return CyclePhase.LUTEAL;
  } else if (daysSinceStart < periodLength) {
    // Menstrual phase
    return CyclePhase.MENSTRUAL;
  } else if (daysSinceStart < ovulationDay - 2) {
    // Follicular phase
    return CyclePhase.FOLLICULAR;
  } else if (daysSinceStart >= ovulationDay - 2 && daysSinceStart <= ovulationDay + 2) {
    // Ovulation phase (5 day window)
    return CyclePhase.OVULATION;
  } else {
    // Luteal phase
    return CyclePhase.LUTEAL;
  }
};

// Get a description of the current cycle phase
export const getCyclePhaseInfo = (phase: CyclePhase): { title: string, description: string } => {
  switch (phase) {
    case CyclePhase.MENSTRUAL:
      return {
        title: "Menstrual Phase",
        description: "Your body is shedding the uterine lining. You may experience cramping, fatigue, and mood changes."
      };
    case CyclePhase.FOLLICULAR:
      return {
        title: "Follicular Phase",
        description: "Your body is preparing for ovulation. Estrogen rises, and you may feel more energetic and upbeat."
      };
    case CyclePhase.OVULATION:
      return {
        title: "Ovulation Phase",
        description: "An egg is released from your ovary. You may notice increased energy, clearer skin, and heightened senses."
      };
    case CyclePhase.LUTEAL:
      return {
        title: "Luteal Phase",
        description: "Your body is preparing for either pregnancy or menstruation. You may experience PMS symptoms like mood swings, bloating, and fatigue."
      };
  }
};

// Check if there are any irregular patterns in a series of cycles
export const detectIrregularities = (
  cycles: CycleData[], 
  averageCycleLength: number
): { isIrregular: boolean, reason?: string } => {
  if (cycles.length < 2) {
    return { isIrregular: false };
  }
  
  // Calculate the standard deviation of cycle lengths
  const lengths = cycles.map(cycle => cycle.length || 0).filter(length => length > 0);
  if (lengths.length < 2) {
    return { isIrregular: false };
  }
  
  const mean = lengths.reduce((sum, length) => sum + length, 0) / lengths.length;
  const squaredDiffs = lengths.map(length => Math.pow(length - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  
  // If standard deviation is greater than 7 days, consider it irregular
  if (stdDev > 7) {
    return {
      isIrregular: true,
      reason: "Your cycle length varies significantly from month to month."
    };
  }
  
  // If the latest cycle is significantly shorter or longer than average
  const latestCycle = cycles[cycles.length - 1];
  if (latestCycle.length && Math.abs(latestCycle.length - averageCycleLength) > 7) {
    return {
      isIrregular: true,
      reason: `Your latest cycle (${latestCycle.length} days) is significantly ${
        latestCycle.length > averageCycleLength ? "longer" : "shorter"
      } than your average cycle (${averageCycleLength} days).`
    };
  }
  
  return { isIrregular: false };
};

// Create a new day entry
export const createDayEntry = (
  date: string,
  flow?: FlowIntensity,
  symptoms: Symptom[] = []
): DayData => {
  return {
    id: generateId(),
    date,
    flow,
    symptoms,
    notes: ''
  };
};

// Create a new cycle
export const createCycle = (startDate: string): CycleData => {
  return {
    id: generateId(),
    startDate,
    days: [createDayEntry(startDate, 'medium')],
  };
};

// Sample data for development
export const generateSampleData = (): {cycles: CycleData[], averageCycleLength: number, averagePeriodLength: number} => {
  const today = new Date();
  
  // Create three past cycles
  const cycle1Start = format(subDays(today, 84), 'yyyy-MM-dd');
  const cycle1End = format(subDays(today, 79), 'yyyy-MM-dd');
  const cycle1: CycleData = {
    id: generateId(),
    startDate: cycle1Start,
    endDate: cycle1End,
    days: [
      { id: generateId(), date: cycle1Start, flow: 'medium', symptoms: ['cramps', 'mood_swings'] },
      { id: generateId(), date: format(subDays(today, 83), 'yyyy-MM-dd'), flow: 'heavy', symptoms: ['cramps', 'fatigue'] },
      { id: generateId(), date: format(subDays(today, 82), 'yyyy-MM-dd'), flow: 'medium', symptoms: ['fatigue'] },
      { id: generateId(), date: format(subDays(today, 81), 'yyyy-MM-dd'), flow: 'light', symptoms: [] },
      { id: generateId(), date: format(subDays(today, 80), 'yyyy-MM-dd'), flow: 'spotting', symptoms: [] },
      { id: generateId(), date: cycle1End, flow: 'spotting', symptoms: [] },
    ],
    length: 30
  };
  
  const cycle2Start = format(subDays(today, 54), 'yyyy-MM-dd');
  const cycle2End = format(subDays(today, 50), 'yyyy-MM-dd');
  const cycle2: CycleData = {
    id: generateId(),
    startDate: cycle2Start,
    endDate: cycle2End,
    days: [
      { id: generateId(), date: cycle2Start, flow: 'light', symptoms: ['cramps'] },
      { id: generateId(), date: format(subDays(today, 53), 'yyyy-MM-dd'), flow: 'medium', symptoms: ['cramps', 'backache'] },
      { id: generateId(), date: format(subDays(today, 52), 'yyyy-MM-dd'), flow: 'medium', symptoms: ['fatigue'] },
      { id: generateId(), date: format(subDays(today, 51), 'yyyy-MM-dd'), flow: 'light', symptoms: [] },
      { id: generateId(), date: cycle2End, flow: 'spotting', symptoms: [] },
    ],
    length: 29
  };
  
  const cycle3Start = format(subDays(today, 25), 'yyyy-MM-dd');
  const cycle3End = format(subDays(today, 21), 'yyyy-MM-dd');
  const cycle3: CycleData = {
    id: generateId(),
    startDate: cycle3Start,
    endDate: cycle3End,
    days: [
      { id: generateId(), date: cycle3Start, flow: 'medium', symptoms: ['cramps', 'bloating'] },
      { id: generateId(), date: format(subDays(today, 24), 'yyyy-MM-dd'), flow: 'heavy', symptoms: ['cramps', 'headache'] },
      { id: generateId(), date: format(subDays(today, 23), 'yyyy-MM-dd'), flow: 'heavy', symptoms: ['fatigue', 'mood_swings'] },
      { id: generateId(), date: format(subDays(today, 22), 'yyyy-MM-dd'), flow: 'light', symptoms: ['fatigue'] },
      { id: generateId(), date: cycle3End, flow: 'spotting', symptoms: [] },
    ],
    length: 29
  };
  
  return {
    cycles: [cycle1, cycle2, cycle3],
    averageCycleLength: 29,
    averagePeriodLength: 5
  };
};
