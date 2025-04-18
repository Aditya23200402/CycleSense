
// Types for the cycle tracking app

export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

export type PhysicalSymptom = 
  | 'cramps' 
  | 'headache' 
  | 'backache' 
  | 'nausea' 
  | 'bloating' 
  | 'breast_tenderness' 
  | 'fatigue' 
  | 'acne' 
  | 'constipation' 
  | 'diarrhea';

export type EmotionalSymptom = 
  | 'mood_swings' 
  | 'anxiety' 
  | 'irritability' 
  | 'depression' 
  | 'calm'
  | 'sensitive'
  | 'happy'
  | 'sad';

export type Symptom = PhysicalSymptom | EmotionalSymptom;

export interface DayData {
  id: string;
  date: string; // YYYY-MM-DD format
  flow?: FlowIntensity;
  symptoms: Symptom[];
  notes?: string;
}

export interface CycleData {
  id: string;
  startDate: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  days: DayData[];
  length?: number; // in days
}

export interface UserProfile {
  id: string;
  name: string;
  birthdate?: string;
  height?: number; // in cm
  weight?: number; // in kg
  cycleAverageLength?: number; // average cycle length calculated from history
  periodAverageLength?: number; // average period length calculated from history
  lastUpdated: string; // YYYY-MM-DD format
}

export interface CycleInsight {
  type: 'educational' | 'prediction' | 'pattern' | 'warning';
  title: string;
  description: string;
  timestamp: string;
}

export enum CyclePhase {
  MENSTRUAL = 'menstrual',
  FOLLICULAR = 'follicular',
  OVULATION = 'ovulation',
  LUTEAL = 'luteal'
}

// For demo and development purposes only
export const PHYSICAL_SYMPTOMS: PhysicalSymptom[] = [
  'cramps', 'headache', 'backache', 'nausea', 'bloating', 
  'breast_tenderness', 'fatigue', 'acne', 'constipation', 'diarrhea'
];

export const EMOTIONAL_SYMPTOMS: EmotionalSymptom[] = [
  'mood_swings', 'anxiety', 'irritability', 'depression', 
  'calm', 'sensitive', 'happy', 'sad'
];

export const FLOW_INTENSITIES: FlowIntensity[] = ['spotting', 'light', 'medium', 'heavy'];
