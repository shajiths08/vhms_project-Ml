import React, { useState, useCallback } from 'react';
import API_BASE from '../config';
import {
  Car, Activity, Thermometer, Battery, Gauge, Wrench,
  ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2,
  RefreshCw, User, Settings, ChevronRight, Droplets,
  Zap, Wind, BarChart3, Info, Fuel, TrendingUp,
  CircleDot, Layers
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

// ─── Presets (same as backend SAMPLE_PRESETS) ───────────────────────────────
const PRESETS = {
  healthy: {
    label: 'Healthy Vehicle', fleetId: 'FLT-001', vehicleId: 'VIN-2024-SEDAN',
    params: {
      vehicle_age: 2, engine_temp: 88, engine_rpm: 2100,
      oil_level: 88, oil_quality: 90, battery_voltage: 12.6,
      battery_health: 95, tire_pressure: 32, brake_condition: 92,
      coolant_level: 90, fuel_consumption: 16.5, fuel_tank_level: 75,
      air_filter_condition: 90, transmission_temp: 85, suspension_condition: 92,
      vibration_level: 1.6, exhaust_emission: 130, previous_breakdowns: 0,
      service_history: 'Good'
    }
  },
  warning: {
    label: 'Warning Vehicle', fleetId: 'FLT-002', vehicleId: 'VIN-2019-SUV',
    params: {
      vehicle_age: 6, engine_temp: 103, engine_rpm: 3100,
      oil_level: 58, oil_quality: 62, battery_voltage: 12.1,
      battery_health: 68, tire_pressure: 28, brake_condition: 62,
      coolant_level: 62, fuel_consumption: 13.8, fuel_tank_level: 45,
      air_filter_condition: 60, transmission_temp: 102, suspension_condition: 65,
      vibration_level: 3.6, exhaust_emission: 210, previous_breakdowns: 2,
      service_history: 'Average'
    }
  },
  critical: {
    label: 'Critical Vehicle', fleetId: 'FLT-003', vehicleId: 'VIN-2016-TRUCK',
    params: {
      vehicle_age: 9, engine_temp: 119, engine_rpm: 3800,
      oil_level: 38, oil_quality: 42, battery_voltage: 11.4,
      battery_health: 52, tire_pressure: 26, brake_condition: 42,
      coolant_level: 46, fuel_consumption: 10.5, fuel_tank_level: 25,
      air_filter_condition: 42, transmission_temp: 114, suspension_condition: 48,
      vibration_level: 5.2, exhaust_emission: 275, previous_breakdowns: 5,
      service_history: 'Poor'
    }
  }
};

// ─── Status helpers ──────────────────────────────────────────────────────────
function statusColor(status) {
  if (status === 'Healthy') return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'stroke-emerald-400' };
  if (status === 'Warning') return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'stroke-amber-400' };
  return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', ring: 'stroke-red-400' };
}

function paramStatus(value, low, high) {
  if (value < low || value > high) return 'High';
  const midLow = low + (high - low) * 0.25;
  const midHigh = high - (high - low) * 0.25;
  if (value < midLow || value > midHigh) return 'Moderate';
  return 'Normal';
}

function paramStatusColor(s) {
  if (s === 'Normal') return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
  if (s === 'Moderate') return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
  return 'text-red-400 bg-red-500/10 border border-red-500/20';
}

// ─── Health Score SVG Gauge ──────────────────────────────────────────────────
function HealthGauge({ score, status }) {
  const c = statusColor(status);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference * 0.75; // 270° arc
  const gap = circumference - dash;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="180" height="160" viewBox="0 0 180 160">
          {/* Background arc track */}
          <circle
            cx="90" cy="100" r={radius}
            fill="none" strokeWidth="12"
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={circumference * 0.125}
            strokeLinecap="round"
            transform="rotate(-225 90 100)"
          />
          {/* Score arc */}
          <circle
            cx="90" cy="100" r={radius}
            fill="none" strokeWidth="12"
            className={c.ring}
            strokeDasharray={`${dash} ${gap + circumference * 0.25}`}
            strokeDashoffset={circumference * 0.125}
            strokeLinecap="round"
            transform="rotate(-225 90 100)"
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
          {/* Score text */}
          <text x="90" y="95" textAnchor="middle"
            className="fill-white" fontSize="30" fontWeight="700" fontFamily="monospace">
            {score}
          </text>
          <text x="90" y="115" textAnchor="middle"
            fill="rgba(148,163,184,0.8)" fontSize="11">
            out of 100
          </text>
        </svg>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${c.text} ${c.bg} ${c.border} tracking-widest uppercase`}>
        {status}
      </span>
    </div>
  );
}

// ─── Simple bar chart (current values only — no fake history) ───────────────
function SimpleBarChart({ label, value, min, max, unit, status }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const barColor =
    status === 'Normal' ? 'bg-emerald-500' :
    status === 'Moderate' ? 'bg-amber-500' :
    'bg-red-500';

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-mono font-semibold">{value} {unit}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Owner Mode panel ────────────────────────────────────────────────────────
function OwnerPanel({ prediction, healthScore, riskFactors, params }) {
  const hasIssues = riskFactors.length > 0;

  const simpleMessages = {
    'Healthy': {
      headline: '✅ Your vehicle is in great shape!',
      summary: 'All key systems are operating within normal ranges. No immediate action required.',
      action: 'Continue your regular maintenance schedule to keep it this way.'
    },
    'Warning': {
      headline: '⚠️ Your vehicle may need attention soon.',
      summary: 'Some systems are showing early signs of wear or are operating outside ideal ranges.',
      action: 'We recommend scheduling a service check within the next 1–2 weeks.'
    },
    'Critical': {
      headline: '🚨 Your vehicle needs immediate attention.',
      summary: 'One or more critical systems are in a potentially unsafe or failure-prone state.',
      action: 'Please visit a mechanic as soon as possible. Do not delay service.'
    }
  };

  const msg = simpleMessages[prediction] || simpleMessages['Warning'];

  // Map technical risk factor text to plain-English descriptions
  const simplifyRisk = (rf) => {
    if (rf.includes('Engine Overheating') || rf.includes('Engine Temperature'))
      return 'The engine temperature is higher than expected. This can lead to overheating.';
    if (rf.includes('Transmission Temperature'))
      return 'The gearbox is running hot. This can cause gear-shifting problems.';
    if (rf.includes('Battery Voltage'))
      return 'The battery charge is low. Your car may have trouble starting.';
    if (rf.includes('Battery Degradation') || rf.includes('Battery Health'))
      return 'The battery is ageing and may not hold charge well.';
    if (rf.includes('Oil Level'))
      return 'Engine oil is running low. This reduces engine protection.';
    if (rf.includes('Oil Viscosity'))
      return 'The engine oil quality has degraded and may not lubricate properly.';
    if (rf.includes('Coolant'))
      return 'Coolant fluid is low. This helps keep the engine from overheating.';
    if (rf.includes('Vibration'))
      return 'The vehicle is vibrating more than usual. This may indicate a mechanical issue.';
    if (rf.includes('Brake'))
      return 'The brake pads are worn. Your braking distance may be longer than usual.';
    if (rf.includes('Tire Pressure'))
      return 'Tire pressure is outside the recommended range. This can affect handling and safety.';
    if (rf.includes('Breakdowns'))
      return 'This vehicle has had repeated breakdowns in the past. Extra monitoring is advised.';
    if (rf.includes('Service History'))
      return 'Maintenance history is incomplete or irregular. Regular servicing is recommended.';
    return rf;
  };

  return (
    <div className="space-y-5">
      <div className={`p-5 rounded-2xl border ${statusColor(prediction).bg} ${statusColor(prediction).border}`}>
        <p className={`text-lg font-bold ${statusColor(prediction).text}`}>{msg.headline}</p>
        <p className="text-sm text-slate-300 mt-1">{msg.summary}</p>
        <p className="text-sm text-slate-400 mt-2 italic">{msg.action}</p>
      </div>

      {hasIssues && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">What we found:</h4>
          {riskFactors.map((rf, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300">{simplifyRisk(rf)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <p className="text-xs text-blue-300 font-semibold uppercase mb-1">Recommended Action</p>
        <p className="text-sm text-slate-300">{msg.action}</p>
      </div>
    </div>
  );
}

// ─── Mechanic Mode panel ─────────────────────────────────────────────────────
function MechanicPanel({ prediction, healthScore, riskFactors, params, probabilities }) {
  const conditions = {
    'Healthy': {
      condition: 'No significant fault detected',
      summary: 'All subsystems are operating within manufacturer tolerances. No diagnostic fault codes expected.',
    },
    'Warning': {
      condition: 'Developing anomaly — early degradation pattern detected',
      summary: 'Multiple subsystem parameters are approaching or slightly exceeding threshold limits. Escalation likely without intervention.',
    },
    'Critical': {
      condition: 'Potential multi-system failure — immediate inspection required',
      summary: 'Severe parameter deviations detected across one or more critical subsystems. Risk of imminent breakdown or safety hazard.',
    }
  };

  const info = conditions[prediction] || conditions['Warning'];

  // Build inspection map from risk factors
  const inspectionMap = [];
  riskFactors.forEach(rf => {
    if (rf.includes('Engine') || rf.includes('Oil')) {
      inspectionMap.push({ system: 'Engine & Lubrication', items: ['Engine oil level and viscosity', 'Oil pressure sensor', 'Engine cooling circuit'], params: ['Engine Temperature', 'Engine RPM', 'Oil Level', 'Oil Quality'] });
    }
    if (rf.includes('Coolant') || rf.includes('Overheating')) {
      inspectionMap.push({ system: 'Cooling System', items: ['Coolant reservoir level', 'Radiator integrity', 'Thermostat function', 'Cooling fan operation'], params: ['Engine Temperature', 'Coolant Level'] });
    }
    if (rf.includes('Battery') || rf.includes('Voltage')) {
      inspectionMap.push({ system: 'Electrical System', items: ['Battery terminal condition', 'Alternator output voltage', 'Charging circuit integrity'], params: ['Battery Voltage', 'Battery Health'] });
    }
    if (rf.includes('Transmission')) {
      inspectionMap.push({ system: 'Transmission', items: ['Transmission fluid level and condition', 'Torque converter', 'Transmission cooler'], params: ['Transmission Temperature'] });
    }
    if (rf.includes('Brake')) {
      inspectionMap.push({ system: 'Braking System', items: ['Brake pad thickness', 'Brake disc condition', 'Brake fluid level'], params: ['Brake Condition'] });
    }
    if (rf.includes('Vibration')) {
      inspectionMap.push({ system: 'Suspension & Drivetrain', items: ['Wheel balance and alignment', 'Driveshaft U-joints', 'Suspension bushings'], params: ['Vibration Level', 'Suspension Condition'] });
    }
    if (rf.includes('Tire')) {
      inspectionMap.push({ system: 'Tires', items: ['Tire pressure re-inflation to 32–34 PSI', 'Tread depth inspection', 'Tire rotation if needed'], params: ['Tire Pressure'] });
    }
  });

  // Deduplicate by system
  const seen = new Set();
  const uniqueInspections = inspectionMap.filter(item => {
    if (seen.has(item.system)) return false;
    seen.add(item.system);
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Potential Condition */}
      <div className={`p-5 rounded-2xl border ${statusColor(prediction).bg} ${statusColor(prediction).border}`}>
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Potential Condition</p>
        <p className={`text-base font-bold ${statusColor(prediction).text}`}>{info.condition}</p>
        <p className="text-sm text-slate-400 mt-1">{info.summary}</p>
      </div>

      {/* ML confidence */}
      <div className="p-4 rounded-2xl automotive-card border border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Model Classification Confidence</p>
        <div className="space-y-2">
          {Object.entries(probabilities).sort((a, b) => b[1] - a[1]).map(([cls, prob]) => (
            <div key={cls} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${statusColor(cls).text}`}>{cls}</span>
                <span className="text-white font-mono">{(prob * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${statusColor(cls).ring.replace('stroke-', 'bg-')}`}
                  style={{ width: `${prob * 100}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Parameters */}
      {riskFactors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase">Flagged Parameters</p>
          {riskFactors.map((rf, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-mono text-slate-300">{rf}</p>
            </div>
          ))}
        </div>
      )}

      {/* Inspection Recommendations */}
      {uniqueInspections.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase">Recommended Inspection</p>
          {uniqueInspections.map((ins, i) => (
            <div key={i} className="p-4 rounded-2xl automotive-card border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-bold text-white">{ins.system}</p>
              </div>
              <p className="text-xs text-slate-500 mb-2">Relevant parameters: <span className="text-slate-400">{ins.params.join(', ')}</span></p>
              <ul className="space-y-1">
                {ins.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-xs text-slate-400">
                    <ChevronRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {riskFactors.length === 0 && (
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-emerald-300">
          No fault flags triggered. All parameters within acceptable engineering thresholds.
        </div>
      )}
    </div>
  );
}

// ─── Maintenance Recommendation Card ─────────────────────────────────────────
function MaintenanceCard({ prediction, riskFactors, healthScore }) {
  const priority = prediction === 'Critical' ? 'High' : prediction === 'Warning' ? 'Medium' : 'Low';
  const prioColor = priority === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
    priority === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  const recommendations = {
    'Healthy': [{
      issue: 'Routine Maintenance',
      action: 'Continue standard service schedule — oil change, tire rotation, and brake inspection at next mileage milestone.',
      reason: 'All parameters are within nominal ranges. Preventive maintenance maintains vehicle reliability.'
    }],
    'Warning': [
      {
        issue: 'Subsystem Degradation — Early Stage',
        action: 'Schedule a full vehicle inspection within 7–14 days.',
        reason: `Health score is ${healthScore}/100. ${riskFactors.length} parameter(s) are approaching threshold limits.`
      },
      {
        issue: 'Fluid & Filter Service',
        action: 'Check and top up engine oil, coolant, and replace air filter if needed.',
        reason: 'Fluid and filter conditions are contributing to the current warning state.'
      }
    ],
    'Critical': [
      {
        issue: 'Immediate Mechanical Inspection Required',
        action: 'Take vehicle off-route and visit a mechanic immediately.',
        reason: `Health score is ${healthScore}/100. ${riskFactors.length} critical parameter(s) have exceeded safe thresholds.`
      },
      {
        issue: 'Do Not Ignore',
        action: 'Continued operation may result in vehicle failure, safety risk, or increased repair costs.',
        reason: 'Critical thresholds indicate potential imminent system failure.'
      }
    ]
  };

  const recs = recommendations[prediction] || recommendations['Warning'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${prioColor}`}>
          Priority: {priority}
        </span>
        <span className="text-xs text-slate-500">Based on current telemetry analysis</span>
      </div>
      {recs.map((rec, i) => (
        <div key={i} className="p-5 rounded-2xl automotive-card border border-slate-800 space-y-3">
          <div className="flex gap-2 items-start">
            <Wrench className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">{rec.issue}</p>
              <p className="text-xs text-slate-300 mt-1">{rec.action}</p>
            </div>
          </div>
          <div className="pl-6 border-l border-slate-700">
            <p className="text-xs text-slate-500"><span className="text-slate-400 font-semibold">Reason: </span>{rec.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Parameter Overview ──────────────────────────────────────────────────────
const PARAM_CATEGORIES = [
  {
    label: 'Engine', icon: Thermometer, params: [
      { key: 'engine_temp', label: 'Engine Temperature', unit: '°C', min: 70, max: 130, nom: [70, 100] },
      { key: 'engine_rpm', label: 'Engine RPM', unit: 'RPM', min: 600, max: 5000, nom: [800, 3500] },
      { key: 'oil_level', label: 'Oil Level', unit: '%', min: 0, max: 100, nom: [60, 100] },
      { key: 'oil_quality', label: 'Oil Quality', unit: '%', min: 0, max: 100, nom: [55, 100] },
    ]
  },
  {
    label: 'Electrical', icon: Battery, params: [
      { key: 'battery_voltage', label: 'Battery Voltage', unit: 'V', min: 10, max: 14.8, nom: [12.2, 14.5] },
      { key: 'battery_health', label: 'Battery Health', unit: '%', min: 0, max: 100, nom: [65, 100] },
    ]
  },
  {
    label: 'Fuel', icon: Fuel, params: [
      { key: 'fuel_consumption', label: 'Fuel Consumption', unit: 'km/L', min: 5, max: 30, nom: [12, 25] },
      { key: 'fuel_tank_level', label: 'Fuel Tank', unit: '%', min: 0, max: 100, nom: [20, 100] },
      { key: 'air_filter_condition', label: 'Air Filter', unit: '%', min: 0, max: 100, nom: [50, 100] },
      { key: 'exhaust_emission', label: 'Exhaust Emission', unit: 'g/km', min: 80, max: 450, nom: [80, 200] },
    ]
  },
  {
    label: 'Braking', icon: Gauge, params: [
      { key: 'brake_condition', label: 'Brake Condition', unit: '%', min: 0, max: 100, nom: [55, 100] },
      { key: 'tire_pressure', label: 'Tire Pressure', unit: 'PSI', min: 18, max: 42, nom: [30, 34] },
    ]
  },
  {
    label: 'Cooling', icon: Droplets, params: [
      { key: 'coolant_level', label: 'Coolant Level', unit: '%', min: 0, max: 100, nom: [60, 100] },
    ]
  },
  {
    label: 'Transmission', icon: Settings, params: [
      { key: 'transmission_temp', label: 'Transmission Temp', unit: '°C', min: 50, max: 140, nom: [50, 100] },
    ]
  },
  {
    label: 'Suspension', icon: Activity, params: [
      { key: 'suspension_condition', label: 'Suspension', unit: '%', min: 0, max: 100, nom: [55, 100] },
      { key: 'vibration_level', label: 'Vibration Level', unit: 'mm/s', min: 0, max: 10, nom: [0, 3.2] },
    ]
  },
];

function getParamStatus(key, value) {
  const cat = PARAM_CATEGORIES.flatMap(c => c.params).find(p => p.key === key);
  if (!cat) return 'Normal';
  const [nomLow, nomHigh] = cat.nom;
  if (value < nomLow || value > nomHigh) return 'High';
  const margin = (nomHigh - nomLow) * 0.15;
  if (value < nomLow + margin || value > nomHigh - margin) return 'Moderate';
  return 'Normal';
}

// ─── Main Dashboard Component ────────────────────────────────────────────────
export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const vehicleParam = searchParams.get('vehicle');

  const [selectedPreset, setSelectedPreset] = useState('healthy');
  const [viewMode, setViewMode] = useState('owner'); // 'owner' | 'mechanic'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState({ vehicleId: PRESETS.healthy.vehicleId, fleetId: PRESETS.healthy.fleetId });

  const runPrediction = useCallback(async (presetKey) => {
    const preset = PRESETS[presetKey];
    setLoading(true);
    setError(null);
    setVehicleInfo({ vehicleId: preset.vehicleId, fleetId: preset.fleetId });
    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset.params)
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Prediction failed');
      setResult(data);
    } catch (err) {
      setError("Vehicle analysis is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVehicleById = useCallback(async (vId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/fleet/vehicle/${vId}`);
      if (!res.ok) throw new Error(`Vehicle ${vId} not found in fleet database`);
      const data = await res.json();
      if (!data.success || !data.vehicle) throw new Error(data.error || 'Failed to fetch vehicle');
      
      const v = data.vehicle;
      setVehicleInfo({ vehicleId: v.vehicle_id, fleetId: v.fleet_id });
      setResult({
        prediction: v.prediction,
        confidence: v.confidence,
        probabilities: v.probabilities,
        model_type: 'LogisticRegression',
        health_score: v.health_score,
        deterministic_status: v.health_status,
        risk_factors: v.risk_factors,
        parameters_received: v.parameters,
        success: true
      });
    } catch (err) {
      console.warn('Could not load vehicle from param:', err);
      setError("Vehicle analysis is temporarily unavailable. Please try again.");
      runPrediction('healthy');
    } finally {
      setLoading(false);
    }
  }, [runPrediction]);

  // Load either vehicle from query param or default preset
  React.useEffect(() => {
    if (vehicleParam) {
      loadVehicleById(vehicleParam);
    } else {
      runPrediction('healthy');
    }
  }, [vehicleParam, loadVehicleById, runPrediction]);

  const handlePresetChange = (key) => {
    setSelectedPreset(key);
    runPrediction(key);
  };

  const p = result?.parameters_received || PRESETS[selectedPreset].params;
  const prediction = result?.prediction || 'Healthy';
  const healthScore = result?.health_score ?? 100;
  const detStatus = result?.deterministic_status || 'Healthy';
  const riskFactors = result?.risk_factors || [];
  const probabilities = result?.probabilities || { Healthy: 1, Warning: 0, Critical: 0 };
  const c = statusColor(prediction);

  // Chart data: key params with their nominal ranges
  const chartParams = [
    { key: 'engine_temp', label: 'Engine Temp', unit: '°C', min: 70, max: 130 },
    { key: 'battery_voltage', label: 'Battery Voltage', unit: 'V', min: 10, max: 15 },
    { key: 'tire_pressure', label: 'Tire Pressure', unit: 'PSI', min: 18, max: 42 },
    { key: 'vibration_level', label: 'Vibration', unit: 'mm/s', min: 0, max: 10 },
    { key: 'coolant_level', label: 'Coolant Level', unit: '%', min: 0, max: 100 },
    { key: 'brake_condition', label: 'Brake Condition', unit: '%', min: 0, max: 100 },
  ];

  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              AI Analytics
            </span>
            <span className="text-xs text-slate-500 font-mono">Vehicle Health Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Vehicle Health Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400">Real-time ML-powered health assessment from actual vehicle telemetry.</p>
        </div>

        {/* Owner / Mechanic toggle */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('owner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'owner' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <User className="w-3.5 h-3.5" /> Vehicle Owner
          </button>
          <button
            onClick={() => setViewMode('mechanic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'mechanic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Wrench className="w-3.5 h-3.5" /> Mechanic
          </button>
        </div>
      </div>

      {/* ── Vehicle Selector + Info ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${selectedPreset === key
                ? `${statusColor(key === 'healthy' ? 'Healthy' : key === 'warning' ? 'Warning' : 'Critical').bg} ${statusColor(key === 'healthy' ? 'Healthy' : key === 'warning' ? 'Warning' : 'Critical').text} ${statusColor(key === 'healthy' ? 'Healthy' : key === 'warning' ? 'Warning' : 'Critical').border}`
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 ml-auto text-xs text-slate-500 font-mono">
          <span>Vehicle: <span className="text-white font-semibold">{vehicleInfo.vehicleId}</span></span>
          <span>Fleet: <span className="text-white font-semibold">{vehicleInfo.fleetId}</span></span>
          <Link to="/vehicle-monitoring" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors">
            Custom Input <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-400">Backend Connection Error</p>
            <p className="text-xs text-red-300 mt-0.5">{error}</p>
            <p className="text-xs text-slate-500 mt-1">Make sure the Flask backend is running: <code className="font-mono">python backend/app.py</code></p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
          Analyzing vehicle health...
        </div>
      )}

      {/* ── KPI Row ── */}
      {result && !loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score KPI */}
            <div className={`p-5 rounded-2xl automotive-card border ${c.border} col-span-2 lg:col-span-1`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase">Health Score</span>
                <Activity className={`w-4 h-4 ${c.text}`} />
              </div>
              <div className={`text-4xl font-extrabold font-mono ${c.text}`}>{healthScore}<span className="text-xl text-slate-500">/100</span></div>
              <p className="text-xs text-slate-500 mt-1">Deterministic threshold model</p>
            </div>

            {/* ML Prediction */}
            <div className="p-5 rounded-2xl automotive-card border border-slate-800">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase">ML Prediction</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className={`text-2xl font-extrabold ${c.text}`}>{prediction}</div>
              <p className="text-xs text-slate-500 mt-1">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            </div>

            {/* Risk Flags */}
            <div className="p-5 rounded-2xl automotive-card border border-slate-800">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase">Risk Flags</span>
                <AlertTriangle className={`w-4 h-4 ${riskFactors.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>
              <div className={`text-4xl font-extrabold font-mono ${riskFactors.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {riskFactors.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">{riskFactors.length === 0 ? 'No issues detected' : 'Parameters flagged'}</p>
            </div>

            {/* Maintenance Urgency */}
            <div className="p-5 rounded-2xl automotive-card border border-slate-800">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase">Maintenance</span>
                <Wrench className="w-4 h-4 text-blue-400" />
              </div>
              <div className={`text-2xl font-extrabold ${prediction === 'Critical' ? 'text-red-400' : prediction === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {prediction === 'Critical' ? 'Immediate' : prediction === 'Warning' ? 'Soon' : 'Routine'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Service urgency</p>
            </div>
          </div>

          {/* ── Main Content: Gauge + Mode Panel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Health Gauge */}
            <div className="lg:col-span-1 p-6 rounded-2xl automotive-card border border-slate-800 flex flex-col items-center gap-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider self-start">Composite Health Score</h3>
              <HealthGauge score={healthScore} status={detStatus} />
              <div className="w-full space-y-2 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">Vehicle: <span className="text-slate-300 font-semibold">{vehicleInfo.vehicleId}</span></p>
                <p className="text-xs text-slate-500 text-center">Fleet: <span className="text-slate-300 font-semibold">{vehicleInfo.fleetId}</span></p>
              </div>
            </div>

            {/* Owner / Mechanic Panel */}
            <div className="lg:col-span-2 p-6 rounded-2xl automotive-card border border-slate-800">
              <div className="flex items-center gap-2 mb-5">
                {viewMode === 'owner'
                  ? <><User className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Owner View</h3></>
                  : <><Wrench className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Mechanic View</h3></>
                }
              </div>
              {viewMode === 'owner'
                ? <OwnerPanel prediction={prediction} healthScore={healthScore} riskFactors={riskFactors} params={p} />
                : <MechanicPanel prediction={prediction} healthScore={healthScore} riskFactors={riskFactors} params={p} probabilities={probabilities} />
              }
            </div>
          </div>

          {/* ── Parameter Charts (current values) ── */}
          <div className="p-6 rounded-2xl automotive-card border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Current Parameter Status</h3>
              <span className="text-xs text-slate-600 ml-auto italic">Displaying current readings — no fabricated history</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chartParams.map(cp => {
                const val = p[cp.key];
                const st = getParamStatus(cp.key, val);
                return (
                  <SimpleBarChart
                    key={cp.key}
                    label={cp.label}
                    value={val}
                    min={cp.min}
                    max={cp.max}
                    unit={cp.unit}
                    status={st}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Parameter Overview by Category ── */}
          <div className="p-6 rounded-2xl automotive-card border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <CircleDot className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Parameter Overview</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {PARAM_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase">{cat.label}</span>
                    </div>
                    <div className="space-y-2">
                      {cat.params.map(param => {
                        const val = p[param.key];
                        const st = getParamStatus(param.key, val);
                        return (
                          <div key={param.key} className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">{param.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-white">{val} {param.unit}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paramStatusColor(st)}`}>{st}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Service history & history separately */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase">History</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Previous Breakdowns</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white">{p.previous_breakdowns}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paramStatusColor(p.previous_breakdowns >= 4 ? 'High' : p.previous_breakdowns >= 2 ? 'Moderate' : 'Normal')}`}>
                        {p.previous_breakdowns >= 4 ? 'High' : p.previous_breakdowns >= 2 ? 'Moderate' : 'Normal'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Service History</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paramStatusColor(p.service_history === 'Good' ? 'Normal' : p.service_history === 'Average' ? 'Moderate' : 'High')}`}>
                      {p.service_history}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Vehicle Age</span>
                    <span className="text-xs font-mono text-white">{p.vehicle_age} yrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Maintenance Recommendations ── */}
          <div className="p-6 rounded-2xl automotive-card border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Maintenance Recommendation</h3>
            </div>
            <MaintenanceCard prediction={prediction} riskFactors={riskFactors} healthScore={healthScore} />
          </div>

          {/* ── Model Info Footer ── */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 border-t border-slate-800 pt-4">
            <span>Model: <span className="text-slate-400">{result.model_type}</span></span>
            <span>ML Prediction: <span className={`font-semibold ${c.text}`}>{prediction}</span></span>
            <span>Confidence: <span className="text-slate-400">{(result.confidence * 100).toFixed(1)}%</span></span>
            <span>Threshold Score: <span className="text-slate-400">{healthScore}/100</span></span>
            <span className="ml-auto">
              <Link to="/vehicle-monitoring" className="text-blue-400 hover:text-blue-300 transition-colors">
                → Input custom vehicle data
              </Link>
            </span>
          </div>
        </>
      )}

      {/* Empty state before first load */}
      {!result && !loading && !error && (
        <div className="text-center py-20 text-slate-500">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-slate-700" />
          <p>Select a vehicle preset above to load the dashboard.</p>
        </div>
      )}
    </div>
  );
}
