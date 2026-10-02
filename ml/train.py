"""
Model Training & Evaluation Script for Vehicle Health Monitoring
Trains Logistic Regression, Decision Tree, and Random Forest models.
Evaluates Accuracy, Precision, Recall, F1-Score, and Confusion Matrix.
Selects and saves the best model and preprocessor.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)

from preprocessing import (
    standardize_dataframe, create_preprocessing_pipeline,
    ALL_CLEAN_FEATURES, CLEAN_NUMERICAL_COLS, CLEAN_CATEGORICAL_COLS
)

def train_and_evaluate(data_path="data/Fleet_Vehicle_Health_Dataset_V001_to_V200.xlsx"):
    print("=" * 65)
    print("STEP 3: MODEL TRAINING & EVALUATION")
    print("=" * 65)

    if data_path.endswith('.xlsx'):
        df = pd.read_excel(data_path)
    else:
        df = pd.read_csv(data_path)

    df_clean = standardize_dataframe(df)

    X = df_clean[ALL_CLEAN_FEATURES]
    y = df_clean['health_status']

    # Class ordering
    classes = ['Healthy', 'Warning', 'Critical']
    print(f"Total dataset: {len(X)} samples with {len(ALL_CLEAN_FEATURES)} features.")
    print("Class breakdown:\n", y.value_counts())

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTrain samples: {len(X_train)} | Test samples: {len(X_test)}")
    print("Test split class distribution:\n", y_test.value_counts())

    # Fit Preprocessing Pipeline ONLY on training set (Prevent Data Leakage)
    preprocessor = create_preprocessing_pipeline()
    X_train_transformed = preprocessor.fit_transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)

    # Models to compare
    candidate_models = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000, class_weight='balanced', random_state=42
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=5, min_samples_leaf=2, class_weight='balanced', random_state=42
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=100, max_depth=8, min_samples_leaf=2,
            class_weight='balanced', random_state=42
        )
    }

    results = {}
    fitted_models = {}

    print("\nEvaluating Candidate Models...")
    print("-" * 65)

    for name, model in candidate_models.items():
        # Train
        model.fit(X_train_transformed, y_train)
        fitted_models[name] = model

        # Predict on held-out test split
        y_pred = model.predict(X_test_transformed)

        # Calculate metrics
        acc = accuracy_score(y_test, y_pred)
        prec_macro = precision_score(y_test, y_pred, average='macro', zero_division=0)
        rec_macro = recall_score(y_test, y_pred, average='macro', zero_division=0)
        f1_macro = f1_score(y_test, y_pred, average='macro', zero_division=0)
        f1_weighted = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_test, y_pred, labels=classes).tolist()

        results[name] = {
            "accuracy": round(float(acc), 4),
            "precision_macro": round(float(prec_macro), 4),
            "recall_macro": round(float(rec_macro), 4),
            "f1_macro": round(float(f1_macro), 4),
            "f1_weighted": round(float(f1_weighted), 4),
            "confusion_matrix": cm,
            "classification_report": classification_report(y_test, y_pred, labels=classes, zero_division=0, output_dict=True)
        }

        print(f"Model: {name}")
        print(f"  Accuracy:         {acc * 100:.2f}%")
        print(f"  Precision (Macro):{prec_macro:.4f}")
        print(f"  Recall (Macro):   {rec_macro:.4f}")
        print(f"  F1-Score (Macro): {f1_macro:.4f}")
        print("  Confusion Matrix:")
        for row, cls in zip(cm, classes):
            print(f"    {cls:8s}: {row}")
        print("-" * 65)

    # Select best model based on macro F1-score (or accuracy if tied)
    best_name = max(results.keys(), key=lambda k: (results[k]["f1_macro"], results[k]["accuracy"]))
    best_model = fitted_models[best_name]
    best_metrics = results[best_name]

    print(f"\nWINNING MODEL: {best_name}")
    print(f"  Selected based on real evaluation: Accuracy = {best_metrics['accuracy']*100:.2f}%, Macro F1 = {best_metrics['f1_macro']:.4f}")

    # STEP 4: SAVE ARTIFACTS
    os.makedirs("models", exist_ok=True)

    # Save model and preprocessor
    joblib.dump(best_model, "models/model.pkl")
    joblib.dump(preprocessor, "models/preprocessor.pkl")

    # Save metrics JSON
    metrics_summary = {
        "selected_model": best_name,
        "classes": classes,
        "features": ALL_CLEAN_FEATURES,
        "candidate_results": results,
        "selected_model_metrics": best_metrics
    }
    with open("models/metrics.json", "w") as f:
        json.dump(metrics_summary, f, indent=2)

    # Save confusion matrix data
    cm_data = {
        "model": best_name,
        "classes": classes,
        "matrix": best_metrics["confusion_matrix"]
    }
    with open("models/confusion_matrix.json", "w") as f:
        json.dump(cm_data, f, indent=2)

    # Generate and save visual confusion matrix plot
    plt.figure(figsize=(7, 6))
    cm_arr = np.array(best_metrics["confusion_matrix"])
    sns.heatmap(cm_arr, annot=True, fmt="d", cmap="Blues",
                xticklabels=classes, yticklabels=classes, cbar=False)
    plt.title(f"Confusion Matrix — {best_name} (Test Set)", fontsize=13, pad=12)
    plt.xlabel("Predicted Health Status", fontsize=11)
    plt.ylabel("Actual Health Status", fontsize=11)
    plt.tight_layout()
    plt.savefig("models/confusion_matrix.png", dpi=200)
    plt.close()

    print("\nSaved Artifacts:")
    print("  -> models/model.pkl")
    print("  -> models/preprocessor.pkl")
    print("  -> models/metrics.json")
    print("  -> models/confusion_matrix.json")
    print("  -> models/confusion_matrix.png")
    print("=" * 65)

    return metrics_summary

if __name__ == "__main__":
    train_and_evaluate()
