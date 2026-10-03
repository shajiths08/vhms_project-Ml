"""
Prediction and Deterministic Health Score Module for Vehicle Health Monitoring
Provides:
1. predict_vehicle_health(params) -> ML inference with class probabilities
2. calculate_vehicle_health_score(params) -> Deterministic health score, status, and risk factors
Keeps ML prediction and Health Score calculation logically decoupled.
"""
import os
import joblib
import pandas as pd
import numpy as np
from ml.preprocessing import (
    standardize_dataframe, ALL_CLEAN_FEATURES, CLEAN_NUMERICAL_COLS, CLEAN_CATEGORICAL_COLS
)

# Load saved model artifacts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "models", "preprocessor.pkl")

_model = None
_preprocessor = None

def get_artifacts(force_retrain=False):
    global _model, _preprocessor
    if _model is None or _preprocessor is None or force_retrain:
        need_train = force_retrain or not os.path.exists(MODEL_PATH) or not os.path.exists(PREPROCESSOR_PATH)
        if not need_train:
            try:
                _model = joblib.load(MODEL_PATH)
                _preprocessor = joblib.load(PREPROCESSOR_PATH)
                # Verify that the loaded preprocessor is fully compatible with the active scikit-learn version
                test_df = pd.DataFrame([DEFAULT_PARAMETERS])[ALL_CLEAN_FEATURES]
                _preprocessor.transform(test_df)
            except Exception:
                need_train = True

        if need_train:
            from ml.train import train_models
            train_models()
            _model = joblib.load(MODEL_PATH)
            _preprocessor = joblib.load(PREPROCESSOR_PATH)

    return _model, _preprocessor

# Default baseline parameters for any missing optional field
DEFAULT_PARAMETERS = {
    'vehicle_age': 3,
    'engine_temp': 90,
    'engine_rpm': 2200,
    'oil_level': 85,
    'oil_quality': 85,
    'battery_voltage': 12.6,
    'battery_health': 90,
    'tire_pressure': 32,
    'brake_condition': 85,
    'coolant_level': 85,
    'fuel_consumption': 14.5,
    'fuel_tank_level': 65,
    'air_filter_condition': 85,
    'transmission_temp': 88,
    'suspension_condition': 85,
    'vibration_level': 2.0,
    'exhaust_emission': 150,
    'previous_breakdowns': 0,
    'service_history': 'Good'
}

def validate_and_format_parameters(params: dict) -> dict:
    """Validates types and fills any missing feature with standard nominal defaults."""
    formatted = {}
    
    # Pre-map incoming keys
    dummy_df = pd.DataFrame([params])
    std_df = standardize_dataframe(dummy_df)
    extracted = std_df.iloc[0].to_dict()

    for col in CLEAN_NUMERICAL_COLS:
        val = extracted.get(col, params.get(col, DEFAULT_PARAMETERS[col]))
        try:
            num_val = float(val)
            if np.isnan(num_val):
                num_val = float(DEFAULT_PARAMETERS[col])
            formatted[col] = num_val
        except (ValueError, TypeError):
            raise ValueError(f"Invalid numerical value for '{col}': {val}")

    for col in CLEAN_CATEGORICAL_COLS:
        cat_val = str(extracted.get(col, params.get(col, DEFAULT_PARAMETERS[col]))).strip()
        if cat_val not in ['Good', 'Average', 'Poor']:
            # Fallback to nearest or default
            if 'good' in cat_val.lower():
                cat_val = 'Good'
            elif 'poor' in cat_val.lower() or 'bad' in cat_val.lower():
                cat_val = 'Poor'
            else:
                cat_val = 'Average'
        formatted[col] = cat_val

    return formatted

def predict_vehicle_health(params: dict) -> dict:
    """
    Runs the trained Machine Learning pipeline to predict vehicle health status.
    
    Input:
        params: dict of vehicle parameters
    Output:
        {
            "prediction": "Healthy" | "Warning" | "Critical",
            "confidence": float (0-1),
            "probabilities": {"Healthy": float, "Warning": float, "Critical": float},
            "model_type": str
        }
    """
    model, preprocessor = get_artifacts()
    clean_params = validate_and_format_parameters(params)
    
    # Construct single-row DataFrame
    input_df = pd.DataFrame([clean_params])[ALL_CLEAN_FEATURES]
    
    # Preprocess with auto-retrain fallback on attribute error
    try:
        transformed = preprocessor.transform(input_df)
    except Exception:
        model, preprocessor = get_artifacts(force_retrain=True)
        transformed = preprocessor.transform(input_df)
    
    # Predict
    pred_class = model.predict(transformed)[0]
    
    # Probabilities
    probabilities = {}
    confidence = 1.0
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(transformed)[0]
        classes = model.classes_
        for cls, prob in zip(classes, probs):
            probabilities[str(cls)] = round(float(prob), 4)
        confidence = probabilities.get(str(pred_class), 1.0)
    else:
        probabilities = {str(pred_class): 1.0}

    return {
        "prediction": str(pred_class),
        "confidence": confidence,
        "probabilities": probabilities,
        "model_type": type(model).__name__
    }

def calculate_vehicle_health_score(params: dict) -> dict:
    """
    Deterministically computes the vehicle health score (0-100) from engineering thresholds.
    Keeps ML prediction and Health Score logically separate.
    
    Returns:
        {
            "health_score": float (0.0 - 100.0),
            "health_status": "Healthy" | "Warning" | "Critical",
            "risk_factors": list of detected warnings/faults,
            "subsystem_scores": { ... }
        }
    """
    p = validate_and_format_parameters(params)
    risk_factors = []
    penalties = 0.0

    # 1. Thermal & Engine Subsystem
    engine_temp = p['engine_temp']
    if engine_temp > 115:
        penalties += 25.0
        risk_factors.append(f"Severe Engine Overheating: {engine_temp:.1f}°C (Threshold: >115°C)")
    elif engine_temp > 100:
        penalties += 12.0
        risk_factors.append(f"Elevated Engine Temperature: {engine_temp:.1f}°C (Threshold: >100°C)")

    trans_temp = p['transmission_temp']
    if trans_temp > 110:
        penalties += 15.0
        risk_factors.append(f"High Transmission Temperature: {trans_temp:.1f}°C (Threshold: >110°C)")
    elif trans_temp > 100:
        penalties += 8.0
        risk_factors.append(f"Warm Transmission Fluid: {trans_temp:.1f}°C (Threshold: >100°C)")

    # 2. Electrical Subsystem
    battery_v = p['battery_voltage']
    if battery_v < 11.8:
        penalties += 20.0
        risk_factors.append(f"Low Battery Voltage: {battery_v:.2f}V (Threshold: <11.8V)")
    elif battery_v < 12.2:
        penalties += 8.0
        risk_factors.append(f"Borderline Battery Voltage: {battery_v:.2f}V (Threshold: <12.2V)")

    battery_h = p['battery_health']
    if battery_h < 55:
        penalties += 15.0
        risk_factors.append(f"Critical Battery Degradation: {battery_h:.0f}% (Threshold: <55%)")
    elif battery_h < 70:
        penalties += 7.0
        risk_factors.append(f"Degraded Battery Health: {battery_h:.0f}% (Threshold: <70%)")

    # 3. Fluid Levels & Quality
    oil_level = p['oil_level']
    if oil_level < 45:
        penalties += 18.0
        risk_factors.append(f"Low Engine Oil Level: {oil_level:.0f}% (Threshold: <45%)")
    elif oil_level < 60:
        penalties += 7.0
        risk_factors.append(f"Depleted Engine Oil Level: {oil_level:.0f}% (Threshold: <60%)")

    oil_qual = p['oil_quality']
    if oil_qual < 50:
        penalties += 14.0
        risk_factors.append(f"Degraded Oil Viscosity: {oil_qual:.0f}% (Threshold: <50%)")

    coolant = p['coolant_level']
    if coolant < 50:
        penalties += 18.0
        risk_factors.append(f"Insufficient Coolant Fluid: {coolant:.0f}% (Threshold: <50%)")
    elif coolant < 65:
        penalties += 8.0
        risk_factors.append(f"Low Coolant Reserve: {coolant:.0f}% (Threshold: <65%)")

    # 4. Chassis, Suspension & Tires
    vibration = p['vibration_level']
    if vibration > 4.5:
        penalties += 18.0
        risk_factors.append(f"Excessive Chassis Vibration: {vibration:.1f} mm/s (Threshold: >4.5 mm/s)")
    elif vibration > 3.2:
        penalties += 8.0
        risk_factors.append(f"Noticeable Mechanical Vibration: {vibration:.1f} mm/s (Threshold: >3.2 mm/s)")

    brake = p['brake_condition']
    if brake < 50:
        penalties += 20.0
        risk_factors.append(f"Worn Brake Pads / Lining: {brake:.0f}% (Threshold: <50%)")
    elif brake < 65:
        penalties += 8.0
        risk_factors.append(f"Moderate Brake Wear: {brake:.0f}% (Threshold: <65%)")

    tire = p['tire_pressure']
    if tire < 28 or tire > 36:
        penalties += 6.0
        risk_factors.append(f"Suboptimal Tire Pressure: {tire:.0f} PSI (Nominal: 30-34 PSI)")

    # 5. History & Reliability
    breakdowns = p['previous_breakdowns']
    if breakdowns >= 4:
        penalties += 20.0
        risk_factors.append(f"Frequent Historical Breakdowns: {breakdowns} incidents")
    elif breakdowns >= 2:
        penalties += 10.0
        risk_factors.append(f"Repeated Previous Breakdowns: {breakdowns} incidents")

    service = p['service_history']
    if service == 'Poor':
        penalties += 15.0
        risk_factors.append("Irregular Service History Logged")
    elif service == 'Average':
        penalties += 5.0

    # Calculate deterministic composite health score (bounded [0, 100])
    raw_score = 100.0 - penalties
    health_score = round(float(max(0.0, min(100.0, raw_score))), 1)

    # Determine health status based on deterministic thresholds
    if health_score >= 80.0:
        health_status = "Healthy"
    elif health_score >= 50.0:
        health_status = "Warning"
    else:
        health_status = "Critical"

    return {
        "health_score": health_score,
        "health_status": health_status,
        "risk_factors": risk_factors,
        "penalty_total": round(penalties, 1)
    }

def evaluate_vehicle(params: dict) -> dict:
    """Unified entry point returning both ML prediction and deterministic health score."""
    ml_res = predict_vehicle_health(params)
    score_res = calculate_vehicle_health_score(params)
    
    return {
        "prediction": ml_res["prediction"],
        "confidence": ml_res["confidence"],
        "probabilities": ml_res["probabilities"],
        "model_type": ml_res["model_type"],
        "health_score": score_res["health_score"],
        "deterministic_status": score_res["health_status"],
        "risk_factors": score_res["risk_factors"],
        "parameters_received": validate_and_format_parameters(params)
    }
