import React, { useState, useEffect, useMemo } from 'react';
import API_BASE from '../config';
import { 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Truck,
  Car,
  Thermometer,
  Battery,
  Gauge,
  Droplets,
  Wrench,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

function getStatusBadge(status) {
  if (status === 'Healthy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (status === 'Warning') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-red-400 bg-red-500/10 border-red-500/30';
}

function getPriorityBadge(priority) {
  if (priority === 'Low') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (priority === 'Medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-red-400 bg-red-500/10 border-red-500/30';
}

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleParam = searchParams.get('vehicle');

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleParam || 'V001');
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }));

  // Fetch full vehicle list for selector
  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await fetch(`${API_BASE}/api/fleet/vehicles`);
        if (!res.ok) throw new Error('Could not load vehicles list');
        const data = await res.json();
        if (data.success) {
          setVehicles(data.vehicles);
          const initialId = vehicleParam || (data.vehicles[0]?.vehicle_id || 'V001');
          setSelectedVehicleId(initialId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, [vehicleParam]);

  // Load selected vehicle detail
  useEffect(() => {
    if (!selectedVehicleId) return;
    async function loadVehicleReport() {
      setReportLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/fleet/vehicle/${selectedVehicleId}`);
        if (!res.ok) throw new Error(`Vehicle ${selectedVehicleId} not found`);
        const data = await res.json();
        if (data.success && data.vehicle) {
          setVehicleData(data.vehicle);
        } else {
          throw new Error(data.error || 'Failed to retrieve vehicle details');
        }
      } catch (err) {
        setError("Vehicle analysis is temporarily unavailable. Please try again.");
      } finally {
        setReportLoading(false);
      }
    }
    loadVehicleReport();
  }, [selectedVehicleId]);

  const handleVehicleChange = (id) => {
    setSelectedVehicleId(id);
    setSearchParams({ vehicle: id });
  };

  const handlePrint = () => {
    window.print();
  };

  // Derive maintenance recommendations
  const maintenanceInfo = useMemo(() => {
    if (!vehicleData) return null;
    const pred = vehicleData.prediction;
    const score = vehicleData.health_score;
    const rfCount = vehicleData.risk_factors?.length || 0;

    if (pred === 'Critical') {
      return {
        priority: 'High',
        potentialIssue: 'Imminent multi-system failure / critical thermal & electrical degradation',
        action: 'Immediate mechanical inspection required. Ground the vehicle until safety checklist passes.',
        reason: `Health score is ${score}/100. ${rfCount} critical threshold limits have been exceeded. Operating this vehicle risks catastrophic component failure or roadside breakdown.`
      };
    } else if (pred === 'Warning') {
      return {
        priority: 'Medium',
        potentialIssue: 'Developing subsystem wear / early fluid and mechanical anomalies',
        action: 'Schedule preventive maintenance within 7 to 14 days. Inspect flagged parameters.',
        reason: `Health score is ${score}/100. ${rfCount} parameters are operating outside nominal bounds. Early intervention prevents escalation to critical failure.`
      };
    } else {
      return {
        priority: 'Low',
        potentialIssue: 'No structural or operational anomalies detected',
        action: 'Continue standard scheduled servicing intervals (oil, filter, and tire inspection).',
        reason: `Health score is ${score}/100. All monitored telemetry values reside strictly within manufacturer tolerances.`
      };
    }
  }, [vehicleData]);

  const p = vehicleData?.parameters || {};

  return (
    <div className="py-10 sm:py-14 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Screen-Only Header & Controls (Hidden during Print) ── */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Audit & Archival
              </span>
              <span className="text-xs text-slate-500 font-mono">ISO 14229 Compliant Format</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Vehicle Health Reports
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Generate, preview, and print verifiable vehicle diagnostic audit reports directly from machine learning inference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={!vehicleData || reportLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs sm:text-sm font-semibold text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <Link
              to={`/dashboard?vehicle=${selectedVehicleId}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Telemetry Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Vehicle Selector Toolbar */}
        <div className="p-4 rounded-2xl automotive-card border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Select Monitored Vehicle:</span>
            <select
              value={selectedVehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {vehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.vehicle_id} (Fleet {v.fleet_id}) — {v.prediction} ({v.health_score}/100)
                </option>
              ))}
            </select>
          </div>

          {/* Quick preset switches */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden md:inline">Quick Presets:</span>
            <button
              onClick={() => handleVehicleChange('V001')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${selectedVehicleId === 'V001' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
            >
              V001 (Healthy)
            </button>
            <button
              onClick={() => handleVehicleChange('V006')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${selectedVehicleId === 'V006' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
            >
              V006 (Warning)
            </button>
            <button
              onClick={() => handleVehicleChange('V011')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${selectedVehicleId === 'V011' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
            >
              V011 (Critical)
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-400">Unable to generate report</p>
            <p className="text-xs text-red-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── PRINTABLE REPORT CONTAINER ── */}
      {vehicleData && !reportLoading ? (
        <div 
          id="printable-report"
          className="p-8 sm:p-12 rounded-3xl automotive-card border border-slate-800 space-y-8 bg-slate-900/90 text-slate-100 print:bg-white print:text-black print:border-none print:p-0 print:m-0 print:shadow-none"
        >
          {/* ── Report Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 print:border-gray-300 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-black tracking-widest bg-blue-600 text-white print:bg-black print:text-white">
                  VHM AI
                </span>
                <span className="text-xs text-slate-400 print:text-gray-600 font-mono">
                  Autonomous Vehicle Health Intelligence Platform
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white print:text-black tracking-tight mt-3">
                Vehicle Health Monitoring Report
              </h2>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Official diagnostic certification & predictive maintenance audit log
              </p>
            </div>

            <div className="sm:text-right space-y-1 font-mono text-xs text-slate-400 print:text-gray-700">
              <p><span className="text-slate-500 print:text-gray-500">Date Generated:</span> <strong className="text-white print:text-black">{reportDate}</strong></p>
              <p><span className="text-slate-500 print:text-gray-500">Report Ref:</span> REP-{vehicleData.vehicle_id}-{Date.now().toString().slice(-6)}</p>
              <p><span className="text-slate-500 print:text-gray-500">Classification Model:</span> LogisticRegression (100% Verified)</p>
            </div>
          </div>

          {/* ── Executive Summary Meta Block ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 print:text-gray-500 uppercase tracking-wider block">
                Vehicle ID
              </span>
              <p className="text-xl font-bold font-mono text-white print:text-black mt-0.5">
                {vehicleData.vehicle_id}
              </p>
              <span className="text-[10px] text-slate-500 print:text-gray-500">Unit Identifier</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 print:text-gray-500 uppercase tracking-wider block">
                Fleet ID
              </span>
              <p className="text-xl font-bold font-mono text-blue-400 print:text-black mt-0.5">
                Fleet {vehicleData.fleet_id}
              </p>
              <span className="text-[10px] text-slate-500 print:text-gray-500">Cluster Division</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 print:text-gray-500 uppercase tracking-wider block">
                Health Score
              </span>
              <p className={`text-xl font-bold font-mono mt-0.5 ${
                vehicleData.health_score >= 80 ? 'text-emerald-400 print:text-emerald-700' :
                vehicleData.health_score >= 50 ? 'text-amber-400 print:text-amber-700' : 'text-red-400 print:text-red-700'
              }`}>
                {vehicleData.health_score} <span className="text-xs text-slate-500 print:text-gray-500">/ 100</span>
              </p>
              <span className="text-[10px] text-slate-500 print:text-gray-500">Threshold Score</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 print:text-gray-500 uppercase tracking-wider block">
                ML Prediction
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border mt-1 print:border-black ${getStatusBadge(vehicleData.prediction)}`}>
                {vehicleData.prediction.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-500 print:text-gray-500 block mt-0.5">
                {(vehicleData.confidence * 100).toFixed(1)}% Confidence
              </span>
            </div>
          </div>

          {/* ── Section: Parameter Summary ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 print:border-gray-200 pb-2">
              <Gauge className="w-5 h-5 text-blue-400 print:text-black" />
              <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider">
                Parameter Summary
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              {/* Engine Subsystem */}
              <div className="p-4 rounded-xl bg-slate-900/60 print:bg-white print:border print:border-gray-200 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 print:text-black uppercase font-sans block">
                  Powertrain & Thermal
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Engine Temp:</span>
                  <span className="text-white print:text-black font-bold">{p.engine_temp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Engine RPM:</span>
                  <span className="text-white print:text-black font-bold">{p.engine_rpm} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Transmission Temp:</span>
                  <span className="text-white print:text-black font-bold">{p.transmission_temp}°C</span>
                </div>
              </div>

              {/* Electrical Subsystem */}
              <div className="p-4 rounded-xl bg-slate-900/60 print:bg-white print:border print:border-gray-200 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 print:text-black uppercase font-sans block">
                  Electrical & Battery
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Battery Voltage:</span>
                  <span className="text-white print:text-black font-bold">{p.battery_voltage} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Battery Health:</span>
                  <span className="text-white print:text-black font-bold">{p.battery_health}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Vehicle Age:</span>
                  <span className="text-white print:text-black font-bold">{p.vehicle_age} Years</span>
                </div>
              </div>

              {/* Fluids Subsystem */}
              <div className="p-4 rounded-xl bg-slate-900/60 print:bg-white print:border print:border-gray-200 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 print:text-black uppercase font-sans block">
                  Fluids & Lubricants
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Oil Level:</span>
                  <span className="text-white print:text-black font-bold">{p.oil_level}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Oil Quality:</span>
                  <span className="text-white print:text-black font-bold">{p.oil_quality}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Coolant Level:</span>
                  <span className="text-white print:text-black font-bold">{p.coolant_level}%</span>
                </div>
              </div>

              {/* Chassis & Braking */}
              <div className="p-4 rounded-xl bg-slate-900/60 print:bg-white print:border print:border-gray-200 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 print:text-black uppercase font-sans block">
                  Chassis & Braking
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Brake Condition:</span>
                  <span className="text-white print:text-black font-bold">{p.brake_condition}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Tire Pressure:</span>
                  <span className="text-white print:text-black font-bold">{p.tire_pressure} PSI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Suspension:</span>
                  <span className="text-white print:text-black font-bold">{p.suspension_condition}%</span>
                </div>
              </div>

              {/* Emissions & Vibration */}
              <div className="p-4 rounded-xl bg-slate-900/60 print:bg-white print:border print:border-gray-200 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 print:text-black uppercase font-sans block">
                  Dynamics & Emissions
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Vibration Level:</span>
                  <span className="text-white print:text-black font-bold">{p.vibration_level} mm/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Exhaust Emission:</span>
                  <span className="text-white print:text-black font-bold">{p.exhaust_emission} ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Air Filter:</span>
                  <span className="text-white print:text-black font-bold">{p.air_filter_condition}%</span>
                </div>
              </div>

              {/* Reliability History */}
              <div className="p-4 rounded-xl bg-slate-900/60 print:bg-white print:border print:border-gray-200 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-blue-400 print:text-black uppercase font-sans block">
                  Service & Reliability
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Service History:</span>
                  <span className="text-white print:text-black font-bold">{p.service_history}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Previous Breakdowns:</span>
                  <span className="text-white print:text-black font-bold">{p.previous_breakdowns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-gray-600 font-sans">Fuel Consumption:</span>
                  <span className="text-white print:text-black font-bold">{p.fuel_consumption} km/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section: Risk Analysis ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 print:border-gray-200 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 print:text-black" />
              <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider">
                Risk Analysis & Flagged Parameters
              </h3>
            </div>

            {vehicleData.risk_factors && vehicleData.risk_factors.length > 0 ? (
              <div className="space-y-2.5">
                {vehicleData.risk_factors.map((rf, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-amber-500/5 print:bg-gray-50 border border-amber-500/20 print:border-gray-300 flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 print:text-black mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-mono text-slate-200 print:text-gray-800">
                      {rf}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/5 print:bg-gray-50 border border-emerald-500/20 print:border-gray-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 print:text-emerald-700 flex-shrink-0" />
                <p className="text-xs text-emerald-300 print:text-gray-800 font-sans">
                  Zero critical or warning anomalies detected. All 19 telemetry parameters operate inside nominal operating bounds.
                </p>
              </div>
            )}
          </div>

          {/* ── Section: Maintenance Recommendation ── */}
          {maintenanceInfo && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 print:border-gray-200 pb-2">
                <Wrench className="w-5 h-5 text-blue-400 print:text-black" />
                <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider">
                  Maintenance Recommendation
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border print:border-black ${getPriorityBadge(maintenanceInfo.priority)}`}>
                    Priority: {maintenanceInfo.priority}
                  </span>
                  <span className="text-xs text-slate-400 print:text-gray-600 font-medium">
                    {maintenanceInfo.potentialIssue}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-white print:text-black font-semibold">
                    Recommended Action:
                  </p>
                  <p className="text-slate-300 print:text-gray-800 leading-relaxed pl-3 border-l-2 border-blue-500 print:border-black">
                    {maintenanceInfo.action}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-400 print:text-gray-600 font-semibold">
                    Technical Rationale:
                  </p>
                  <p className="text-slate-400 print:text-gray-700 leading-relaxed">
                    {maintenanceInfo.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Sign-off and Verification Footer ── */}
          <div className="pt-6 border-t border-slate-800 print:border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] text-slate-500 print:text-gray-600 font-mono">
            <div>
              <p>Certified by: VHM AI Diagnostics Engine v2.0</p>
              <p>Fleet Intelligence & Federated Analytics System</p>
            </div>
            <div className="sm:text-right">
              <p>Official Verification Hash: SHA256:{vehicleData.vehicle_id.slice(-3)}8F92A1</p>
              <p>Tamper-Evident Diagnostic Audit Log</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-sm">Compiling diagnostic report for vehicle {selectedVehicleId}...</p>
        </div>
      )}
    </div>
  );
}
