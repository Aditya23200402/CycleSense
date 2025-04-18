
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCycleContext } from "@/context/CycleContext";
import { EMOTIONAL_SYMPTOMS, FlowIntensity, PHYSICAL_SYMPTOMS, Symptom } from "@/types/cycle";

interface DayEntryFormProps {
  selectedDate: string | null;
  onClose: () => void;
}

export const DayEntryForm = ({ selectedDate, onClose }: DayEntryFormProps) => {
  const { 
    getEntryForDate, 
    logFlow, 
    logSymptom, 
    logNote,
    logPeriodStart, 
    logPeriodEnd 
  } = useCycleContext();
  
  const [flow, setFlow] = useState<FlowIntensity | undefined>(undefined);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Load existing data if available
  useEffect(() => {
    if (selectedDate) {
      const existingEntry = getEntryForDate(selectedDate);
      if (existingEntry) {
        setFlow(existingEntry.flow);
        setSelectedSymptoms(existingEntry.symptoms || []);
        setNotes(existingEntry.notes || "");
      } else {
        // Reset form if no existing entry
        setFlow(undefined);
        setSelectedSymptoms([]);
        setNotes("");
      }
    }
  }, [selectedDate, getEntryForDate]);
  
  if (!selectedDate) return null;
  
  const handleFlowChange = async (newFlow: FlowIntensity) => {
    try {
      setFlow(newFlow);
      await logFlow(selectedDate, newFlow);
    } catch (error) {
      console.error("Error logging flow:", error);
    }
  };
  
  const handleSymptomToggle = async (symptom: Symptom) => {
    try {
      const isSelected = selectedSymptoms.includes(symptom);
      
      if (isSelected) {
        setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
      } else {
        setSelectedSymptoms(prev => [...prev, symptom]);
      }
      
      await logSymptom(selectedDate, symptom, !isSelected);
    } catch (error) {
      console.error("Error toggling symptom:", error);
    }
  };
  
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
  };
  
  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      await logNote(selectedDate, notes);
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      setIsSaving(false);
    }
  };
  
  const handlePeriodStart = async () => {
    try {
      await logPeriodStart(selectedDate);
      setFlow('medium');
    } catch (error) {
      console.error("Error logging period start:", error);
    }
  };
  
  const handlePeriodEnd = async () => {
    try {
      await logPeriodEnd(selectedDate);
    } catch (error) {
      console.error("Error logging period end:", error);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(parseISO(selectedDate), 'MMMM d, yyyy')}
        </h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-2">Period Flow</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className={flow === 'spotting' ? 'bg-cycle-pink text-white' : ''}
              onClick={() => handleFlowChange('spotting')}
            >
              Spotting
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={flow === 'light' ? 'bg-cycle-pink text-white' : ''}
              onClick={() => handleFlowChange('light')}
            >
              Light
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={flow === 'medium' ? 'bg-cycle-pink text-white' : ''}
              onClick={() => handleFlowChange('medium')}
            >
              Medium
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={flow === 'heavy' ? 'bg-cycle-pink text-white' : ''}
              onClick={() => handleFlowChange('heavy')}
            >
              Heavy
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePeriodStart()}
            >
              Start Period
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePeriodEnd()}
            >
              End Period
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Physical Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {PHYSICAL_SYMPTOMS.map(symptom => (
              <div
                key={symptom}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                  selectedSymptoms.includes(symptom) 
                    ? 'bg-cycle-purple text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleSymptomToggle(symptom)}
              >
                {symptom.replace('_', ' ')}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Emotional State</h3>
          <div className="flex flex-wrap gap-2">
            {EMOTIONAL_SYMPTOMS.map(symptom => (
              <div
                key={symptom}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                  selectedSymptoms.includes(symptom) 
                    ? 'bg-cycle-purple text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleSymptomToggle(symptom)}
              >
                {symptom.replace('_', ' ')}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Notes</h3>
          <Textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add any additional notes for this day..."
            className="min-h-[100px]"
          />
          <Button
            size="sm"
            className="mt-2"
            onClick={handleSaveNotes}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
