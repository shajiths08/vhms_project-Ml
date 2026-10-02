"""
Federated Learning Simulation Module
Simulates decentralized model training across 3 fleet clients:
Fleet A, Fleet B, and Fleet C.
Implements Federated Averaging (FedAvg) aggregation to build the global model.
"""
import os
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from ml.preprocessing import standardize_dataframe, ALL_CLEAN_FEATURES, create_preprocessing_pipeline

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "data", "Fleet_Vehicle_Health_Dataset_V001_to_V200.xlsx")

_fl_cache = None

def run_federated_simulation():
    """
    Executes a deterministic federated learning simulation:
    1. Splits dataset into Fleet A, Fleet B, Fleet C (deterministic client partitions).
    2. Trains local LogisticRegression models on edge client data.
    3. Evaluates local models on held-out global test set.
    4. Aggregates model weights via FedAvg (weighted average of weights and biases).
    5. Evaluates global aggregated model against the same test set.
    """
    global _fl_cache
    if _fl_cache is not None:
        return _fl_cache

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    df = pd.read_excel(DATASET_PATH)
    std_df = standardize_dataframe(df)

    # 80/20 train/test split with fixed seed for determinism
    train_df, test_df = train_test_split(
        std_df, test_size=0.2, random_state=42, stratify=std_df['health_status']
    )

    preprocessor = create_preprocessing_pipeline()
    X_train_raw = train_df[ALL_CLEAN_FEATURES]
    preprocessor.fit(X_train_raw)

    X_test_trans = preprocessor.transform(test_df[ALL_CLEAN_FEATURES])
    y_test = test_df['health_status']

    # Deterministic client assignment by Fleet ID groups
    fleet_map = {
        'Fleet A (Commercial Logistics)': {
            'id': 'fleet_a',
            'fleet_ids': ['F01', 'F02', 'F03'],
            'description': 'Regional logistics delivery vans operating across urban corridors.'
        },
        'Fleet B (Urban Delivery)': {
            'id': 'fleet_b',
            'fleet_ids': ['F04', 'F05', 'F06'],
            'description': 'City-center delivery cargo units with frequent stop-and-go cycles.'
        },
        'Fleet C (Heavy Transport)': {
            'id': 'fleet_c',
            'fleet_ids': ['F07', 'F08', 'F09', 'F10'],
            'description': 'Long-haul transport trucks operating on inter-state freight routes.'
        }
    }

    local_models = {}
    local_clients = []

    for name, meta in fleet_map.items():
        client_train = train_df[train_df['Fleet_ID'].isin(meta['fleet_ids'])]
        total_client_vehicles = len(std_df[std_df['Fleet_ID'].isin(meta['fleet_ids'])])
        
        X_c = preprocessor.transform(client_train[ALL_CLEAN_FEATURES])
        y_c = client_train['health_status']

        clf = LogisticRegression(max_iter=1000, random_state=42)
        clf.fit(X_c, y_c)

        y_pred = clf.predict(X_test_trans)
        acc = accuracy_score(y_test, y_pred)
        p, r, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='macro', zero_division=0)

        local_models[name] = clf
        local_clients.append({
            'client_id': meta['id'],
            'name': name,
            'description': meta['description'],
            'assigned_fleet_ids': meta['fleet_ids'],
            'vehicle_count': total_client_vehicles,
            'training_samples': len(client_train),
            'local_metrics': {
                'accuracy': round(float(acc) * 100, 1),
                'precision': round(float(p), 4),
                'recall': round(float(r), 4),
                'f1': round(float(f1), 4)
            },
            'status': 'Completed Local Epochs'
        })

    # Federated Averaging (FedAvg) aggregation
    total_training_samples = sum(c['training_samples'] for c in local_clients)
    first_client_name = list(fleet_map.keys())[0]
    classes = local_models[first_client_name].classes_
    avg_coef = np.zeros_like(local_models[first_client_name].coef_)
    avg_intercept = np.zeros_like(local_models[first_client_name].intercept_)

    for client_meta in local_clients:
        name = client_meta['name']
        clf = local_models[name]
        weight = client_meta['training_samples'] / total_training_samples
        avg_coef += weight * clf.coef_
        avg_intercept += weight * clf.intercept_

    global_model = LogisticRegression(max_iter=1000, random_state=42)
    global_model.classes_ = classes
    global_model.coef_ = avg_coef
    global_model.intercept_ = avg_intercept

    y_global_pred = global_model.predict(X_test_trans)
    g_acc = accuracy_score(y_test, y_global_pred)
    gp, gr, gf1, _ = precision_recall_fscore_support(y_test, y_global_pred, average='macro', zero_division=0)

    _fl_cache = {
        'simulation_info': {
            'title': 'Federated Fleet Intelligence',
            'protocol': 'Federated Averaging (FedAvg)',
            'simulation_label': 'Federated Learning Simulation',
            'privacy_statement': 'Federated Learning allows participating fleets to contribute to a global model without directly sharing their raw vehicle data.',
            'total_clients': len(local_clients),
            'total_fleet_vehicles': len(std_df),
            'test_set_size': len(test_df)
        },
        'simulated_fleets': local_clients,
        'global_model': {
            'name': 'Aggregated Global Diagnostic Classifier',
            'aggregation_method': 'Federated Averaging (FedAvg)',
            'accuracy': round(float(g_acc) * 100, 1),
            'precision': round(float(gp), 4),
            'recall': round(float(gr), 4),
            'f1': round(float(gf1), 4),
            'total_participating_samples': total_training_samples
        },
        'comparison': {
            'average_local_accuracy': round(float(np.mean([c['local_metrics']['accuracy'] for c in local_clients])), 1),
            'global_accuracy': round(float(g_acc) * 100, 1),
            'accuracy_gain': round(float(g_acc * 100 - np.mean([c['local_metrics']['accuracy'] for c in local_clients])), 1)
        }
    }

    return _fl_cache
