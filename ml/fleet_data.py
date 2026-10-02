"""
Fleet Data Provider and Telemetry Aggregator
Calculates dynamic fleet statistics and vehicle evaluations directly from the dataset.
"""
import os
import json
import pandas as pd
from ml.preprocessing import standardize_dataframe
from ml.predict import evaluate_vehicle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "data", "Fleet_Vehicle_Health_Dataset_V001_to_V200.xlsx")

_fleet_cache = None

def get_fleet_data():
    """
    Loads the Excel dataset, executes evaluation for all 200 vehicles,
    and returns cached vehicle list and summary statistics.
    """
    global _fleet_cache
    if _fleet_cache is not None:
        return _fleet_cache

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    df = pd.read_excel(DATASET_PATH)
    std_df = standardize_dataframe(df)

    vehicles = []
    status_counts = {"Healthy": 0, "Warning": 0, "Critical": 0}
    total_score = 0.0
    fleet_breakdown = {}

    for _, row in std_df.iterrows():
        row_dict = row.to_dict()
        eval_res = evaluate_vehicle(row_dict)

        v_id = str(row['Vehicle_ID'])
        f_id = str(row['Fleet_ID'])
        status = eval_res['prediction']
        score = eval_res['health_score']

        status_counts[status] = status_counts.get(status, 0) + 1
        total_score += score

        risk_level = "Low" if status == "Healthy" else ("Medium" if status == "Warning" else "High")

        if f_id not in fleet_breakdown:
            fleet_breakdown[f_id] = {"fleet_id": f_id, "total": 0, "Healthy": 0, "Warning": 0, "Critical": 0}
        fleet_breakdown[f_id]["total"] += 1
        fleet_breakdown[f_id][status] = fleet_breakdown[f_id].get(status, 0) + 1

        vehicles.append({
            "vehicle_id": v_id,
            "fleet_id": f_id,
            "health_score": score,
            "health_status": str(row['health_status']),
            "prediction": status,
            "confidence": eval_res['confidence'],
            "probabilities": eval_res['probabilities'],
            "risk_level": risk_level,
            "service_history": str(row['service_history']),
            "risk_factors": eval_res['risk_factors'],
            "parameters": eval_res['parameters_received']
        })

    total_vehicles = len(vehicles)
    avg_score = round(total_score / total_vehicles, 1) if total_vehicles > 0 else 0.0

    status_percentages = {
        k: round((v / total_vehicles) * 100, 1) if total_vehicles > 0 else 0.0
        for k, v in status_counts.items()
    }

    _fleet_cache = {
        "summary": {
            "total_vehicles": total_vehicles,
            "status_counts": status_counts,
            "status_percentages": status_percentages,
            "avg_health_score": avg_score,
            "fleet_breakdown": list(fleet_breakdown.values())
        },
        "vehicles": vehicles,
        "vehicle_map": {v["vehicle_id"]: v for v in vehicles}
    }

    return _fleet_cache

def get_vehicle_by_id(vehicle_id: str):
    """Retrieves full telemetry, evaluation, and parameters for a specific vehicle."""
    data = get_fleet_data()
    return data["vehicle_map"].get(vehicle_id)
