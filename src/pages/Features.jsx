import React from 'react';
import { 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Wrench, 
  Users, 
  Terminal, 
  Truck, 
  Network, 
  FileSpreadsheet, 
  History,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      title: 'AI Vehicle Health Prediction',
      desc: 'Machine learning algorithms analyze live multi-variable engine data to classify operational health status and predict developing failures.',
      icon: Cpu,
      tag: 'Core Intelligence'
    },
    {
      title: 'Health Score',
      desc: 'A normalized, consolidated index summarizing vehicle condition across all monitored mechanical and electrical parameters.',
      icon: Activity,
      tag: 'Diagnostic Metric'
    },
    {
      title: 'Risk Factor Detection',
      desc: 'Pinpoints specific parameters crossing statistical safety thresholds, such as thermal spikes, voltage fluctuations, and RPM instability.',
      icon: ShieldAlert,
      tag: 'Anomaly Isolation'
    },
    {
      title: 'Maintenance Recommendation',
      desc: 'Context-aware corrective actions advising on required service steps, replacement urgency, and immediate preventative measures.',
      icon: Wrench,
      tag: 'Actionable Advice'
    },
    {
      title: 'Owner-Friendly Explanation',
      desc: 'Translates complex diagnostic telemetry and OBD error contexts into clear, jargon-free explanations for non-technical drivers.',
      icon: Users,
      tag: 'Driver Portal'
    },
    {
      title: 'Mechanic Technical View',
      desc: 'Provides comprehensive telemetry logs, sensor curves, duty cycles, and targeted component sub-assemblies for professional workshops.',
      icon: Terminal,
      tag: 'Technician Suite'
    },
    {
      title: 'Fleet Monitoring',
      desc: 'Centralized oversight dashboard for commercial vehicle operations, enabling multi-vehicle health surveillance and triage.',
      icon: Truck,
      tag: 'Enterprise'
    },
    {
      title: 'Federated Learning Simulation',
      desc: 'Privacy-preserving collaborative training demonstration where models learn from distributed vehicle fleets without centralizing raw telemetry.',
      icon: Network,
      tag: 'Edge Computing'
    },
    {
      title: 'Vehicle Reports',
      desc: 'Structured diagnostic inspection summaries suitable for archival, insurance validation, service histories, and mechanics.',
      icon: FileSpreadsheet,
      tag: 'Documentation'
    },
    {
      title: 'Historical Health Tracking',
      desc: 'Telemetry logging over time to observe degradation curves, wear trends, and evaluate the longevity of repaired subsystems.',
      icon: History,
      tag: 'Time-Series Analysis'
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
          Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Intelligent Diagnostic Features
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Ten integrated capabilities designed to elevate automotive health surveillance from guesswork to precision telemetry analytics.
        </p>
      </div>

      {/* 10 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.title}
              className="p-7 rounded-2xl automotive-card automotive-card-hover border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-blue-400 font-medium">
                <span>Feature #0{index + 1}</span>
                <span className="text-slate-500">Active Specification</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Exploration Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Experience Feature Workflows</h3>
          <p className="text-sm text-slate-400 max-w-xl">
            See how these features assemble into an end-to-end diagnostic journey on our interactive architecture page.
          </p>
        </div>
        <Link
          to="/how-it-works"
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 flex items-center gap-2 whitespace-nowrap"
        >
          <span>View Workflow</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
