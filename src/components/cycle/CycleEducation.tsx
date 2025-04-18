
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CyclePhase } from '@/types/cycle';
import { getCyclePhaseInfo } from '@/utils/cycleUtils';

const educationalContent = [
  {
    title: "Understanding Your Menstrual Cycle",
    content: "The menstrual cycle is a complex interplay of hormones that prepares your body for potential pregnancy each month. A typical cycle lasts about 28 days, but can range from 21 to 35 days. It consists of four main phases: menstrual, follicular, ovulation, and luteal.",
  },
  {
    title: "Hormonal Changes Throughout Your Cycle",
    content: "Your cycle is regulated by four key hormones: estrogen, progesterone, luteinizing hormone (LH), and follicle-stimulating hormone (FSH). Each plays a specific role in the different phases of your cycle, influencing everything from mood to energy levels.",
  },
  {
    title: "Common Cycle Irregularities",
    content: "Cycle irregularities can include missing periods, heavy bleeding, spotting between periods, or significant cycle length variations. While occasional irregularities are normal, persistent issues may indicate conditions like PCOS, thyroid disorders, or endometriosis.",
  },
  {
    title: "Tracking Your Cycle",
    content: "Regular tracking helps you understand your body's patterns and identify potential issues early. Pay attention to cycle length, flow intensity, symptoms, and emotional changes. Sharing this information with healthcare providers can lead to more effective care.",
  },
  {
    title: "When to Consult a Doctor",
    content: "Consult a healthcare provider if you experience: periods that last longer than 7 days, cycles shorter than 21 days or longer than 35 days, extremely heavy bleeding, severe pain, or missing three or more periods in a row.",
  },
];

export const CycleEducation = () => {
  const [expandedPhase, setExpandedPhase] = useState<CyclePhase | null>(null);
  
  const togglePhase = (phase: CyclePhase) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cycle Education</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.values(CyclePhase).map(phase => {
          const info = getCyclePhaseInfo(phase);
          const isExpanded = expandedPhase === phase;
          
          return (
            <div 
              key={phase}
              className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                isExpanded 
                  ? 'bg-white shadow-md' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => togglePhase(phase)}
            >
              <h3 className="font-medium text-lg">{info.title}</h3>
              {isExpanded && (
                <p className="mt-2 text-gray-600 animate-fade-in">{info.description}</p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Accordion type="single" collapsible className="w-full">
          {educationalContent.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="px-4">{item.title}</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-gray-700">{item.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
