# CycleSense PCOS Prediction Model & API

This directory contains the PCOS prediction model and API for the CycleSense application. The model uses an ensemble learning approach with cascading technique to predict PCOS (Polycystic Ovary Syndrome) based on user data.

## Model Details

The prediction model is an ensemble of three machine learning models:
1. Gaussian Naive Bayes
2. Logistic Regression
3. Decision Tree

These models are cascaded together with weighted voting to achieve higher accuracy.

## Files

- `pcos_model.py`: Contains the model implementation and training code
- `api.py`: FastAPI implementation for serving predictions
- `requirements.txt`: Dependencies for the model and API
- `Dockerfile`: Docker configuration for containerization
- `clean_data.csv`: Dataset used for training (ensure this file is available)

## API Usage

### Running Locally

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the FastAPI server:
   ```
   python api.py
   ```

3. Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs)

### Using Docker

1. Build the Docker image:
   ```
   docker build -t cyclesense-pcos-api .
   ```

2. Run the container:
   ```
   docker run -p 8000:8000 cyclesense-pcos-api
   ```

3. Access the API at [http://localhost:8000](http://localhost:8000)

## API Endpoints

- `GET /`: Health check endpoint
- `POST /predict`: Predict PCOS based on user data

## Integration with CycleSense Frontend

The frontend integrates with this API via the PCOS prediction page, allowing users to:
1. Enter their health data
2. Get a PCOS risk assessment
3. Receive personalized recommendations

## Future Improvements

- Expand the training dataset for improved accuracy
- Add more features for prediction
- Implement model versioning
- Add authentication to the API 