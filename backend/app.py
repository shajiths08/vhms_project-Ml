"""
Flask REST API Backend for Vehicle Health Monitoring & Maintenance Prediction
Serves real-time ML inferences, deterministic health scores, and preset samples.
"""
import os
import sys
import json
from flask import Flask, request, jsonify

# Add parent directory to sys.path so ml module can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.predict import evaluate_vehicle, get_artifacts, DEFAULT_PARAMETERS

app = Flask(__name__)

# CORS support without extra dependencies
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Presets for 1-click evaluation
SAMPLE_PRESETS = {
    "healthy": {
        "label": "Healthy Vehicle (Nominal Profile)",
        "params": {
            "vehicle_age": 2,
            "engine_temp": 88,
            "engine_rpm": 2100,
            "oil_level": 88,
            "oil_quality": 90,
            "battery_voltage": 12.6,
            "battery_health": 95,
            "tire_pressure": 32,
            "brake_condition": 92,
            "coolant_level": 90,
            "fuel_consumption": 16.5,
            "fuel_tank_level": 75,
            "air_filter_condition": 90,
            "transmission_temp": 85,
            "suspension_condition": 92,
            "vibration_level": 1.6,
            "exhaust_emission": 130,
            "previous_breakdowns": 0,
            "service_history": "Good"
        }
    },
    "warning": {
        "label": "Warning Vehicle (Developing Anomaly)",
        "params": {
            "vehicle_age": 6,
            "engine_temp": 103,
            "engine_rpm": 3100,
            "oil_level": 58,
            "oil_quality": 62,
            "battery_voltage": 12.1,
            "battery_health": 68,
            "tire_pressure": 28,
            "brake_condition": 62,
            "coolant_level": 62,
            "fuel_consumption": 13.8,
            "fuel_tank_level": 45,
            "air_filter_condition": 60,
            "transmission_temp": 102,
            "suspension_condition": 65,
            "vibration_level": 3.6,
            "exhaust_emission": 210,
            "previous_breakdowns": 2,
            "service_history": "Average"
        }
    },
    "critical": {
        "label": "Critical Vehicle (Severe Degradation)",
        "params": {
            "vehicle_age": 9,
            "engine_temp": 119,
            "engine_rpm": 3800,
            "oil_level": 38,
            "oil_quality": 42,
            "battery_voltage": 11.4,
            "battery_health": 52,
            "tire_pressure": 26,
            "brake_condition": 42,
            "coolant_level": 46,
            "fuel_consumption": 10.5,
            "fuel_tank_level": 25,
            "air_filter_condition": 42,
            "transmission_temp": 114,
            "suspension_condition": 48,
            "vibration_level": 5.2,
            "exhaust_emission": 275,
            "previous_breakdowns": 5,
            "service_history": "Poor"
        }
    }
}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Service health endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "VHM AI Prediction Engine",
        "version": "2.0.0"
    })

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Returns saved model metadata and test performance metrics."""
    metrics_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            data = json.load(f)
        return jsonify({"success": True, "data": data})
    return jsonify({"success": False, "message": "Model metrics not yet generated."}), 404

@app.route('/api/sample-inputs', methods=['GET'])
def sample_inputs():
    """Returns verified presets for evaluation."""
    return jsonify({"success": True, "presets": SAMPLE_PRESETS})

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    """
    Main prediction endpoint.
    Expects JSON payload with vehicle parameters.
    Returns ML prediction, confidence probabilities, and deterministic health score.
    """
    if request.method == 'OPTIONS':
        return ('', 204)
        
    try:
        payload = request.get_json(force=True, silent=True)
        if not payload or not isinstance(payload, dict):
            return jsonify({
                "success": False,
                "error": "Invalid request payload. Expected JSON object with vehicle telemetry parameters."
            }), 400

        result = evaluate_vehicle(payload)
        return jsonify({
            "success": True,
            **result
        })

    except ValueError as val_err:
        return jsonify({
            "success": False,
            "error": str(val_err)
        }), 400
    except Exception as err:
        return jsonify({
            "success": False,
            "error": f"Inference processing error: {str(err)}"
        }), 500

@app.route('/api/fleet/summary', methods=['GET'])
def fleet_summary():
    """Returns dynamic aggregated fleet statistics from the dataset."""
    try:
        from ml.fleet_data import get_fleet_data
        data = get_fleet_data()
        return jsonify({
            "success": True,
            **data["summary"]
        })
    except Exception as err:
        return jsonify({"success": False, "error": str(err)}), 500

@app.route('/api/fleet/vehicles', methods=['GET'])
def fleet_vehicles():
    """Returns all 200 vehicles with calculated health scores, status, and telemetry."""
    try:
        from ml.fleet_data import get_fleet_data
        data = get_fleet_data()
        return jsonify({
            "success": True,
            "total": len(data["vehicles"]),
            "vehicles": data["vehicles"]
        })
    except Exception as err:
        return jsonify({"success": False, "error": str(err)}), 500

@app.route('/api/fleet/vehicle/<vehicle_id>', methods=['GET'])
def fleet_vehicle_detail(vehicle_id):
    """Returns full details, predictions, and risk factors for a specific vehicle."""
    try:
        from ml.fleet_data import get_vehicle_by_id
        veh = get_vehicle_by_id(vehicle_id)
        if not veh:
            return jsonify({"success": False, "error": f"Vehicle '{vehicle_id}' not found."}), 404
        return jsonify({
            "success": True,
            "vehicle": veh
        })
    except Exception as err:
        return jsonify({"success": False, "error": str(err)}), 500

@app.route('/api/federated/simulation', methods=['GET'])
def federated_simulation():
    """Returns deterministic Federated Learning simulation results across Fleet A, B, and C."""
    try:
        from ml.federated import run_federated_simulation
        sim_data = run_federated_simulation()
        return jsonify({
            "success": True,
            **sim_data
        })
    except Exception as err:
        return jsonify({"success": False, "error": str(err)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0' if os.environ.get('RENDER') else '127.0.0.1'
    print(f"Starting VHM AI Backend Service on http://{host}:{port} ...")
    app.run(host=host, port=port, debug=False)
