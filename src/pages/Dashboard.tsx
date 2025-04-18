
import { useState } from "react";
import { CycleCalendar } from "@/components/cycle/CycleCalendar";
import { CycleInsights } from "@/components/cycle/CycleInsights";
import { CycleStats } from "@/components/cycle/CycleStats";
import { DayEntryForm } from "@/components/cycle/DayEntryForm";
import { useCycleContext } from "@/context/CycleContext";
import { getTodayFormatted } from "@/utils/cycleUtils";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { isLoading, todayEntry } = useCycleContext();
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Today</h2>
            {todayEntry ? (
              <div className="space-y-4">
                {todayEntry.flow && (
                  <div>
                    <p className="text-sm text-gray-500">Flow</p>
                    <p className="font-medium capitalize">{todayEntry.flow}</p>
                  </div>
                )}
                
                {todayEntry.symptoms.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Symptoms</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {todayEntry.symptoms.map(symptom => (
                        <span 
                          key={symptom} 
                          className="px-2 py-1 bg-cycle-purple-light text-cycle-purple-dark text-xs rounded-full"
                        >
                          {symptom.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {todayEntry.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-sm mt-1">{todayEntry.notes}</p>
                  </div>
                )}
                
                <button 
                  className="text-sm text-cycle-purple-dark hover:underline"
                  onClick={() => setSelectedDate(getTodayFormatted())}
                >
                  Edit today's entry
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-3">No data logged for today yet.</p>
                <button 
                  className="text-sm text-cycle-purple bg-cycle-purple-light px-3 py-1.5 rounded-md hover:bg-cycle-purple hover:text-white transition-colors"
                  onClick={() => setSelectedDate(getTodayFormatted())}
                >
                  Log today
                </button>
              </div>
            )}
          </div>
          
          <CycleInsights />
          <CycleStats />
        </div>
        
        <div className="space-y-6">
          <CycleCalendar onSelectDate={handleSelectDate} />
          
          {selectedDate && (
            <div className="bg-white rounded-lg shadow p-6">
              <DayEntryForm 
                selectedDate={selectedDate} 
                onClose={handleCloseForm} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
