"""
Dataset Analysis Script for Vehicle Health Monitoring
Analyzes rows, columns, data types, missing values, duplicates,
categorical features, numerical features, and target distribution.
"""
import os
import json
import pandas as pd
import numpy as np

def clean_column_name(c):
    return c.replace('\ufffd', '').replace('', '').strip()

def analyze_dataset(file_path):
    print("=" * 60)
    print("STEP 1: DATASET ANALYSIS REPORT")
    print("=" * 60)

    if file_path.endswith('.xlsx'):
        df = pd.read_excel(file_path)
    else:
        df = pd.read_csv(file_path)

    # Clean non-ascii / corrupted chars from column names
    df.columns = [clean_column_name(c) for c in df.columns]

    rows, cols = df.shape
    print(f"Total Rows: {rows}")
    print(f"Total Columns: {cols}")

    # Data types
    dtypes_dict = {col: str(dtype) for col, dtype in df.dtypes.items()}
    print("\nColumns & Data Types:")
    for col, dt in dtypes_dict.items():
        print(f"  - {col}: {dt}")

    # Missing values
    missing = df.isnull().sum().to_dict()
    total_missing = sum(missing.values())
    print(f"\nMissing Values Check: Total = {total_missing}")
    for col, count in missing.items():
        if count > 0:
            print(f"  - {col}: {count} missing ({count/rows*100:.1f}%)")
    if total_missing == 0:
        print("  -> Zero missing values detected across all columns.")

    # Duplicates
    duplicates = int(df.duplicated().sum())
    print(f"\nDuplicate Rows: {duplicates}")

    # Categorical and Numerical features
    # Exclude IDs and Target from feature lists
    feature_cols = [c for c in df.columns if c not in ['Vehicle_ID', 'Fleet_ID', 'Health_Status']]
    num_cols = df[feature_cols].select_dtypes(include=['number']).columns.tolist()
    cat_cols = df[feature_cols].select_dtypes(include=['object']).columns.tolist()

    print(f"\nNumerical Features ({len(num_cols)}):")
    for c in num_cols:
        print(f"  - {c} (min: {df[c].min()}, max: {df[c].max()}, mean: {df[c].mean():.2f})")

    print(f"\nCategorical Features ({len(cat_cols)}):")
    for c in cat_cols:
        print(f"  - {c}: unique values = {df[c].unique().tolist()}")

    # Target distribution
    target_col = 'Health_Status'
    print(f"\nTarget Column: '{target_col}'")
    target_dist = df[target_col].value_counts().to_dict()
    target_pct = (df[target_col].value_counts(normalize=True) * 100).round(2).to_dict()
    for status, count in target_dist.items():
        print(f"  - {status}: {count} samples ({target_pct[status]}%)")

    report = {
        "rows": rows,
        "columns": cols,
        "column_names": list(df.columns),
        "data_types": dtypes_dict,
        "missing_values": missing,
        "total_missing": total_missing,
        "duplicates": duplicates,
        "numerical_features": num_cols,
        "categorical_features": cat_cols,
        "target_column": target_col,
        "target_distribution": target_dist,
        "target_percentages": target_pct
    }

    os.makedirs("models", exist_ok=True)
    with open("models/dataset_analysis.json", "w") as f:
        json.dump(report, f, indent=2)

    print("\nDataset analysis report successfully saved to models/dataset_analysis.json")
    print("=" * 60)
    return report

if __name__ == "__main__":
    analyze_dataset("data/Fleet_Vehicle_Health_Dataset_V001_to_V200.xlsx")
