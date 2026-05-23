import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

model_path = os.path.join(
    BASE_DIR,
    "ml/models/biodiversity_model.pkl"
)

feature_scaler_path = os.path.join(
    BASE_DIR,
    "ml/models/feature_scaler.pkl"
)

model = joblib.load(model_path)

feature_scaler = joblib.load(feature_scaler_path)

print("MODEL LOADED SUCCESSFULLY")

def predict_score(features):

    scaled_features = feature_scaler.transform([features])

    prediction = model.predict(scaled_features)

    return float(prediction[0])