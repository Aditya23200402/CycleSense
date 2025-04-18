
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCycleContext } from "@/context/CycleContext";
import { getCyclePhaseInfo, determineCyclePhase } from "@/utils/cycleUtils";
import { CyclePhase } from "@/types/cycle";

interface CycleCalendarProps {
  onSelectDate: (date: string) => void;
}

export const CycleCalendar = ({ onSelectDate }: CycleCalendarProps) => {
  const { cycles, userProfile, nextPeriodPrediction } = useCycleContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get the most recent cycle data
  const lastCycle = cycles.length > 0 ? cycles[cycles.length - 1] : null;
  const lastPeriodStart = lastCycle ? parseISO(lastCycle.startDate) : null;
  const lastPeriodEnd = lastCycle && lastCycle.endDate ? parseISO(lastCycle.endDate) : null;
  
  // Format days
  const dayClasses = (day: Date) => {
    let classes = "h-10 w-10 rounded-full flex items-center justify-center";
    const predictedStart = nextPeriodPrediction ? parseISO(nextPeriodPrediction) : null;
    
    // Today
    if (isToday(day)) {
      classes += " border-2 border-cycle-purple";
    }
    
    // Period days (actual logged)
    if (cycles.length > 0) {
      const isDuringPeriod = cycles.some(cycle => {
        const start = parseISO(cycle.startDate);
        const end = cycle.endDate ? parseISO(cycle.endDate) : null;
        
        if (!end) {
          return isSameDay(day, start);
        }
        
        return day >= start && day <= end;
      });
      
      if (isDuringPeriod) {
        classes += " bg-cycle-pink text-white";
        return classes;
      }
    }
    
    // Predicted period days
    if (predictedStart && lastPeriodEnd) {
      const avgPeriodLength = userProfile.periodAverageLength || 5;
      const predictedEnd = new Date(predictedStart);
      predictedEnd.setDate(predictedStart.getDate() + avgPeriodLength - 1);
      
      if (day >= predictedStart && day <= predictedEnd) {
        classes += " bg-cycle-pink-light text-cycle-pink-dark border border-dashed border-cycle-pink-dark";
        return classes;
      }
    }
    
    // If we have cycle data, color based on cycle phase
    if (lastPeriodStart && userProfile.cycleAverageLength) {
      const phase = determineCyclePhase(
        day,
        format(lastPeriodStart, 'yyyy-MM-dd'),
        userProfile.cycleAverageLength,
        userProfile.periodAverageLength || 5
      );
      
      switch (phase) {
        case CyclePhase.FOLLICULAR:
          classes += " bg-cycle-blue-light text-cycle-blue-dark";
          break;
        case CyclePhase.OVULATION:
          classes += " bg-cycle-blue text-white";
          break;
        case CyclePhase.LUTEAL:
          classes += " bg-cycle-peach-light text-cycle-peach-dark";
          break;
        default:
          classes += " text-gray-600 hover:bg-gray-100";
      }
    } else {
      classes += " text-gray-600 hover:bg-gray-100";
    }
    
    return classes;
  };
  
  const getPhaseInfoForToday = () => {
    if (!lastCycle || !userProfile.cycleAverageLength) {
      return null;
    }
    
    const phase = determineCyclePhase(
      new Date(),
      lastCycle.startDate,
      userProfile.cycleAverageLength,
      userProfile.periodAverageLength || 5
    );
    
    return getCyclePhaseInfo(phase);
  };
  
  const phaseInfo = getPhaseInfoForToday();
  
  const renderCalendarDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days of the week before the first of the month */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          
          {/* Days of the month */}
          {monthDays.map(day => (
            <div 
              key={day.toString()}
              className="h-10 flex items-center justify-center"
              onClick={() => onSelectDate(format(day, 'yyyy-MM-dd'))}
            >
              <div className={dayClasses(day)}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {phaseInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium">{phaseInfo.title}</h3>
          <p className="text-xs text-gray-600 mt-1">{phaseInfo.description}</p>
        </div>
      )}
      
      <div className="calendar-container">
        {renderCalendarDays()}
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cycle-pink"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cycle-blue-light"></div>
          <span>Follicular</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cycle-blue"></div>
          <span>Ovulation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cycle-peach-light"></div>
          <span>Luteal</span>
        </div>
      </div>
    </div>
  );
};
