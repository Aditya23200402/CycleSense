from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
import pandas as pd
import numpy as np
import pickle
import os

class PCOSPredictor:
    def __init__(self):
        self.model1 = None
        self.model2 = None
        self.model3 = None
        self.scaler = None
        self.weights = [1, 2, 1.5]  # Weights for model 1, 2, and 3
        self.normalized_weights = [w/sum(self.weights) for w in self.weights]
        
    def train(self, data_path='clean_data.csv'):
        # Load Data
        data = pd.read_csv(data_path)
        data.drop(data.columns[0], inplace=True, axis=1)
        
        cols = list(data.columns.values)
        cols.pop(cols.index('City'))
        cols.pop(cols.index('PCOS'))
        cols.pop(cols.index('PCOS_from'))
        data = data[cols+['PCOS']]
        
        data['PCOS'] = data['PCOS'].map(dict(Yes=1, No=0))
        
        x = data.drop('PCOS', axis=1)
        y = data['PCOS']
        
        # Get feature names for later use
        self.feature_names = list(x.columns)
        
        # Split and scale data
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)
        
        # Scale data
        self.scaler = StandardScaler()
        x_train_scaled = self.scaler.fit_transform(x_train)
        x_test_scaled = self.scaler.transform(x_test)
        
        # Define models with improved parameters
        self.model1 = GaussianNB()
        self.model2 = LogisticRegression(max_iter=1000, random_state=42)
        self.model3 = DecisionTreeClassifier(max_depth=5, random_state=42)
        
        # Step 1: Train model 1 on original features
        self.model1.fit(x_train_scaled, y_train)
        pred1_train = self.model1.predict(x_train_scaled).reshape(-1, 1)
        prob1_train = self.model1.predict_proba(x_train_scaled)
        
        # Step 2: Combine original features with model 1 outputs for model 2
        x_train_m2 = np.hstack((x_train_scaled, prob1_train))
        
        # Train model 2 with enhanced features
        self.model2.fit(x_train_m2, y_train)
        pred2_train = self.model2.predict(x_train_m2).reshape(-1, 1)
        prob2_train = self.model2.predict_proba(x_train_m2)
        
        # Step 3: Combine original features with model 1 and 2 outputs for model 3
        x_train_m3 = np.hstack((x_train_scaled, prob1_train, prob2_train))
        
        # Train model 3 with enhanced features
        self.model3.fit(x_train_m3, y_train)
        
    def predict(self, input_data):
        """
        Make predictions on new data
        
        Parameters:
        input_data (dict): Dictionary containing feature values
        
        Returns:
        tuple: (prediction (0 or 1), probability of PCOS (float))
        """
        # Convert input dictionary to DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Ensure the input has all required columns
        for col in self.feature_names:
            if col not in input_df.columns:
                input_df[col] = 0  # Default value if missing
        
        # Keep only the features used during training
        input_df = input_df[self.feature_names]
        
        # Scale input data
        input_scaled = self.scaler.transform(input_df)
        
        # Step 1: Get predictions from model 1
        prob1 = self.model1.predict_proba(input_scaled)
        
        # Step 2: Combine original features with model 1 outputs for model 2
        input_m2 = np.hstack((input_scaled, prob1))
        
        # Get predictions from model 2
        prob2 = self.model2.predict_proba(input_m2)
        
        # Step 3: Combine original features with model 1 and 2 outputs for model 3
        input_m3 = np.hstack((input_scaled, prob1, prob2))
        
        # Get predictions from model 3
        prob3 = self.model3.predict_proba(input_m3)
        
        # Step 4: Create final ensemble using weighted voting
        weighted_prob = (self.normalized_weights[0] * prob1[:, 1] + 
                         self.normalized_weights[1] * prob2[:, 1] + 
                         self.normalized_weights[2] * prob3[:, 1])
        
        # Convert probability to binary prediction
        prediction = (weighted_prob > 0.5).astype(int)[0]
        
        return prediction, float(weighted_prob[0])
    
    def save_model(self, model_dir='model'):
        """Save the trained model to a file"""
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
            
        model_data = {
            'model1': self.model1,
            'model2': self.model2,
            'model3': self.model3,
            'scaler': self.scaler,
            'weights': self.weights,
            'normalized_weights': self.normalized_weights,
            'feature_names': self.feature_names
        }
        
        with open(os.path.join(model_dir, 'pcos_model.pkl'), 'wb') as f:
            pickle.dump(model_data, f)
    
    def load_model(self, model_path='model/pcos_model.pkl'):
        """Load a trained model from a file"""
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
            
        self.model1 = model_data['model1']
        self.model2 = model_data['model2']
        self.model3 = model_data['model3']
        self.scaler = model_data['scaler']
        self.weights = model_data['weights']
        self.normalized_weights = model_data['normalized_weights']
        self.feature_names = model_data['feature_names']

# Train and save the model if this script is run directly
if __name__ == "__main__":
    # Path to the dataset
    data_path = 'clean_data.csv'
    
    predictor = PCOSPredictor()
    predictor.train(data_path)
    predictor.save_model()
    
    print("Model trained and saved successfully!") 