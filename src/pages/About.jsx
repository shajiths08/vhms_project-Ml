import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Cpu, 
  Wrench, 
  ShieldCheck, 
  ArrowDown, 
  Database, 
  Sliders, 
  AlertTriangle, 
  CheckCircle,
  FileCheck,
  Target
} from 'lucide-react';

export default function About() {
  const workflowNodes = [
    { title: 'Vehicle Data', desc: 'Raw telemetry ingestion via OBD-II ports (RPM, Engine Temp, Battery Voltage, MAP, Speed).', icon: Database },
    { title: 'Data Preprocessing', desc: 'Cleaning, normalization, outlier removal, and structured feature extraction.', icon: Sliders },
    { title: 'Machine Learning', desc: 'Classification models identifying non-linear failure patterns and correlation shifts.', icon: Cpu },
    { title: 'Health Classification', desc: 'Multi-class scoring designating operational status: Healthy, Warning, or Critical.', icon: Activity },
    { title: 'Risk Analysis', desc: 'Failure mode effect quantification and time-to-failure urgency estimation.', icon: AlertTriangle },
    { title: 'Maintenance Recommendation', desc: 'Specific diagnostic directives formulated for vehicle owners and mechanics.', icon: Wrench },
  ];

  const objectives = [
    {
      id: 1,
      title: 'Monitor vehicle health using vehicle data.',
      desc: 'Collect and analyze ongoing operational telemetry across essential subsystems to maintain an unbroken picture of mechanical performance.'
    },
    {
      id: 2,
      title: 'Predict potential vehicle problems using Machine Learning.',
      desc: 'Leverage predictive machine learning algorithms to uncover subtle sensor deviations before components suffer catastrophic fatigue.'
    },
    {
      id: 3,
      title: 'Improve vehicle safety and operational efficiency.',
      desc: 'Minimize sudden roadside breakdowns, enhance overall road safety, and optimize fuel consumption through balanced engine tuning.'
    },
    {
      id: 4,
      title: 'Provide timely maintenance alerts and recommendations.',
      desc: 'Deliver plain-language alerts to owners and targeted technical inspection areas to service technicians, reducing repair costs.'
    }
  ];

  return (
    <div className="py-12 sm:py-16 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
          Academic Research &amp; Engineering
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About Vehicle Health Monitoring
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Bridging advanced Machine Learning with automotive engineering to transform reactive repairs into proactive, scheduled maintenance.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl automotive-card border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Vehicle Health Monitoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuous diagnostic assessment of mission-critical automotive systems using continuous sensor telemetry feeds.
          </p>
        </div>

        <div className="p-6 rounded-2xl automotive-card border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Predictive Maintenance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transitioning from reactive emergency fixes to structured maintenance schedules based on verified component wear profiles.
          </p>
        </div>

        <div className="p-6 rounded-2xl automotive-card border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Machine Learning</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Data-driven pattern recognition algorithms trained on automotive datasets to identify abnormal multi-variable conditions.
          </p>
        </div>

        <div className="p-6 rounded-2xl automotive-card border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Maintenance Recommendation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Contextual diagnostic guidance that empowers vehicle owners and provides mechanics with specific inspection targets.
          </p>
        </div>
      </div>

      {/* System Flow Diagram */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-blue-400 tracking-widest uppercase">System Flow</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            End-to-End Diagnostic Pipeline
          </h3>
          <p className="text-sm text-slate-400">
            How raw automotive telemetry moves through the diagnostic stack into actionable maintenance advisories.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {workflowNodes.map((node, index) => {
            const Icon = node.icon;
            const isLast = index === workflowNodes.length - 1;
            return (
              <React.Fragment key={node.title}>
                <div className="p-5 rounded-xl automotive-card border border-slate-800/90 flex items-center justify-between gap-4 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{node.title}</h4>
                      <p className="text-xs text-slate-400">{node.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">Stage 0{index + 1}</span>
                </div>
                {!isLast && (
                  <div className="flex justify-center py-0.5">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shadow-sm">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Project Objectives */}
      <section className="p-8 sm:p-12 rounded-3xl automotive-card border border-slate-800 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Academic Milestones</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Project Objectives</h3>
          <p className="text-sm text-slate-400">
            Formulated as part of the 2nd-Year AI &amp; Data Science curriculum to demonstrate the real-world utility of intelligent diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objectives.map((obj) => (
            <div key={obj.id} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {obj.id}
                </span>
                <h4 className="text-base font-bold text-white">{obj.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-10">{obj.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Team & Mentorship */}
      <section className="p-8 sm:p-12 rounded-3xl automotive-card border border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-slate-900 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Project Contributors &amp; Guidance
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-1">Academic Project Team</h3>
          <p className="text-xs text-slate-400 mt-1">Department of Artificial Intelligence &amp; Data Science</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-blue-400 uppercase">Project Developer</span>
            <p className="text-lg font-bold text-white">Mohamed Shajith S</p>
            <p className="text-xs text-slate-400">2nd-Year AI &amp; Data Science</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-blue-400 uppercase">Project Developer</span>
            <p className="text-lg font-bold text-white">Muhammad B</p>
            <p className="text-xs text-slate-400">2nd-Year AI &amp; Data Science</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Project Mentor &amp; Guide</span>
            <p className="text-lg font-bold text-white">Mrs. P Nivetha</p>
            <p className="text-xs text-slate-400">Faculty, Department of AI &amp; Data Science</p>
          </div>
        </div>
      </section>
    </div>
  );
}
