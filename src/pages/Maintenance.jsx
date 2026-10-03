import React, { useState, useEffect } from 'react';
import API_BASE from '../config';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  AlertCircle,
  Layers, 
  ArrowRight,
  ShieldCheck,
  Settings,
  RefreshCw,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Maintenance() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/api/fleet/vehicles`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setVehicles(data.vehicles);
          }
        }
      } catch (err) {
        console.warn('Could not load vehicles for maintenance view', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const criticalVehicles = vehicles.filter(v => v.prediction === 'Critical');
  const warningVehicles = vehicles.filter(v => v.prediction === 'Warning');

  const standardSchedules = [
    { name: 'Engine Oil & Filter Replacement', interval: 'Every 10,000 km', status: 'Routine Interval', system: 'Lubrication' },
    { name: 'Battery Health & Terminal Cleansing', interval: 'Every 15,000 km', status: 'Recommended', system: 'Electrical' },
    { name: 'Brake Rotor & Hydraulic Fluid Check', interval: 'Every 20,000 km', status: 'Safety Critical', system: 'Braking' },
    { name: 'Spark Plug & Ignition System Diagnostic', interval: 'Every 30,000 km', status: 'Scheduled', system: 'Powertrain' },
    { name: 'Cooling System Flush & Thermostat Test', interval: 'Every 40,000 km', status: 'Thermal Management', system: 'Cooling' },
    { name: 'Transmission Fluid & Filter Service', interval: 'Every 50,000 km', status: 'Drivetrain', system: 'Transmission' },
  ];

  return (
    <div className="py-10 sm:py-14 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Proactive Servicing
            </span>
            <span className="text-xs text-slate-500 font-mono">Predictive Maintenance Dispatch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Maintenance Planning & Triage
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Component degradation tracking and priority maintenance dispatch derived from real-time ML diagnostic inferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vehicle-monitoring"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm font-semibold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <span>Custom Telemetry Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Active Triage Queues ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Immediate Dispatch */}
        <div className="p-6 rounded-2xl automotive-card border border-red-500/30 bg-red-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Critical Triage Queue (Immediate Action)</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
              {criticalVehicles.length} Units Flagged
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Vehicles exhibiting severe mechanical, thermal, or electrical anomalies exceeding safe operating limits. Grounding recommended.
          </p>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400 mx-auto mb-1" />
                Aggregating triage units...
              </div>
            ) : criticalVehicles.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical vehicles currently in queue.</p>
            ) : (
              criticalVehicles.slice(0, 5).map((v) => (
                <div key={v.vehicle_id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">{v.vehicle_id}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Fleet {v.fleet_id}</span>
                    </div>
                    <p className="text-[11px] text-red-400 mt-0.5">
                      Score: {v.health_score}/100 • {v.risk_factors?.length || 0} Risk Flags
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/reports?vehicle=${v.vehicle_id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                    >
                      Report
                    </Link>
                    <Link
                      to={`/dashboard?vehicle=${v.vehicle_id}`}
                      className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 text-xs font-medium transition-colors"
                    >
                      Diagnose
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Warning 7-14 Day Preventive Queue */}
        <div className="p-6 rounded-2xl automotive-card border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Preventive Queue (7–14 Day Service)</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
              {warningVehicles.length} Units Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Vehicles displaying initial degradation patterns. Servicing now prevents escalating into high-cost breakdown events.
          </p>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400 mx-auto mb-1" />
                Aggregating warning units...
              </div>
            ) : warningVehicles.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No warning vehicles currently in queue.</p>
            ) : (
              warningVehicles.slice(0, 5).map((v) => (
                <div key={v.vehicle_id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">{v.vehicle_id}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Fleet {v.fleet_id}</span>
                    </div>
                    <p className="text-[11px] text-amber-400 mt-0.5">
                      Score: {v.health_score}/100 • Approaching wear thresholds
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/reports?vehicle=${v.vehicle_id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                    >
                      Report
                    </Link>
                    <Link
                      to={`/dashboard?vehicle=${v.vehicle_id}`}
                      className="px-2.5 py-1 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600/30 text-xs font-medium transition-colors"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Standard Preventive Schedule & Directives ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 p-7 rounded-3xl automotive-card border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Standard Maintenance Schedules</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">OEM Baselines</span>
          </div>

          <div className="space-y-3">
            {standardSchedules.map((mod) => (
              <div key={mod.name} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{mod.name}</h4>
                  <p className="text-xs text-slate-400">{mod.interval} • Subsystem: {mod.system}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-7 rounded-3xl automotive-card border border-slate-800 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span>Diagnostic Inspection Directives</span>
          </h3>

          <p className="text-xs text-slate-400">
            Automated recommendations generated by the VHM AI inference engine for garage and workshop mechanics:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-bold text-blue-400 uppercase">Engine Cooling Directive</p>
              <p className="text-xs text-slate-300">
                Perform pressure check on expansion tank cap and verify thermostat opening temperature when engine temp exceeds 100°C.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-bold text-blue-400 uppercase">Electrical Voltage Regulation</p>
              <p className="text-xs text-slate-300">
                Inspect alternator diode ripple and test battery internal resistance if resting voltage drops below 12.2V.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="text-xs font-bold text-blue-400 uppercase">Vibration & Chassis Dynamics</p>
              <p className="text-xs text-slate-300">
                Execute wheel dynamic balancing and inspect driveshaft universal joints if vibration level exceeds 3.5 mm/s.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
