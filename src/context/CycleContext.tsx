
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CycleData, CycleInsight, DayData, FlowIntensity, Symptom, UserProfile } from '../types/cycle';
import { 
  calculateCycleLength, 
  calculatePeriodLength, 
  createCycle, 
  detectIrregularities, 
  generateId, 
  getTodayFormatted, 
  predictNextPeriod 
} from '../utils/cycleUtils';
import { format, parseISO, isSameDay, addDays } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CycleContextValue {
  cycles: CycleData[];
  currentCycle?: CycleData;
  userProfile: UserProfile;
  insights: CycleInsight[];
  todayEntry?: DayData;
  isLoading: boolean;
  nextPeriodPrediction: string | null;
  
  // Actions
  logPeriodStart: (date: string) => Promise<void>;
  logPeriodEnd: (date: string) => Promise<void>;
  logFlow: (date: string, flow: FlowIntensity) => Promise<void>;
  logSymptom: (date: string, symptom: Symptom, add: boolean) => Promise<void>;
  logNote: (date: string, note: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getEntryForDate: (date: string) => DayData | undefined;
}

const CycleContext = createContext<CycleContextValue | undefined>(undefined);

export const useCycleContext = () => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycleContext must be used within a CycleProvider');
  }
  return context;
};

export const CycleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user1',
    name: '',
    lastUpdated: getTodayFormatted(),
    cycleAverageLength: 28,
    periodAverageLength: 5
  });
  const [insights, setInsights] = useState<CycleInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPeriodPrediction, setNextPeriodPrediction] = useState<string | null>(null);
  
  // Fetch user data from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        // If profile doesn't exist, create one
        if (!profileData) {
          const defaultProfile = {
            id: user.id,
            name: '',
            cycle_average_length: 28,
            period_average_length: 5,
            last_updated: getTodayFormatted()
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([defaultProfile]);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          setUserProfile({
            id: user.id,
            name: '',
            cycleAverageLength: 28,
            periodAverageLength: 5,
            lastUpdated: getTodayFormatted()
          });
        } else {
          setUserProfile({
            id: profileData.id,
            name: profileData.name || '',
            birthdate: profileData.birthdate || undefined,
            height: profileData.height || undefined,
            weight: profileData.weight || undefined,
            cycleAverageLength: profileData.cycle_average_length || 28,
            periodAverageLength: profileData.period_average_length || 5,
            lastUpdated: profileData.last_updated || getTodayFormatted()
          });
        }
        
        // Fetch cycles
        const { data: cycleData, error: cycleError } = await supabase
          .from('cycles')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false });
          
        if (cycleError) {
          console.error('Error fetching cycles:', cycleError);
          throw cycleError;
        }
        
        // Fetch days for each cycle
        if (cycleData && cycleData.length > 0) {
          const transformedCycles: CycleData[] = [];
          
          for (const cycle of cycleData) {
            const { data: daysData, error: daysError } = await supabase
              .from('days')
              .select('*')
              .eq('user_id', user.id)
              .gte('date', cycle.start_date)
              .lte('date', cycle.end_date || getTodayFormatted())
              .order('date', { ascending: true });
              
            if (daysError) {
              console.error('Error fetching days:', daysError);
              continue;
            }
            
            const transformedDays: DayData[] = daysData.map(day => ({
              id: day.id,
              date: day.date,
              flow: day.flow as FlowIntensity | undefined,
              symptoms: day.symptoms as Symptom[],
              notes: day.notes
            }));
            
            transformedCycles.push({
              id: cycle.id,
              startDate: cycle.start_date,
              endDate: cycle.end_date,
              length: cycle.length,
              days: transformedDays
            });
          }
          
          setCycles(transformedCycles);
          
          // Generate insights
          const latestCycle = transformedCycles[0];
          if (latestCycle) {
            generateInsights(transformedCycles, userProfile.cycleAverageLength || 28);
            
            // Calculate next period prediction
            const predicted = predictNextPeriod(
              latestCycle.startDate, 
              userProfile.cycleAverageLength || 28
            );
            setNextPeriodPrediction(predicted);
          }
        } else {
          // No cycles found, set empty state
          setCycles([]);
          setNextPeriodPrediction(null);
          setInsights([
            {
              type: 'educational',
              title: 'Getting Started',
              description: 'Track your cycle by logging your period days. This will help us provide personalized insights.',
              timestamp: getTodayFormatted()
            }
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Generate insights based on cycle data
  const generateInsights = (cycleData: CycleData[], avgLength: number) => {
    const newInsights: CycleInsight[] = [];
    
    // Check for irregularities
    const irregularityCheck = detectIrregularities(cycleData, avgLength);
    if (irregularityCheck.isIrregular && irregularityCheck.reason) {
      newInsights.push({
        type: 'pattern',
        title: 'Cycle Irregularity Detected',
        description: irregularityCheck.reason,
        timestamp: getTodayFormatted()
      });
    }
    
    // Add educational insight
    newInsights.push({
      type: 'educational',
      title: 'Cycle Phases',
      description: 'Your menstrual cycle has four phases: menstrual, follicular, ovulation, and luteal. Each phase affects your body differently.',
      timestamp: getTodayFormatted()
    });
    
    // Add prediction insight if we have enough data
    if (cycleData.length >= 2) {
      const lastCycle = cycleData[0];
      const predicted = predictNextPeriod(lastCycle.startDate, avgLength);
      
      newInsights.push({
        type: 'prediction',
        title: 'Next Period Prediction',
        description: `Based on your cycle history, your next period is predicted to start around ${format(parseISO(predicted), 'MMMM d, yyyy')}.`,
        timestamp: getTodayFormatted()
      });
    }
    
    setInsights(newInsights);
  };
  
  // Get the current cycle (the most recent one)
  const currentCycle = cycles.length > 0 ? cycles[0] : undefined;
  
  // Get entry for today
  const todayStr = getTodayFormatted();
  const todayEntry = currentCycle?.days.find(day => day.date === todayStr);
  
  // Helper to get an entry for a specific date
  const getEntryForDate = (date: string): DayData | undefined => {
    // Check all cycles for the date
    for (const cycle of cycles) {
      const entry = cycle.days.find(day => day.date === date);
      if (entry) return entry;
    }
    return undefined;
  };
  
  // Log the start of a new period
  const logPeriodStart = async (date: string) => {
    if (!user) {
      toast.error("You must be logged in to log period data");
      return;
    }
    
    const today = new Date();
    const entryDate = parseISO(date);
    
    // Don't allow logging in the future
    if (entryDate > today) {
      toast.error("You cannot log a period start date in the future");
      return;
    }
    
    try {
      // Create new cycle in the database
      const { data: cycleData, error: cycleError } = await supabase
        .from('cycles')
        .insert([
          { 
            user_id: user.id,
            start_date: date
          }
        ])
        .select()
        .single();
        
      if (cycleError) {
        console.error('Error creating cycle:', cycleError);
        toast.error("Error logging period start");
        return;
      }
      
      // Check if day entry exists for this date
      const { data: existingDay } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle();
        
      if (existingDay) {
        // Update existing day with flow
        const { error: updateError } = await supabase
          .from('days')
          .update({
            cycle_id: cycleData.id,
            flow: 'medium'
          })
          .eq('id', existingDay.id);
          
        if (updateError) {
          console.error('Error updating day entry:', updateError);
          toast.error("Error updating period day");
          return;
        }
      } else {
        // Create new day entry
        const { error: dayError } = await supabase
          .from('days')
          .insert([
            {
              user_id: user.id,
              cycle_id: cycleData.id,
              date: date,
              flow: 'medium',
              symptoms: []
            }
          ]);
          
        if (dayError) {
          console.error('Error creating day entry:', dayError);
          toast.error("Error logging period day");
          return;
        }
      }
      
      // Create a new cycle object
      const newCycle: CycleData = {
        id: cycleData.id,
        startDate: cycleData.start_date,
        days: [
          {
            id: generateId(),
            date: date,
            flow: 'medium',
            symptoms: []
          }
        ]
      };
      
      // Update local state
      setCycles(prev => [newCycle, ...prev]);
      toast.success("Period start logged successfully");
      
      // Update predictions and insights
      if (cycles.length > 0) {
        const avgLength = userProfile.cycleAverageLength || 28;
        const predicted = predictNextPeriod(date, avgLength);
        setNextPeriodPrediction(predicted);
        generateInsights([newCycle, ...cycles], avgLength);
      }
    } catch (error) {
      console.error('Error logging period start:', error);
      toast.error("Error logging period start");
    }
  };
  
  // Log the end of the current period
  const logPeriodEnd = async (date: string) => {
    if (!user || !currentCycle) {
      toast.error("No active cycle to end");
      return;
    }
    
    const today = new Date();
    const entryDate = parseISO(date);
    const startDate = parseISO(currentCycle.startDate);
    
    // Don't allow logging in the future
    if (entryDate > today) {
      toast.error("You cannot log a period end date in the future");
      return;
    }
    
    // Don't allow ending before it started
    if (entryDate < startDate) {
      toast.error("Period end date cannot be before start date");
      return;
    }
    
    try {
      // Calculate cycle length
      const length = Math.round((entryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Update cycle in the database
      const { error: cycleError } = await supabase
        .from('cycles')
        .update({ 
          end_date: date,
          length: length
        })
        .eq('id', currentCycle.id);
        
      if (cycleError) {
        console.error('Error updating cycle:', cycleError);
        toast.error("Error logging period end");
        return;
      }
      
      // Calculate the period length
      const periodLength = currentCycle.days.filter(day => day.flow).length;
      
      // Calculate average lengths
      const updatedCycles = [...cycles];
      updatedCycles[0] = {
        ...updatedCycles[0],
        endDate: date,
        length
      };
      
      const cycleLengths = updatedCycles
        .filter(c => c.length)
        .map(c => c.length as number);
        
      const periodLengths = updatedCycles
        .map(c => c.days.filter(day => day.flow).length)
        .filter(l => l > 0);
      
      if (cycleLengths.length > 0 && periodLengths.length > 0) {
        const avgCycleLength = Math.round(
          cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length
        );
        
        const avgPeriodLength = Math.round(
          periodLengths.reduce((sum, len) => sum + len, 0) / periodLengths.length
        );
        
        // Update profile with new averages
        await updateUserProfile({
          cycleAverageLength: avgCycleLength,
          periodAverageLength: avgPeriodLength
        });
        
        // Update next period prediction
        const predicted = predictNextPeriod(currentCycle.startDate, avgCycleLength);
        setNextPeriodPrediction(predicted);
        
        // Update local state
        setCycles(updatedCycles);
        generateInsights(updatedCycles, avgCycleLength);
      }
      
      toast.success("Period end logged successfully");
    } catch (error) {
      console.error('Error logging period end:', error);
      toast.error("Error logging period end");
    }
  };
  
  // Log flow for a specific date
  const logFlow = async (date: string, flow: FlowIntensity) => {
    if (!user) {
      toast.error("You must be logged in to log flow data");
      return;
    }
    
    if (!currentCycle) {
      toast.error("No active cycle to log flow");
      return;
    }
    
    try {
      // Check if day entry already exists
      const existingEntry = getEntryForDate(date);
      
      if (existingEntry) {
        // Update existing day
        const { error } = await supabase
          .from('days')
          .update({ flow })
          .eq('id', existingEntry.id);
          
        if (error) {
          console.error('Error updating day:', error);
          toast.error("Error logging flow");
          return;
        }
      } else {
        // Create new day
        const { data, error } = await supabase
          .from('days')
          .insert([
            {
              user_id: user.id,
              cycle_id: currentCycle.id,
              date,
              flow,
              symptoms: []
            }
          ])
          .select()
          .single();
          
        if (error) {
          console.error('Error creating day:', error);
          toast.error("Error logging flow");
          return;
        }
      }
      
      // Update local state
      setCycles(prev => {
        const updated = [...prev];
        const currentIndex = 0; // Most recent cycle is at index 0
        const current = { ...updated[currentIndex] };
        
        // Check if the date already has an entry
        const existingEntryIndex = current.days.findIndex(day => day.date === date);
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedDays = [...current.days];
          updatedDays[existingEntryIndex] = {
            ...updatedDays[existingEntryIndex],
            flow
          };
          current.days = updatedDays;
        } else {
          // Create new entry
          current.days = [
            ...current.days,
            {
              id: generateId(),
              date,
              flow,
              symptoms: []
            }
          ];
          
          // Sort days by date
          current.days.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        }
        
        updated[currentIndex] = current;
        return updated;
      });
      
      toast.success(`Flow logged as ${flow} for ${format(parseISO(date), 'MMMM d')}`);
    } catch (error) {
      console.error('Error logging flow:', error);
      toast.error("Error logging flow");
    }
  };
  
  // Log symptom for a specific date
  const logSymptom = async (date: string, symptom: Symptom, add: boolean) => {
    if (!user) {
      toast.error("You must be logged in to log symptoms");
      return;
    }
    
    if (!currentCycle) {
      toast.error("No active cycle to log symptoms");
      return;
    }
    
    try {
      // Check if day entry already exists
      const { data: existingEntry, error: fetchError } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error fetching day:', fetchError);
        toast.error("Error checking for existing day entry");
        return;
      }
      
      if (existingEntry) {
        // Update existing day
        let updatedSymptoms: Symptom[];
        
        if (add) {
          // Add symptom if not already present
          updatedSymptoms = existingEntry.symptoms.includes(symptom) 
            ? existingEntry.symptoms
            : [...existingEntry.symptoms, symptom];
        } else {
          // Remove symptom
          updatedSymptoms = existingEntry.symptoms.filter(s => s !== symptom);
        }
        
        const { error } = await supabase
          .from('days')
          .update({ symptoms: updatedSymptoms })
          .eq('id', existingEntry.id);
          
        if (error) {
          console.error('Error updating symptoms:', error);
          toast.error("Error logging symptom");
          return;
        }
      } else if (add) {
        // Create new day with symptom
        const { error } = await supabase
          .from('days')
          .insert([
            {
              user_id: user.id,
              cycle_id: currentCycle.id,
              date,
              symptoms: [symptom]
            }
          ]);
          
        if (error) {
          console.error('Error creating day with symptom:', error);
          toast.error("Error logging symptom");
          return;
        }
      } else {
        // Nothing to do if trying to remove a symptom from a non-existent day
        return;
      }
      
      // Update local state
      setCycles(prev => {
        const updated = [...prev];
        const currentIndex = 0; // Most recent cycle is at index 0
        const current = { ...updated[currentIndex] };
        
        // Check if the date already has an entry
        const existingEntryIndex = current.days.findIndex(day => day.date === date);
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedDays = [...current.days];
          const entry = { ...updatedDays[existingEntryIndex] };
          
          if (add) {
            // Add symptom if not already present
            if (!entry.symptoms.includes(symptom)) {
              entry.symptoms = [...entry.symptoms, symptom];
            }
          } else {
            // Remove symptom
            entry.symptoms = entry.symptoms.filter(s => s !== symptom);
          }
          
          updatedDays[existingEntryIndex] = entry;
          current.days = updatedDays;
        } else if (add) {
          // Create new entry if adding a symptom
          current.days = [
            ...current.days,
            {
              id: generateId(),
              date,
              symptoms: [symptom]
            }
          ];
          
          // Sort days by date
          current.days.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        }
        
        updated[currentIndex] = current;
        return updated;
      });
      
      if (add) {
        toast.success(`Added symptom: ${symptom.replace('_', ' ')}`);
      } else {
        toast.success(`Removed symptom: ${symptom.replace('_', ' ')}`);
      }
    } catch (error) {
      console.error('Error logging symptom:', error);
      toast.error("Error logging symptom");
    }
  };
  
  // Log note for a specific date
  const logNote = async (date: string, note: string) => {
    if (!user) {
      toast.error("You must be logged in to log notes");
      return;
    }
    
    if (!currentCycle) {
      toast.error("No active cycle to log notes");
      return;
    }
    
    try {
      // Check if day entry already exists
      const { data: existingEntry, error: fetchError } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error fetching day:', fetchError);
        toast.error("Error checking for existing day entry");
        return;
      }
      
      if (existingEntry) {
        // Update existing day
        const { error } = await supabase
          .from('days')
          .update({ notes: note })
          .eq('id', existingEntry.id);
          
        if (error) {
          console.error('Error updating note:', error);
          toast.error("Error saving note");
          return;
        }
      } else {
        // Create new day with note
        const { error } = await supabase
          .from('days')
          .insert([
            {
              user_id: user.id,
              cycle_id: currentCycle.id,
              date,
              symptoms: [],
              notes: note
            }
          ]);
          
        if (error) {
          console.error('Error creating day with note:', error);
          toast.error("Error saving note");
          return;
        }
      }
      
      // Update local state
      setCycles(prev => {
        const updated = [...prev];
        const currentIndex = 0; // Most recent cycle is at index 0
        const current = { ...updated[currentIndex] };
        
        // Check if the date already has an entry
        const existingEntryIndex = current.days.findIndex(day => day.date === date);
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedDays = [...current.days];
          updatedDays[existingEntryIndex] = {
            ...updatedDays[existingEntryIndex],
            notes: note
          };
          current.days = updatedDays;
        } else {
          // Create new entry
          current.days = [
            ...current.days,
            {
              id: generateId(),
              date,
              symptoms: [],
              notes: note
            }
          ];
          
          // Sort days by date
          current.days.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        }
        
        updated[currentIndex] = current;
        return updated;
      });
      
      toast.success("Note saved successfully");
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error("Error saving note");
    }
  };
  
  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      // Transform updates to match database schema
      const dbUpdates = {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.birthdate !== undefined && { birthdate: updates.birthdate }),
        ...(updates.height !== undefined && { height: updates.height }),
        ...(updates.weight !== undefined && { weight: updates.weight }),
        ...(updates.cycleAverageLength !== undefined && { cycle_average_length: updates.cycleAverageLength }),
        ...(updates.periodAverageLength !== undefined && { period_average_length: updates.periodAverageLength }),
        last_updated: getTodayFormatted()
      };
      
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Error updating profile");
        return;
      }
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...updates,
        lastUpdated: getTodayFormatted()
      }));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Error updating profile");
    }
  };
  
  const value: CycleContextValue = {
    cycles,
    currentCycle,
    userProfile,
    insights,
    todayEntry,
    isLoading,
    nextPeriodPrediction,
    logPeriodStart,
    logPeriodEnd,
    logFlow,
    logSymptom,
    logNote,
    updateUserProfile,
    getEntryForDate
  };
  
  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
};
