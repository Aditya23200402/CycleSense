
import { useCycleContext } from "@/context/CycleContext";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  TooltipProps,
  XAxis, 
  YAxis 
} from "recharts";
import { format, parseISO } from "date-fns";
import { 
  NameType, 
  ValueType 
} from "recharts/types/component/DefaultTooltipContent";

export const CycleStats = () => {
  const { cycles, userProfile, isLoading } = useCycleContext();
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  // Calculate some basic statistics
  const cycleLengths = cycles
    .filter(cycle => cycle.length)
    .map(cycle => cycle.length as number);
  
  const averageCycleLength = userProfile.cycleAverageLength || 0;
  const periodLengths = cycles.map(cycle => cycle.days.filter(day => day.flow).length);
  const averagePeriodLength = userProfile.periodAverageLength || 0;
  
  // Prepare data for the chart
  const chartData = cycles
    .filter(cycle => cycle.length)
    .map((cycle, index) => ({
      name: `Cycle ${index + 1}`,
      cycleLength: cycle.length,
      periodLength: cycle.days.filter(day => day.flow).length,
      startDate: format(parseISO(cycle.startDate), 'MMM d'),
    }))
    .slice(-5); // Only show last 5 cycles for clarity
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-cycle-purple">
            Cycle Length: {payload[0].value} days
          </p>
          <p className="text-sm text-cycle-pink">
            Period Length: {payload[1].value} days
          </p>
          {payload[2] && (
            <p className="text-sm text-gray-500">
              Started: {payload[2].value}
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Cycle Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-cycle-purple-light p-4 rounded-md">
          <p className="text-sm text-cycle-purple-dark">Average Cycle Length</p>
          <p className="text-2xl font-bold text-cycle-purple-dark">
            {averageCycleLength > 0 ? `${averageCycleLength} days` : 'No data'}
          </p>
        </div>
        <div className="bg-cycle-pink-light p-4 rounded-md">
          <p className="text-sm text-cycle-pink-dark">Average Period Length</p>
          <p className="text-2xl font-bold text-cycle-pink-dark">
            {averagePeriodLength > 0 ? `${averagePeriodLength} days` : 'No data'}
          </p>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="startDate" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cycleLength" name="Cycle Length" fill="#9b87f5" />
              <Bar dataKey="periodLength" name="Period Length" fill="#F9A8D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          <p>Not enough cycle data to display statistics.</p>
          <p className="text-sm mt-2">Continue tracking your cycle to see patterns emerge.</p>
        </div>
      )}
    </div>
  );
};
