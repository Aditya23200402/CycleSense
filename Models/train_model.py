from pcos_model import PCOSPredictor

# Train and save the model
print("Training PCOS prediction model...")
predictor = PCOSPredictor()
predictor.train(data_path='clean_data.csv')
predictor.save_model()
print("Model trained and saved successfully!") 