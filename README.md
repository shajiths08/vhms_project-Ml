# Intelligent Vehicle Health Monitoring & Maintenance Prediction

> **A 2nd-Year Artificial Intelligence & Data Science Academic College Project**  
> **Student Developers:** Mohamed Shajith S & Muhammad B  
> **Faculty Mentor:** Mrs. P Nivetha (Department of AI & Data Science)

---

## 📌 Project Overview

The **Intelligent Vehicle Health Monitoring (VHM) AI Platform** is an end-to-end full-stack automotive diagnostic intelligence platform designed to predict mechanical and electrical degradation before catastrophic on-road breakdowns occur.

Modern vehicles contain dozens of Electronic Control Units (ECUs) and sensors continuously measuring engine temperature, battery voltage, oil quality, tire pressure, and chassis vibrations. Traditional On-Board Diagnostics (OBD-II) systems only trigger warning lamps *after* a component has already crossed a failure threshold. This project bridges that gap by deploying supervised machine learning models and deterministic health-score engines to provide **pre-failure anomaly prediction, plain-language driver summaries, targeted mechanic inspection directives, fleet-level diagnostics, and privacy-preserving Federated Learning simulations**.

---

## 🎯 Project Objectives

1. **Continuous Telemetry Surveillance:** Aggregate and standardize 19 distinct mechanical, electrical, thermal, and dynamic parameters across essential vehicle subsystems.
2. **Supervised Failure Prediction:** Train, evaluate, and deploy classification models to forecast vehicle health status (`Healthy`, `Warning`, `Critical`) with validated mathematical precision.
3. **Decoupled Deterministic Scoring:** Combine probabilistic machine learning outputs with standard OEM engineering threshold penalty algorithms to generate a normalized 0–100 Composite Health Score.
4. **Dual-Perspective Transparency:**
   - **Vehicle Owner Mode:** Clear, jargon-free explanations indicating driving safety and immediate urgency.
   - **Mechanic Technical Mode:** Parametric failure corridors, contributing factors, and specific workshop inspection directives.
5. **Fleet Intelligence & Triage:** Monitor commercial fleets, dynamic health distribution curves, and prioritize high-risk units for maintenance scheduling.
6. **Privacy-Preserving Federated Intelligence:** Simulate decentralized multi-client model training using Federated Averaging (FedAvg) where vehicle data never leaves client boundaries.
7. **Verifiable Audit Reporting:** Generate printable, ISO 14229-aligned diagnostic reports for insurance and workshop maintenance logs.

---

## ⚡ Core Features

- **Real-Time Telemetry Cockpit (`/vehicle-monitoring`):** Interactive parameter input with 19 sensors across 5 logical subsystem tabs, instant preset loading, and live inference evaluation.
- **Vehicle Health Dashboard (`/dashboard`):** Large circular health gauge (0–100), ML prediction status badge, categorized parameter status, and dual **Owner / Mechanic** perspective toggles.
- **Fleet Management Dashboard (`/fleet`):** Dynamic multi-unit analytics computed directly from the dataset, segmented status distribution chart, search, and multi-criteria filters.
- **Federated Fleet Intelligence (`/federated-learning`):** Deterministic Federated Learning simulation across 3 simulated fleet clients (`Fleet A`, `Fleet B`, `Fleet C`) demonstrating FedAvg parameter aggregation and accuracy improvements.
- **Automated Diagnostic Reporting (`/reports`):** Comprehensive vehicle report generator with vehicle selection, parameter summaries, risk factor breakdowns, maintenance triage, and browser print-to-PDF support.
- **Predictive Maintenance Triage (`/maintenance`):** Dynamic service queue categorizing vehicles into immediate critical dispatch vs. 7–14 day preventive maintenance.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Reactive, modular component architecture with fast HMR |
| **Styling & Design System** | Tailwind CSS + Lucide Icons | Automotive-grade dark theme, custom cards, and responsive grids |
| **Client-Side Routing** | React Router DOM v6 | Seamless multi-page navigation and deep-link query parameter parsing |
| **Backend REST API** | Python 3 + Flask | High-performance inference endpoints, JSON serialization, CORS |
| **Machine Learning Core** | scikit-learn 1.7.2 | Preprocessing ColumnTransformer, Logistic Regression, FedAvg math |
| **Data Manipulation** | pandas 2.3.3 + numpy | Data standardization, Excel ingestion, matrix operations |
| **Serialization** | joblib | Persistence of trained models (`model.pkl`) and encoders (`preprocessor.pkl`) |
| **Visualization & Reporting** | SVG Gauges + CSS Print Media | Dynamic vector visualizations and clean physical report output |

---

## 🔬 Machine Learning Pipeline & Workflow

```
[ Raw Vehicle Telemetry / Excel Dataset ]
                   │
                   ▼
  1. Data Ingestion & Standardization (standardize_dataframe)
     - Normalizes column names & cleans Unicode/BOM characters
     - Extracts 18 numerical features + 1 categorical feature
                   │
                   ▼
  2. scikit-learn ColumnTransformer Pipeline
     - Numerical: MedianImputer + StandardScaler (Z-score normalization)
     - Categorical: MostFrequentImputer + OneHotEncoder ('Good', 'Average', 'Poor')
     - Split: 80% Stratified Training / 20% Held-Out Testing (Zero Data Leakage)
                   │
                   ▼
  3. Supervised Multi-Class Classifier
     - Evaluated: Logistic Regression, Decision Tree, Random Forest
     - Winner: Logistic Regression (Simple, interpretable, deterministic)
     - Training & Cross-Validation: 5-Fold Stratified Cross-Validation (Score: 1.0000)
                   │
                   ▼
  4. Decoupled Deterministic Health Score Engine
     - Applies OEM engineering thresholds for thermal, electrical, and mechanical penalties
     - Computes normalized Composite Score (0.0 to 100.0)
     - Detects precise Risk Factors (e.g. Engine Temp > 115°C)
                   │
                   ▼
  5. JSON REST API & Frontend Visualization
     - Serves predictions, probabilities, scores, and maintenance advisories
```

---

## 📊 Dataset Description

The project utilizes the verified automotive fleet telemetry dataset: `Fleet_Vehicle_Health_Dataset_V001_to_V200.xlsx`.

- **Total Vehicle Records:** 200 units (`V001` through `V200`)
- **Fleet Partitions:** 10 Fleets (`F01` to `F10`), 20 vehicles each
- **Target Feature:** `Health_Status` (`Healthy`, `Warning`, `Critical`)
- **Missing / Duplicate Records:** 0 (Clean mathematical consistency)

### Monitored Feature Matrix (19 Parameters)

| # | Parameter | Feature Key | Nominal Range | Critical Threshold |
|---|---|---|---|---|
| 1 | Vehicle Age | `vehicle_age` | 0 – 5 Years | > 8 Years |
| 2 | Engine Temperature | `engine_temp` | 80 – 95 °C | > 115 °C |
| 3 | Engine RPM | `engine_rpm` | 1,500 – 2,800 RPM | > 3,800 RPM |
| 4 | Engine Oil Level | `oil_level` | 70 – 100 % | < 45 % |
| 5 | Engine Oil Quality | `oil_quality` | 70 – 100 % | < 50 % |
| 6 | Battery Voltage | `battery_voltage` | 12.4 – 14.5 V | < 11.8 V |
| 7 | Battery Health (SOH) | `battery_health` | 80 – 100 % | < 55 % |
| 8 | Tire Pressure | `tire_pressure` | 30 – 34 PSI | < 28 or > 36 PSI |
| 9 | Brake Pad Condition | `brake_condition` | 70 – 100 % | < 50 % |
| 10 | Coolant Fluid Level | `coolant_level` | 70 – 100 % | < 50 % |
| 11 | Fuel Consumption | `fuel_consumption` | 12 – 22 km/L | < 10 km/L |
| 12 | Fuel Tank Level | `fuel_tank_level` | 20 – 100 % | < 15 % |
| 13 | Air Filter Condition | `air_filter_condition` | 70 – 100 % | < 45 % |
| 14 | Transmission Temperature | `transmission_temp` | 75 – 95 °C | > 110 °C |
| 15 | Suspension Condition | `suspension_condition` | 70 – 100 % | < 50 % |
| 16 | Vibration Level | `vibration_level` | 0.5 – 2.5 mm/s | > 4.5 mm/s |
| 17 | Exhaust Emission | `exhaust_emission` | 80 – 180 ppm | > 260 ppm |
| 18 | Previous Breakdowns | `previous_breakdowns` | 0 Incidents | >= 4 Incidents |
| 19 | Service History | `service_history` | `Good` | `Poor` |

---

## 📈 Evaluation Results

The models were evaluated on an 80/20 stratified test split (40 held-out samples) and validated with 5-fold cross-validation:

| Model | Test Accuracy | Macro Precision | Macro Recall | Macro F1 Score | 5-Fold CV Mean |
|---|---|---|---|---|---|
| **Logistic Regression (Selected)** | **100.0%** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| Decision Tree Classifier | 100.0% | 1.0000 | 1.0000 | 1.0000 | 1.0000 |
| Random Forest Classifier | 100.0% | 1.0000 | 1.0000 | 1.0000 | 1.0000 |

*Note: The dataset represents clean synthetic engineering correlations, allowing linear separability across normal and extreme failure corridors. Logistic Regression was selected as the winner for its mathematical interpretability, low latency, and zero risk of tree-overfitting.*

---

## 🌐 Federated Learning Simulation

In commercial fleet settings, different logistics companies cannot centralize private vehicle telemetry due to corporate confidentiality and privacy laws. The project simulates **Federated Averaging (FedAvg)** across 3 partitioned fleet clients:

- **Fleet A (Commercial Logistics):** Fleets F01–F03 (60 vehicles) → **Local Accuracy: 90.0%** | **F1: 0.8241**
- **Fleet B (Urban Delivery):** Fleets F04–F06 (60 vehicles) → **Local Accuracy: 90.0%** | **F1: 0.8844**
- **Fleet C (Heavy Transport):** Fleets F07–F10 (80 vehicles) → **Local Accuracy: 92.5%** | **F1: 0.8858**

### FedAvg Aggregation Result
- **Global Model Accuracy:** **100.0%**
- **Accuracy Improvement:** **+9.2%** over local client average.
- **Privacy Guarantee:** Only mathematical weight tensors are exchanged; zero raw sensor readings or driver traces are transmitted.

---

## 📂 Folder Structure

```
myproject/
├── backend/
│   └── app.py                     # Flask REST API backend server
├── data/
│   ├── Fleet_Vehicle_Health_Dataset_V001_to_V200.xlsx  # Primary project dataset
│   └── vehicle_health_data.csv    # Auxiliary CSV format dataset
├── ml/
│   ├── data_analysis.py           # Statistical analysis and EDA script
│   ├── federated.py               # Federated Learning (FedAvg) simulation
│   ├── fleet_data.py              # Dynamic fleet aggregator and batch evaluator
│   ├── predict.py                 # Core prediction and health score engine
│   ├── preprocessing.py           # scikit-learn preprocessing ColumnTransformer
│   └── train.py                   # Model training, evaluation, and artifact generation
├── models/
│   ├── confusion_matrix.json      # Numerical test confusion matrix
│   ├── confusion_matrix.png       # Rendered confusion matrix visualization
│   ├── dataset_analysis.json      # Dataset statistical summary
│   ├── metrics.json               # Model performance metrics (accuracy, F1)
│   ├── model.pkl                  # Trained Logistic Regression artifact
│   └── preprocessor.pkl           # Fitted ColumnTransformer preprocessor
├── src/
│   ├── components/
│   │   ├── Footer.jsx             # Global responsive footer
│   │   ├── Layout.jsx             # Application shell layout
│   │   └── Navbar.jsx             # Global responsive navigation header
│   ├── pages/
│   │   ├── About.jsx              # About the project & contributor credentials
│   │   ├── Contact.jsx            # Feedback and contact form
│   │   ├── Dashboard.jsx          # Interactive vehicle health dashboard & cockpit
│   │   ├── Features.jsx           # Platform architectural features
│   │   ├── FederatedLearning.jsx  # Federated learning simulation view
│   │   ├── Fleet.jsx              # Fleet analytics and vehicle registry table
│   │   ├── Home.jsx               # Landing page with workflow walkthrough
│   │   ├── HowItWorks.jsx         # 6-step diagnostic pipeline walkthrough
│   │   ├── Login.jsx              # User authentication portal
│   │   ├── Maintenance.jsx        # Maintenance planning and triage queues
│   │   ├── Register.jsx           # Fleet driver registration portal
│   │   ├── Reports.jsx            # Printable vehicle health report generator
│   │   └── VehicleMonitoring.jsx  # Live telemetry input and custom evaluation
│   ├── App.jsx                    # React Router configuration
│   ├── index.css                  # Global Tailwind CSS and custom glassmorphism
│   └── main.jsx                   # React application entrypoint
├── tests/
│   └── test_pipeline.py           # Automated unit tests for ML pipeline
├── package.json                   # Node.js dependencies and build scripts
├── vite.config.js                 # Vite dev server configuration and API proxy
└── README.md                      # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended) & **npm**
- **Python** (v3.9+ with Anaconda or standard virtual environment)

### 1. Clone & Install Frontend Dependencies
```powershell
cd C:\Users\DELL\Desktop\myproject
npm.cmd install
```

### 2. Verify Python Dependencies
Ensure the following Python packages are installed:
```powershell
pip install pandas scikit-learn joblib flask openpyxl matplotlib seaborn
```

---

## 💻 How to Run the Platform

Running the application requires two terminal windows:

### Terminal 1 — Start the Flask ML API Backend
```powershell
cd C:\Users\DELL\Desktop\myproject
& "C:\Users\DELL\anaconda3\python.exe" backend/app.py
```
*The API will start on `http://127.0.0.1:5000`.*

### Terminal 2 — Start the Vite Frontend Development Server
```powershell
cd C:\Users\DELL\Desktop\myproject
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```
*The frontend will start on `http://127.0.0.1:5173`.*

---

## 🎬 Recommended Project Presentation Demo Flow

To demonstrate the full project workflow during an evaluation or college review:

1. **Home (`/`):** Introduce the problem of unplanned breakdowns and walk through the 5-step diagnostic pipeline.
2. **Vehicle Monitoring (`/vehicle-monitoring`):**
   - Click the **Healthy Vehicle** preset → Click **Run Vehicle Diagnostics** → Observe Score `100/100`, Status `Healthy`, 0 Risk Factors.
   - Click the **Warning Vehicle** preset → Run Diagnostics → Observe Score degradation, Status `Warning`, flagged temperature and battery risks.
   - Click the **Critical Vehicle** preset → Run Diagnostics → Observe Score `0/100`, Status `Critical`, urgent maintenance alerts.
3. **Vehicle Health Dashboard (`/dashboard`):**
   - Show the dynamic circular gauge.
   - Switch to **Vehicle Owner Mode** to demonstrate simple, non-technical explanations.
   - Switch to **Mechanic Mode** to inspect flagged technical parameters, contributing factors, and specific inspection areas.
4. **Fleet Intelligence (`/fleet`):**
   - Point out the dynamic calculated statistics (`200` total, `100` Healthy, `63` Warning, `37` Critical).
   - Demonstrate the search box by searching for `V042`.
   - Filter by Status (`Critical`) and Fleet (`Fleet F03`).
   - Click **Dashboard** on any row to deep-link that vehicle directly into the Health Dashboard.
5. **Federated Learning Simulation (`/federated-learning`):**
   - Explain the privacy architecture: raw telemetry never leaves client fleets.
   - Show the deterministic comparison: Local fleets achieve ~90% accuracy, while the **FedAvg aggregated global model** achieves 100% test accuracy (+9.2% gain).
6. **Vehicle Health Reports (`/reports`):**
   - Select vehicle `V011` (or any critical unit).
   - Review the executive meta summary, parameter breakdown, and maintenance recommendation.
   - Click **Print Report** to showcase the print-ready, high-contrast certification audit document.

---

## ⚠️ Important Project Limitations & Academic Transparency

In accordance with academic standards and realistic engineering principles:

1. **Simulated Telemetry Dataset:** The dataset is an educational, synthetically balanced 200-vehicle dataset designed to represent distinct operational and failure corridors. Real automotive field datasets contain higher noise, irregular sampling intervals, and environmental outliers.
2. **Federated Learning Simulation:** The federated learning module is a deterministic software simulation demonstrating the mathematical principles of Federated Averaging (FedAvg). It operates locally and does not constitute a distributed physical network of vehicles.
3. **AI-Assisted Diagnostics:** The system provides decision-support risk predictions rather than legally guaranteed mechanical certifications. Final repair decisions must always be verified by certified automotive mechanics.
4. **IoT Hardware Integration:** Direct physical OBD-II dongle hardware (CAN bus microcontroller streaming via Bluetooth/cellular) is identified as future work beyond the scope of this 5-day software prototype.

---

## 🔮 Future Enhancements

- **Physical OBD-II Hardware Streaming:** Integration with ESP32/ELM327 Bluetooth microcontrollers for live vehicular CAN bus streaming.
- **Deep Learning Time-Series Forensics:** Upgrading to LSTM (Long Short-Term Memory) or Transformer models to predict Remaining Useful Life (RUL) across continuous multi-day time windows.
- **GPS-Aware Service Center Dispatch:** Automated geographic routing to the nearest qualified repair workshop when critical diagnostic flags trigger.

---

## 👥 Contributors & Acknowledgements

- **Mohamed Shajith S** — 2nd-Year AI & Data Science
- **Muhammad B** — 2nd-Year AI & Data Science
- **Mrs. P Nivetha** — Faculty Project Mentor & Guide
- **Department of Artificial Intelligence & Data Science**
