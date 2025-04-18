import { useState } from "react";
import { PCOSForm } from "@/components/pcos/PCOSForm";
import { PCOSResults } from "@/components/pcos/PCOSResults";
import { Loader2 } from "lucide-react";

// Define the prediction result interface
export interface PCOSPredictionResult {
  prediction: number;
  probability: number;
  risk_level: string;
  recommendations: string[];
}

const PCOSPredictor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PCOSPredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending prediction request to backend with data:", formData);
      
      // Convert field names to match exactly what the backend expects
      const apiData = {
        // Basic info - already converted in the form
        Period_Length: formData.Period_Length,
        Cycle_Length: formData.Cycle_Length,
        Age: formData.Age,
        
        // Other fields should already match
        Overweight: formData.Overweight,
        loss_weight_gain_weight_loss: formData.loss_weight_gain_weight_loss,
        irregular_or_missed_periods: formData.irregular_or_missed_periods,
        Difficulty_in_conceiving: formData.Difficulty_in_conceiving,
        Hair_growth_on_Chin: formData.Hair_growth_on_Chin,
        Hair_growth_on_Cheeks: formData.Hair_growth_on_Cheeks,
        Hair_growth_Between_breasts: formData.Hair_growth_Between_breasts,
        Hair_growth_on_Upper_lips: formData.Hair_growth_on_Upper_lips,
        Hair_growth_in_Arms: formData.Hair_growth_in_Arms,
        Hair_growth_on_Inner_thighs: formData.Hair_growth_on_Inner_thighs,
        Hair_thinning_or_hair_loss: formData.Hair_thinning_or_hair_loss,
        Acne_or_skin_tags: formData.Acne_or_skin_tags,
        Dark_patches: formData.Dark_patches,
        always_tired: formData.always_tired,
        more_Mood_Swings: formData.more_Mood_Swings,
        exercise_per_week: formData.exercise_per_week,
        eat_outside_per_week: formData.eat_outside_per_week,
        canned_food_often: formData.canned_food_often,
        relocated_city: formData.relocated_city
      };

      // Use environment variable for the API URL with fallback
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8001";
      
      // First try calling the debug endpoint to confirm connection
      try {
        console.log("Testing API connection with debug endpoint...");
        const debugResponse = await fetch(`${apiUrl}/debug`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ test: "connection" }),
        });
        
        if (debugResponse.ok) {
          const debugResult = await debugResponse.json();
          console.log("Debug endpoint response:", debugResult);
        } else {
          console.error("Debug endpoint failed with status:", debugResponse.status);
        }
      } catch (debugErr) {
        console.error("Debug endpoint error:", debugErr);
      }
      
      // Now proceed with the actual prediction
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Backend error:", errorData);
        throw new Error(`Error: ${response.status} - ${errorData.detail || "Unknown error"}`);
      }

      const result = await response.json();
      console.log("Prediction result:", result);
      setPredictionResult(result);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(`Failed to get prediction: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cycle-purple" />
          <p className="text-gray-600">Analyzing your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">PCOS Risk Assessment</h1>
        <p className="text-gray-600">
          Use our AI-powered model to assess your risk of Polycystic Ovary Syndrome (PCOS)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {predictionResult ? (
          <PCOSResults result={predictionResult} onReset={handleReset} />
        ) : (
          <PCOSForm onSubmit={handlePredict} />
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">Important Note:</p>
        <p>
          This tool provides an assessment based on statistical analysis and should not replace
          professional medical advice. Always consult with healthcare professionals for proper
          diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default PCOSPredictor; 