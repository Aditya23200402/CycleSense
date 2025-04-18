from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Union, Optional
import uvicorn
import os
# Update the import to handle both absolute and relative paths
try:
    from pcos_model import PCOSPredictor
except ImportError:
    # Try with explicit relative import
    from .pcos_model import PCOSPredictor

app = FastAPI(title="CycleSense PCOS Prediction API", 
             description="API for predicting PCOS using the CycleSense ensemble model",
             version="1.0.0")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://localhost:5173", "*"],  # Add localhost:8080
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model with better error handling
model = PCOSPredictor()
model_path = os.path.join('model', 'pcos_model.pkl')

# Check if model exists, if not train it
if os.path.exists(model_path):
    try:
        print(f"Loading model from {model_path}")
        model.load_model(model_path)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print("Training new model...")
        model.train()
        model.save_model()
        print("New model trained and saved")
else:
    print(f"Model file {model_path} not found, training new model...")
    try:
        model.train()
        model.save_model()
        print("Model trained and saved successfully")
    except Exception as e:
        print(f"Error training model: {str(e)}")
        raise

# Define input schema
class PCOSPredictionInput(BaseModel):
    """
    Input schema for PCOS prediction
    """
    Period_Length: int
    Cycle_Length: int
    Age: int
    Overweight: int
    loss_weight_gain_weight_loss: int
    irregular_or_missed_periods: int
    Difficulty_in_conceiving: int
    Hair_growth_on_Chin: int
    Hair_growth_on_Cheeks: int
    Hair_growth_Between_breasts: int
    Hair_growth_on_Upper_lips: int
    Hair_growth_in_Arms: int
    Hair_growth_on_Inner_thighs: int
    Acne_or_skin_tags: int
    Hair_thinning_or_hair_loss: int
    Dark_patches: int
    always_tired: int
    more_Mood_Swings: int
    exercise_per_week: int
    eat_outside_per_week: int
    canned_food_often: int
    relocated_city: int

# Define response schema
class PCOSPredictionOutput(BaseModel):
    """
    Output schema for PCOS prediction
    """
    prediction: int
    probability: float
    risk_level: str
    recommendations: List[str]

@app.post("/predict", response_model=PCOSPredictionOutput)
async def predict_pcos(input_data: PCOSPredictionInput):
    """
    Predict PCOS based on user inputs
    """
    try:
        # Convert input to dictionary with the expected column names
        input_dict = {
            "Period Length": input_data.Period_Length,
            "Cycle Length": input_data.Cycle_Length,
            "Age": input_data.Age,
            "Overweight": input_data.Overweight,
            "loss weight gain / weight loss": input_data.loss_weight_gain_weight_loss,
            "irregular or missed periods": input_data.irregular_or_missed_periods,
            "Difficulty in conceiving": input_data.Difficulty_in_conceiving,
            "Hair growth on Chin": input_data.Hair_growth_on_Chin,
            "Hair growth  on Cheeks": input_data.Hair_growth_on_Cheeks,
            "Hair growth Between breasts": input_data.Hair_growth_Between_breasts,
            "Hair growth  on Upper lips ": input_data.Hair_growth_on_Upper_lips,
            "Hair growth in Arms": input_data.Hair_growth_in_Arms,
            "Hair growth on Inner thighs": input_data.Hair_growth_on_Inner_thighs,
            "Acne or skin tags": input_data.Acne_or_skin_tags,
            "Hair thinning or hair loss ": input_data.Hair_thinning_or_hair_loss,
            "Dark patches": input_data.Dark_patches,
            "always tired": input_data.always_tired,
            "more Mood Swings": input_data.more_Mood_Swings,
            "exercise per week": input_data.exercise_per_week,
            "eat outside per week": input_data.eat_outside_per_week,
            "canned food often": input_data.canned_food_often,
            "relocated city": input_data.relocated_city
        }
        
        # Get prediction from model
        prediction, probability = model.predict(input_dict)
        
        # Determine risk level
        risk_level = "High Risk" if probability > 0.7 else "Medium Risk" if probability > 0.4 else "Low Risk"
        
        # Generate recommendations based on inputs and prediction
        recommendations = []
        
        if prediction == 1:
            recommendations.append("Consider consulting a healthcare provider for a comprehensive PCOS evaluation.")
            
            if input_data.irregular_or_missed_periods == 1:
                recommendations.append("Track your menstrual cycle regularly to help healthcare providers with diagnosis.")
                
            if input_data.Overweight == 1 or input_data.loss_weight_gain_weight_loss == 1:
                recommendations.append("Consider working with a nutritionist on a balanced diet plan.")
                
            if input_data.exercise_per_week < 3:
                recommendations.append("Try to incorporate moderate exercise at least 3-5 times per week.")
                
            if input_data.eat_outside_per_week > 2 or input_data.canned_food_often == 1:
                recommendations.append("Reduce processed foods and focus on whole, nutrient-rich foods.")
        else:
            recommendations.append("Your results indicate a lower risk for PCOS, but continue monitoring your symptoms.")
            
            if input_data.irregular_or_missed_periods == 1:
                recommendations.append("Track your menstrual cycle regularly and report any changes to your healthcare provider.")
            
            if input_data.exercise_per_week < 2:
                recommendations.append("Regular exercise can help maintain hormonal balance. Aim for at least 150 minutes per week.")
                
        return PCOSPredictionOutput(
            prediction=prediction,
            probability=probability,
            risk_level=risk_level,
            recommendations=recommendations
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/debug", response_model=dict)
async def debug_request(input_data: dict):
    """
    Debug endpoint to echo back the request data
    """
    return {
        "request_received": True,
        "data": input_data,
        "message": "Request received successfully",
    }

@app.get("/")
async def root():
    return {"message": "CycleSense PCOS Prediction API is running. Visit /docs for API documentation."}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 