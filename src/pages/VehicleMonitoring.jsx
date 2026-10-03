import React, { useState, useEffect } from 'react';
import API_BASE from '../config';
import { 
  Car, 
  Activity, 
  Cpu, 
  Gauge, 
  Thermometer, 
  Battery, 
  Sliders, 
  Info, 
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Wrench,
  ShieldCheck,
  ChevronDown,
  Layers,
  Fuel,
  Wind,
  History
} from 'lucide-react';

export default function VehicleMonitoring() {
  // 19 vehicle telemetry parameters
  const [params, setParams] = useState({
    vehicle_age: 2,
    engine_temp: 88,
    engine_rpm: 2100,
    oil_level: 88,
    oil_quality: 90,
    battery_voltage: 12.6,
    battery_health: 95,
    tire_pressure: 32,
    brake_condition: 92,
    coolant_level: 90,
    fuel_consumption: 16.5,
    fuel_tank_level: 75,
    air_filter_condition: 90,
    transmission_temp: 85,
    suspension_condition: 92,
    vibration_level: 1.6,
    exhaust_emission: 130,
    previous_breakdowns: 0,
    service_history: 'Good'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('powertrain');

  // Presets for quick evaluation
  const presets = {
    healthy: {
      name: 'Healthy Vehicle',
      data: {
        vehicle_age: 2,
        engine_temp: 88,
        engine_rpm: 2100,
        oil_level: 88,
        oil_quality: 90,
        battery_voltage: 12.6,
        battery_health: 95,
        tire_pressure: 32,
        brake_condition: 92,
        coolant_level: 90,
        fuel_consumption: 16.5,
        fuel_tank_level: 75,
        air_filter_condition: 90,
        transmission_temp: 85,
        suspension_condition: 92,
        vibration_level: 1.6,
        exhaust_emission: 130,
        previous_breakdowns: 0,
        service_history: 'Good'
      }
    },
    warning: {
      name: 'Warning Vehicle',
      data: {
        vehicle_age: 6,
        engine_temp: 104,
        engine_rpm: 3200,
        oil_level: 58,
        oil_quality: 62,
        battery_voltage: 12.1,
        battery_health: 68,
        tire_pressure: 28,
        brake_condition: 62,
        coolant_level: 62,
        fuel_consumption: 13.5,
        fuel_tank_level: 40,
        air_filter_condition: 60,
        transmission_temp: 103,
        suspension_condition: 64,
        vibration_level: 3.7,
        exhaust_emission: 215,
        previous_breakdowns: 2,
        service_history: 'Average'
      }
    },
    critical: {
      name: 'Critical Vehicle',
      data: {
        vehicle_age: 9,
        engine_temp: 120,
        engine_rpm: 3900,
        oil_level: 36,
        oil_quality: 40,
        battery_voltage: 11.4,
        battery_health: 50,
        tire_pressure: 26,
        brake_condition: 40,
        coolant_level: 45,
        fuel_consumption: 10.0,
        fuel_tank_level: 20,
        air_filter_condition: 40,
        transmission_temp: 115,
        suspension_condition: 46,
        vibration_level: 5.4,
        exhaust_emission: 280,
        previous_breakdowns: 5,
        service_history: 'Poor'
      }
    }
  };

  const handlePresetSelect = (presetKey) => {
    setParams(presets[presetKey].data);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'service_history' ? value : parseFloat(value) || 0
    }));
  };

  const validateInputs = () => {
    if (params.engine_temp === '' || isNaN(params.engine_temp) || params.engine_temp < 0 || params.engine_temp > 250) {
      return "Please enter a valid Engine Temperature between 0°C and 250°C.";
    }
    if (params.battery_voltage === '' || isNaN(params.battery_voltage) || params.battery_voltage < 5 || params.battery_voltage > 24) {
      return "Please enter a valid Battery Voltage between 5V and 24V.";
    }
    if (params.tire_pressure === '' || isNaN(params.tire_pressure) || params.tire_pressure < 0 || params.tire_pressure > 80) {
      return "Please enter a valid Tire Pressure between 0 and 80 PSI.";
    }
    if (params.engine_rpm === '' || isNaN(params.engine_rpm) || params.engine_rpm < 0 || params.engine_rpm > 10000) {
      return "Please enter a valid Engine RPM between 0 and 10,000.";
    }
    return null;
  };

  const runPrediction = async () => {
    const valError = validateInputs();
    if (valError) {
      setError(valError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Prediction service returned an error.');
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Vehicle analysis is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on load so the dashboard is live right away
  useEffect(() => {
    runPrediction();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          text: 'Healthy',
          icon: CheckCircle2,
          glow: 'shadow-emerald-500/20'
        };
      case 'Warning':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          text: 'Warning',
          icon: AlertTriangle,
          glow: 'shadow-amber-500/20'
        };
      case 'Critical':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          text: 'Critical',
          icon: XCircle,
          glow: 'shadow-rose-500/20'
        };
      default:
        return {
          bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
          text: status,
          icon: Info,
          glow: ''
        };
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Machine Learning Pipeline
            </span>
            <span className="text-xs font-mono text-slate-500">19 Telemetry Variables Ingestion</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Vehicle Health Monitoring Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Feed multi-sensor telemetry directly into the trained ML classification model and deterministic health scoring engine.
          </p>
        </div>

        {/* 1-Click Evaluation Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Load Preset:</span>
          <button
            onClick={() => handlePresetSelect('healthy')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/40 transition-colors"
          >
            Healthy Profile
          </button>
          <button
            onClick={() => handlePresetSelect('warning')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/40 text-amber-400 border border-amber-500/40 hover:bg-amber-900/40 transition-colors"
          >
            Warning Profile
          </button>
          <button
            onClick={() => handlePresetSelect('critical')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 text-rose-400 border border-rose-500/40 hover:bg-rose-900/40 transition-colors"
          >
            Critical Profile
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={runPrediction}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Grid: Form Inputs & Live ML Inference Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 19 Vehicle Telemetry Inputs */}
        <div className="lg:col-span-6 p-7 rounded-3xl automotive-card border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Telemetry Parameters (19 Inputs)</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">OBD-II Telemetry</span>
          </div>

          {/* Subsystem Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('powertrain')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'powertrain' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Powertrain &amp; Oil
            </button>
            <button
              onClick={() => setActiveTab('electrical')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'electrical' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Battery &amp; Electric
            </button>
            <button
              onClick={() => setActiveTab('chassis')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'chassis' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chassis &amp; Tires
            </button>
            <button
              onClick={() => setActiveTab('fuel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'fuel' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fuel &amp; Exhaust
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Age &amp; Service
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); runPrediction(); }} className="space-y-4">
            
            {/* Tab 1: Powertrain & Oil */}
            {activeTab === 'powertrain' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Engine Temperature (°C)</span>
                      <span className="text-slate-500 font-mono">80 - 130°C</span>
                    </label>
                    <input
                      type="number"
                      name="engine_temp"
                      value={params.engine_temp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Engine RPM</span>
                      <span className="text-slate-500 font-mono">800 - 5,000</span>
                    </label>
                    <input
                      type="number"
                      name="engine_rpm"
                      value={params.engine_rpm}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Oil Level (%)</span>
                      <span className="text-slate-500 font-mono">30 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="oil_level"
                      value={params.oil_level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Oil Quality (%)</span>
                      <span className="text-slate-500 font-mono">30 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="oil_quality"
                      value={params.oil_quality}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Coolant Level (%)</span>
                      <span className="text-slate-500 font-mono">30 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="coolant_level"
                      value={params.coolant_level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Transmission Temp (°C)</span>
                      <span className="text-slate-500 font-mono">75 - 130°C</span>
                    </label>
                    <input
                      type="number"
                      name="transmission_temp"
                      value={params.transmission_temp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Battery & Electric */}
            {activeTab === 'electrical' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Battery Voltage (V)</span>
                      <span className="text-slate-500 font-mono">10.5 - 13.5V</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="battery_voltage"
                      value={params.battery_voltage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Battery Health (%)</span>
                      <span className="text-slate-500 font-mono">40 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="battery_health"
                      value={params.battery_health}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Chassis & Tires */}
            {activeTab === 'chassis' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Tire Pressure (PSI)</span>
                      <span className="text-slate-500 font-mono">24 - 40 PSI</span>
                    </label>
                    <input
                      type="number"
                      name="tire_pressure"
                      value={params.tire_pressure}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Brake Condition (%)</span>
                      <span className="text-slate-500 font-mono">30 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="brake_condition"
                      value={params.brake_condition}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Suspension Condition (%)</span>
                      <span className="text-slate-500 font-mono">30 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="suspension_condition"
                      value={params.suspension_condition}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Vibration Level (mm/s)</span>
                      <span className="text-slate-500 font-mono">0.5 - 8.0</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="vibration_level"
                      value={params.vibration_level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Fuel & Exhaust */}
            {activeTab === 'fuel' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Fuel Consumption (km/L)</span>
                      <span className="text-slate-500 font-mono">8 - 25 km/L</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="fuel_consumption"
                      value={params.fuel_consumption}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Fuel Tank Level (%)</span>
                      <span className="text-slate-500 font-mono">10 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="fuel_tank_level"
                      value={params.fuel_tank_level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Air Filter Condition (%)</span>
                      <span className="text-slate-500 font-mono">30 - 100%</span>
                    </label>
                    <input
                      type="number"
                      name="air_filter_condition"
                      value={params.air_filter_condition}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Exhaust Emission (ppm)</span>
                      <span className="text-slate-500 font-mono">80 - 350 ppm</span>
                    </label>
                    <input
                      type="number"
                      name="exhaust_emission"
                      value={params.exhaust_emission}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Age & History */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Vehicle Age (Years)</span>
                      <span className="text-slate-500 font-mono">0 - 15 yrs</span>
                    </label>
                    <input
                      type="number"
                      name="vehicle_age"
                      value={params.vehicle_age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Previous Breakdowns</span>
                      <span className="text-slate-500 font-mono">0 - 10</span>
                    </label>
                    <input
                      type="number"
                      name="previous_breakdowns"
                      value={params.previous_breakdowns}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Service History Record</label>
                  <select
                    name="service_history"
                    value={params.service_history}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Good">Good (Regular Scheduled Maintenance)</option>
                    <option value="Average">Average (Occasional Overdue Service)</option>
                    <option value="Poor">Poor (Irregular / Infrequent Servicing)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing vehicle health...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-white" />
                    <span>Run Vehicle Diagnostics</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Real-time ML Prediction & Health Score Output */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Primary Status Card */}
              <div className="p-8 rounded-3xl automotive-card border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    ML Diagnostic Classification
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Model: {result.model_type}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Status Badge */}
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Predicted Health Status:</span>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const badge = getStatusBadge(result.prediction);
                        const IconComponent = badge.icon;
                        return (
                          <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xl font-extrabold ${badge.bg}`}>
                            <IconComponent className="w-6 h-6" />
                            <span>{badge.text}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Deterministic Health Score Gauge */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-blue-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
                      {result.health_score}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Deterministic Score</p>
                      <p className="text-[11px] text-slate-400">Scale: 0 - 100 Index</p>
                    </div>
                  </div>
                </div>

                {/* Probabilities Breakdown */}
                {result.probabilities && (
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <p className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                      <span>Model Prediction Probabilities</span>
                      <span className="font-mono text-[11px] text-blue-400">Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {Object.entries(result.probabilities).map(([cls, prob]) => (
                        <div key={cls} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                          <p className="text-[11px] text-slate-400">{cls}</p>
                          <p className="font-mono font-bold text-white mt-0.5">{(prob * 100).toFixed(1)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Risk Factors Card */}
              <div className="p-7 rounded-3xl automotive-card border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>Isolated Risk Factors &amp; Telemetry Breaches</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {result.risk_factors.length} Flag{result.risk_factors.length === 1 ? '' : 's'}
                  </span>
                </div>

                {result.risk_factors.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {result.risk_factors.map((risk, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>All 19 vehicle parameters are operating within safe manufacturer corridors.</span>
                  </div>
                )}
              </div>

              {/* Actionable Maintenance Recommendation */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 to-slate-900/60 border border-blue-500/25 flex items-start gap-3.5">
                <Wrench className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Prescriptive Maintenance Directive
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.prediction === 'Healthy' && "Continue standard operating cycle. Next scheduled routine inspection due per manufacturer mileage interval."}
                    {result.prediction === 'Warning' && "Schedule a workshop inspection within 500-1,000 km. Focus technician checklist on isolated risk parameters above to prevent accelerated component wear."}
                    {result.prediction === 'Critical' && "Immediate attention required. Severe multi-parameter degradation detected. Pull over safely or proceed immediately to certified automotive workshop."}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Loading / Initial Empty State */
            <div className="p-12 rounded-3xl automotive-card border border-dashed border-slate-700 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Activity className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">Awaiting Diagnostics Execution</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter custom parameters on the left or select a preset to trigger real-time ML model inference and health scoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
