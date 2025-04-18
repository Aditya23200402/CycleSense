
import { useCycleContext } from "@/context/CycleContext";
import { format, parseISO } from "date-fns";
import { ActivitySquare, AlertCircle, Calendar, Info } from "lucide-react";

export const CycleInsights = () => {
  const { insights, nextPeriodPrediction, isLoading } = useCycleContext();
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  const getIconForInsightType = (type: string) => {
    switch (type) {
      case 'educational':
        return <Info className="h-5 w-5 text-cycle-blue" />;
      case 'prediction':
        return <Calendar className="h-5 w-5 text-cycle-purple" />;
      case 'pattern':
        return <ActivitySquare className="h-5 w-5 text-cycle-peach" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Cycle Insights</h2>
      <div className="space-y-4">
        {nextPeriodPrediction && (
          <div className="bg-cycle-purple-light p-4 rounded-md flex">
            <Calendar className="h-5 w-5 text-cycle-purple mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cycle-purple-dark">Next Period</h3>
              <p className="text-sm">
                Your next period is expected around {' '}
                <span className="font-medium">
                  {format(parseISO(nextPeriodPrediction), 'MMMM d, yyyy')}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-md flex ${
              insight.type === 'educational' ? 'bg-blue-50' :
              insight.type === 'prediction' ? 'bg-purple-50' :
              insight.type === 'pattern' ? 'bg-orange-50' :
              insight.type === 'warning' ? 'bg-red-50' : 'bg-gray-50'
            }`}
          >
            <div className="mr-3 mt-0.5 flex-shrink-0">
              {getIconForInsightType(insight.type)}
            </div>
            <div>
              <h3 className="font-medium">{insight.title}</h3>
              <p className="text-sm">{insight.description}</p>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && !nextPeriodPrediction && (
          <p className="text-gray-500 text-sm">
            No insights available yet. Keep tracking your cycle to get personalized insights.
          </p>
        )}
      </div>
    </div>
  );
};
