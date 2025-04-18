
import { useState } from "react";
import { CycleCalendar } from "@/components/cycle/CycleCalendar";
import { DayEntryForm } from "@/components/cycle/DayEntryForm";
import { CycleEducation } from "@/components/cycle/CycleEducation";
import { useCycleContext } from "@/context/CycleContext";
import { Loader2 } from "lucide-react";

const Calendar = () => {
  const { isLoading } = useCycleContext();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };
  
  const handleCloseForm = () => {
    setSelectedDate(null);
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cycle-purple" />
          <p className="text-gray-600">Loading your cycle data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Calendar & Education</h1>
        <p className="text-gray-600">
          Track your cycle and learn about reproductive health
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CycleCalendar onSelectDate={handleSelectDate} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {selectedDate ? (
            <div className="bg-white rounded-lg shadow p-6">
              <DayEntryForm 
                selectedDate={selectedDate} 
                onClose={handleCloseForm} 
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-3">
                Select a date on the calendar to log your cycle data.
              </p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow p-6">
            <CycleEducation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
