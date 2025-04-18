import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PCOSPredictionResult } from "@/pages/PCOSPredictor";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface PCOSResultsProps {
  result: PCOSPredictionResult;
  onReset: () => void;
}

export function PCOSResults({ result, onReset }: PCOSResultsProps) {
  const { prediction, probability, risk_level, recommendations } = result;
  
  // Format probability as percentage
  const probabilityPercent = Math.round(probability * 100);
  
  // Determine risk color and icon
  const getRiskColorAndIcon = () => {
    switch (risk_level) {
      case "High Risk":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          icon: <AlertCircle className="h-8 w-8 text-red-600" />,
        };
      case "Medium Risk":
        return {
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-800",
          icon: <Info className="h-8 w-8 text-amber-600" />,
        };
      case "Low Risk":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
        };
      default:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          icon: <Info className="h-8 w-8 text-blue-600" />,
        };
    }
  };

  const { bgColor, borderColor, textColor, icon } = getRiskColorAndIcon();

  return (
    <div className="space-y-6">
      <div className={`${bgColor} ${borderColor} border rounded-lg p-6`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
              {risk_level}: {probabilityPercent}% Probability
            </h3>
            <p className={`${textColor}`}>
              {prediction === 1 
                ? "Our model indicates you may have an elevated risk for PCOS. This is not a diagnosis, but we recommend discussing these results with your healthcare provider."
                : "Our model indicates you have a lower risk for PCOS. Continue monitoring your symptoms and maintain a healthy lifestyle."}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            Based on your assessment, here are some personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-cycle-purple"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This assessment is a screening tool and not a diagnosis. If you have concerns about PCOS or any of the symptoms you're experiencing, please consider these next steps:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-cycle-purple"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Consult with a healthcare provider, such as a gynecologist or endocrinologist</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-cycle-purple"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Continue tracking your symptoms and cycle with CycleSense</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-cycle-purple"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Focus on a balanced lifestyle with regular exercise and a nutritious diet</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onReset} 
            className="w-full bg-cycle-purple hover:bg-cycle-purple-dark"
          >
            Take Assessment Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 