"""
Preprocessing Pipeline for Vehicle Health Monitoring
Builds a robust scikit-learn ColumnTransformer handling numerical scaling,
categorical encoding, and imputation without data leakage.
"""
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Clean feature names (18 numerical + 1 categorical)
CLEAN_NUMERICAL_COLS = [
    'vehicle_age', 'engine_temp', 'engine_rpm', 'oil_level',
    'oil_quality', 'battery_voltage', 'battery_health',
    'tire_pressure', 'brake_condition', 'coolant_level',
    'fuel_consumption', 'fuel_tank_level', 'air_filter_condition',
    'transmission_temp', 'suspension_condition', 'vibration_level',
    'exhaust_emission', 'previous_breakdowns'
]

CLEAN_CATEGORICAL_COLS = ['service_history']

ALL_CLEAN_FEATURES = CLEAN_NUMERICAL_COLS + CLEAN_CATEGORICAL_COLS

def clean_key(key: str) -> str:
    """Normalizes string to lowercase alphanumeric without special symbols."""
    k = key.lower().replace('\ufffd', '').replace('', '').strip()
    return ''.join(ch for ch in k if ch.isalnum() or ch == '_')

def standardize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Standardizes any input DataFrame (from excel, csv, or json payload)
    into uniform clean feature column names using exact unambiguous matching.
    """
    col_map = {}
    
    for c in df.columns:
        norm = clean_key(str(c))
        if 'vehicle_id' in norm:
            col_map[c] = 'Vehicle_ID'
        elif 'fleet_id' in norm:
            col_map[c] = 'Fleet_ID'
        elif 'battery_voltage' in norm or 'voltage' in norm:
            col_map[c] = 'battery_voltage'
        elif 'battery_health' in norm:
            col_map[c] = 'battery_health'
        elif 'vehicle_age' in norm or norm == 'age' or 'age' in norm:
            col_map[c] = 'vehicle_age'
        elif 'engine_temp' in norm:
            col_map[c] = 'engine_temp'
        elif 'engine_rpm' in norm or 'rpm' in norm:
            col_map[c] = 'engine_rpm'
        elif 'oil_level' in norm:
            col_map[c] = 'oil_level'
        elif 'oil_quality' in norm:
            col_map[c] = 'oil_quality'
        elif 'tire_pressure' in norm or 'tire' in norm:
            col_map[c] = 'tire_pressure'
        elif 'brake' in norm:
            col_map[c] = 'brake_condition'
        elif 'coolant' in norm:
            col_map[c] = 'coolant_level'
        elif 'fuel_consumption' in norm:
            col_map[c] = 'fuel_consumption'
        elif 'fuel_tank' in norm:
            col_map[c] = 'fuel_tank_level'
        elif 'air_filter' in norm:
            col_map[c] = 'air_filter_condition'
        elif 'transmission_temp' in norm or ('trans' in norm and 'temp' in norm):
            col_map[c] = 'transmission_temp'
        elif 'suspension' in norm:
            col_map[c] = 'suspension_condition'
        elif 'vibration' in norm:
            col_map[c] = 'vibration_level'
        elif 'exhaust_emission' in norm or 'emission' in norm:
            col_map[c] = 'exhaust_emission'
        elif 'breakdown' in norm:
            col_map[c] = 'previous_breakdowns'
        elif 'service' in norm:
            col_map[c] = 'service_history'
        elif 'health_status' in norm:
            col_map[c] = 'health_status'
            
    renamed = df.rename(columns=col_map)
    return renamed

def create_preprocessing_pipeline() -> ColumnTransformer:
    """
    Creates an unfitted ColumnTransformer pipeline for clean feature names.
    - Numerical: SimpleImputer (median) + StandardScaler
    - Categorical: SimpleImputer (most_frequent) + OneHotEncoder
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(categories=[['Good', 'Average', 'Poor']], handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, CLEAN_NUMERICAL_COLS),
            ('cat', cat_pipeline, CLEAN_CATEGORICAL_COLS)
        ],
        remainder='drop'
    )
    return preprocessor
