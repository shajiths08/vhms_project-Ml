import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronRight, 
  RefreshCw,
  BarChart3,
  Layers,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

function statusBadge(status) {
  if (status === 'Healthy') {
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  }
  if (status === 'Warning') {
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }
  return 'text-red-400 bg-red-500/10 border-red-500/30';
}

function riskBadge(risk) {
  if (risk === 'Low') {
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  }
  if (risk === 'Medium') {
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }
  return 'text-red-400 bg-red-500/10 border-red-500/20';
}

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchFleetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, vehRes] = await Promise.all([
        fetch('/api/fleet/summary'),
        fetch('/api/fleet/vehicles')
      ]);

      if (!sumRes.ok || !vehRes.ok) {
        throw new Error('Failed to retrieve fleet data from backend.');
      }

      const sumData = await sumRes.json();
      const vehData = await vehRes.json();

      if (sumData.success && vehData.success) {
        setSummary(sumData);
        setVehicles(vehData.vehicles);
      } else {
        throw new Error(sumData.error || vehData.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  // Distinct fleets for dropdown
  const uniqueFleets = useMemo(() => {
    const set = new Set(vehicles.map(v => v.fleet_id));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesFleet = selectedFleet === 'ALL' || v.fleet_id === selectedFleet;
      const matchesStatus = selectedStatus === 'ALL' || v.prediction === selectedStatus;
      const matchesRisk = selectedRisk === 'ALL' || v.risk_level === selectedRisk;
      return matchesSearch && matchesFleet && matchesStatus && matchesRisk;
    });
  }, [vehicles, searchTerm, selectedFleet, selectedStatus, selectedRisk]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFleet, selectedStatus, selectedRisk]);

  return (
    <div className="py-10 sm:py-14 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Fleet Intelligence
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {summary ? `${summary.total_vehicles} Telemetry Units Online` : 'Aggregating Telemetry...'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Fleet Diagnostic Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic fleet telemetry statistics, real-time health distribution, and multi-unit diagnostics computed from the vehicle dataset.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFleetData}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-400">Failed to connect to Fleet Engine</p>
            <p className="text-xs text-red-300 mt-0.5">{error}</p>
            <p className="text-xs text-slate-500 mt-1">Ensure the Flask backend is active on port 5000.</p>
          </div>
        </div>
      )}

      {/* ── Section 1: Dynamic Calculated KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vehicles */}
        <div className="p-6 rounded-2xl automotive-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Vehicles</span>
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-4xl font-extrabold font-mono text-white">
            {summary ? summary.total_vehicles : '--'}
          </p>
          <p className="text-[11px] text-slate-500">Live monitored units in dataset</p>
        </div>

        {/* Healthy Vehicles */}
        <div className="p-6 rounded-2xl automotive-card border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold uppercase">Healthy</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold font-mono text-emerald-400">
              {summary ? summary.status_counts.Healthy : '--'}
            </p>
            <span className="text-xs font-semibold text-emerald-500/80">
              {summary ? `(${summary.status_percentages.Healthy}%)` : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Nominal telemetry operating limits</p>
        </div>

        {/* Warning Vehicles */}
        <div className="p-6 rounded-2xl automotive-card border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-semibold uppercase">Warning</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold font-mono text-amber-400">
              {summary ? summary.status_counts.Warning : '--'}
            </p>
            <span className="text-xs font-semibold text-amber-500/80">
              {summary ? `(${summary.status_percentages.Warning}%)` : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Developing subsystem degradation</p>
        </div>

        {/* Critical Vehicles */}
        <div className="p-6 rounded-2xl automotive-card border border-red-500/30 bg-red-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 font-semibold uppercase">Critical</span>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold font-mono text-red-400">
              {summary ? summary.status_counts.Critical : '--'}
            </p>
            <span className="text-xs font-semibold text-red-500/80">
              {summary ? `(${summary.status_percentages.Critical}%)` : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Immediate mechanical triage required</p>
        </div>
      </div>

      {/* ── Section 2: Fleet Visualization (Vehicle Health Distribution) ── */}
      <div className="p-6 sm:p-8 rounded-3xl automotive-card border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Vehicle Health Distribution</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Average Fleet Health Score: <span className="text-blue-400 font-bold">{summary?.avg_health_score ?? '--'} / 100</span>
          </span>
        </div>

        {/* Proportional Segmented Bar */}
        {summary && (
          <div className="space-y-4">
            <div className="h-5 rounded-xl bg-slate-900 overflow-hidden flex shadow-inner border border-slate-800">
              <div 
                style={{ width: `${summary.status_percentages.Healthy}%` }} 
                className="bg-emerald-500 h-full transition-all duration-700 relative group"
                title={`Healthy: ${summary.status_counts.Healthy} vehicles (${summary.status_percentages.Healthy}%)`}
              />
              <div 
                style={{ width: `${summary.status_percentages.Warning}%` }} 
                className="bg-amber-500 h-full transition-all duration-700 relative group"
                title={`Warning: ${summary.status_counts.Warning} vehicles (${summary.status_percentages.Warning}%)`}
              />
              <div 
                style={{ width: `${summary.status_percentages.Critical}%` }} 
                className="bg-red-500 h-full transition-all duration-700 relative group"
                title={`Critical: ${summary.status_counts.Critical} vehicles (${summary.status_percentages.Critical}%)`}
              />
            </div>

            {/* Distribution Legend with Real Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-slate-300">Healthy</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-400">{summary.status_counts.Healthy} units</span>
                  <span className="text-[11px] text-slate-500 block">{summary.status_percentages.Healthy}% of fleet</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-semibold text-slate-300">Warning</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-amber-400">{summary.status_counts.Warning} units</span>
                  <span className="text-[11px] text-slate-500 block">{summary.status_percentages.Warning}% of fleet</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs font-semibold text-slate-300">Critical</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-red-400">{summary.status_counts.Critical} units</span>
                  <span className="text-[11px] text-slate-500 block">{summary.status_percentages.Critical}% of fleet</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: Vehicle Registry Table with Search & Filters ── */}
      <div className="p-6 sm:p-8 rounded-3xl automotive-card border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Monitored Vehicle Fleet Registry</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredVehicles.length} of {vehicles.length} vehicle records computed from dataset
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                placeholder="Search Vehicle ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Fleet Filter */}
            <select
              value={selectedFleet}
              onChange={(e) => setSelectedFleet(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Fleets ({vehicles.length})</option>
              {uniqueFleets.map(f => (
                <option key={f} value={f}>Fleet {f}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Risk Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>

            {(searchTerm || selectedFleet !== 'ALL' || selectedStatus !== 'ALL' || selectedRisk !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFleet('ALL');
                  setSelectedStatus('ALL');
                  setSelectedRisk('ALL');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Vehicle ID</th>
                <th className="px-4 py-3">Fleet ID</th>
                <th className="px-4 py-3">Health Score</th>
                <th className="px-4 py-3">ML Status</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Service History</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loading && vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500 font-sans">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                    Loading fleet vehicles from dataset...
                  </td>
                </tr>
              ) : paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500 font-sans">
                    No vehicles match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((v) => (
                  <tr key={v.vehicle_id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Vehicle ID */}
                    <td className="px-4 py-3.5 font-bold text-white font-mono">
                      {v.vehicle_id}
                    </td>

                    {/* Fleet ID */}
                    <td className="px-4 py-3.5 text-slate-400">
                      Fleet {v.fleet_id}
                    </td>

                    {/* Health Score */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{v.health_score}</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full ${
                              v.health_score >= 80 ? 'bg-emerald-500' :
                              v.health_score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${v.health_score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${statusBadge(v.prediction)}`}>
                        {v.prediction}
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td className="px-4 py-3.5 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${riskBadge(v.risk_level)}`}>
                        {v.risk_level}
                      </span>
                    </td>

                    {/* Service History */}
                    <td className="px-4 py-3.5 font-sans text-slate-400">
                      {v.service_history}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dashboard?vehicle=${v.vehicle_id}`}
                          title="Open Detailed Health Dashboard"
                          className="px-2.5 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 transition-colors font-medium inline-flex items-center gap-1"
                        >
                          <span>Dashboard</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <Link
                          to={`/reports?vehicle=${v.vehicle_id}`}
                          title="Generate Vehicle Health Report"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:border-slate-700 transition-colors"
              >
                Previous
              </button>
              <span className="font-mono text-slate-300 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:border-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
