import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Activity, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Battery, 
  Thermometer, 
  Gauge, 
  Wrench, 
  Users, 
  UserCheck, 
  Zap, 
  Sparkles,
  ChevronRight,
  Database,
  BarChart3,
  Sliders
} from 'lucide-react';

export default function Home() {
  const steps = [
    {
      num: '01',
      title: 'Vehicle Data',
      desc: 'Real-time telemetry captured across engine sensors, electrical systems, thermal monitors, and transmission inputs.',
      icon: Database,
    },
    {
      num: '02',
      title: 'Data Processing',
      desc: 'Rigorous feature scaling, noise filtration, missing-value imputation, and normalization of sensor readings.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'ML Prediction',
      desc: 'Supervised classification models analyze multi-parameter cross-correlations to forecast anomalies before physical failure.',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Risk Analysis',
      desc: 'Dynamic severity categorization mapping telemetry deviations into Healthy, Warning, or Critical operational states.',
      icon: ShieldAlert,
    },
    {
      num: '05',
      title: 'Maintenance Recommendation',
      desc: 'Actionable, proactive servicing advisories generated with component-specific inspection instructions.',
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-24 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Intelligent Automotive Telemetry &amp; Diagnostics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Predict Vehicle Problems <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                Before They Become Breakdowns.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
              AI-powered vehicle health monitoring and maintenance prediction for smarter, safer and more efficient vehicle management.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/vehicle-monitoring"
                className="px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 group"
              >
                <span>Monitor Vehicle</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 transition-all flex items-center gap-2"
              >
                <span>Explore Platform</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <p className="text-2xl font-bold text-white">5-Step</p>
                <p className="text-xs text-slate-400">ML Pipeline</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Dual-Mode</p>
                <p className="text-xs text-slate-400">Owner &amp; Mechanic</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Edge-Ready</p>
                <p className="text-xs text-slate-400">Federated Design</p>
              </div>
            </div>
          </div>

          {/* Hero Visual: Automotive AI HUD */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-2xl automotive-card border border-slate-700/60 shadow-2xl shadow-blue-900/10 overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-300">OBD-II Telemetry Stream</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40">AI Engine Ready</span>
              </div>

              {/* Graphic Nodes */}
              <div className="my-6 space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Engine Coolant Temp</p>
                      <p className="text-sm font-semibold text-white">92.4 °C <span className="text-xs font-normal text-slate-500">(Target: 85-98°C)</span></p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-blue-300 border border-slate-700">Nominal</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Battery className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Battery Potential</p>
                      <p className="text-sm font-semibold text-white">13.8 V <span className="text-xs font-normal text-slate-500">(Charging state)</span></p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-blue-300 border border-slate-700">Stable</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Engine Speed &amp; MAP</p>
                      <p className="text-sm font-semibold text-white">2,150 RPM <span className="text-xs font-normal text-slate-500">/ 38.2 kPa</span></p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-blue-300 border border-slate-700">Synchronized</span>
                </div>
              </div>

              {/* Status footer card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-slate-900/50 border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-300">Continuous CAN Bus Sampling</span>
                </div>
                <span className="text-[11px] text-blue-400 font-mono">100 Hz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY VEHICLE HEALTH MONITORING? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-blue-400 tracking-widest uppercase">Root Causes &amp; Prevention</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Vehicle Health Monitoring?
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Vehicles operate under extreme dynamic stresses. Mechanical failures rarely occur without early warning signals in CAN bus telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Engine Faults */}
          <div className="p-6 rounded-2xl automotive-card automotive-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Engine Faults</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Misfires, fuel trim deviations, oxygen sensor lag, and timing slips degrade efficiency and lead to catastrophic cylinder damage if left unresolved.
            </p>
          </div>

          {/* Card 2: Battery Issues */}
          <div className="p-6 rounded-2xl automotive-card automotive-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Battery className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Battery Issues</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Internal resistance degradation, alternator charging ripple, and cold-crank voltage drops strand motorists without prior warning.
            </p>
          </div>

          {/* Card 3: Overheating */}
          <div className="p-6 rounded-2xl automotive-card automotive-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Thermometer className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Overheating</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cooling system leaks, thermostat lockups, and degraded coolant cause thermal warp, blown head gaskets, and permanent engine block distortion.
            </p>
          </div>

          {/* Card 4: Component Wear */}
          <div className="p-6 rounded-2xl automotive-card automotive-card-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Wrench className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Component Wear</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Brake pad thinning, transmission slip, suspension bushings, and harmonic vibration escalate silently into dangerous highway hazards.
            </p>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-base font-semibold text-white">
              AI-Assisted Assessment &amp; Maintenance Recommendations
            </p>
            <p className="text-sm text-slate-400">
              Our system analyzes multi-sensor vehicle parameters simultaneously, mapping subtle trend lines into clear, actionable maintenance advice.
            </p>
          </div>
          <Link
            to="/how-it-works"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600/20 border border-blue-500/30 whitespace-nowrap transition-all"
          >
            Learn How It Works
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS (5-Step Sequence) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-blue-400 tracking-widest uppercase">End-to-End Pipeline</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h3>
          <p className="text-slate-400 leading-relaxed">
            From physical OBD-II telemetry to clear maintenance advisories in 5 systematic stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={step.num} className="p-6 rounded-2xl automotive-card border border-slate-800 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold font-mono text-blue-500/60">{step.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-blue-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BUILT FOR TWO USERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-blue-400 tracking-widest uppercase">Tailored Experiences</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Two Users
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Engineered with dedicated interfaces to bridge the communication gap between everyday drivers and expert automotive technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User 1: Vehicle Owner */}
          <div className="p-8 rounded-2xl automotive-card border border-slate-800 space-y-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Users className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Everyday Driver</span>
              <h4 className="text-2xl font-bold text-white">Vehicle Owner</h4>
              <blockquote className="text-base italic text-slate-300 border-l-2 border-blue-500 pl-4 my-2">
                "Understand your vehicle condition in simple language."
              </blockquote>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              No cryptic Diagnostic Trouble Codes (DTCs). Owners receive plain-language vehicle summaries, estimated urgency levels, safe driving distances, and simple instructions on what to tell the repair shop.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Plain-language health status explanations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Immediate danger alerts vs. routine service reminders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Preventive savings estimates over major repairs</span>
              </li>
            </ul>
          </div>

          {/* User 2: Mechanic */}
          <div className="p-8 rounded-2xl automotive-card border border-slate-800 space-y-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Wrench className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Workshop &amp; Service Tech</span>
              <h4 className="text-2xl font-bold text-white">Mechanic</h4>
              <blockquote className="text-base italic text-slate-300 border-l-2 border-blue-500 pl-4 my-2">
                "View technical parameters and recommended inspection areas."
              </blockquote>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Deep diagnostic telemetry for technicians. Inspect raw sensor voltage profiles, duty cycles, cross-correlations, anomaly confidence intervals, and targeted component sub-assemblies.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Granular live sensor parameter graphs and bounds</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Ranked component wear and inspection checklist</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Standardized workshop diagnostic export capabilities</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl automotive-card border border-blue-500/30 text-center space-y-6 relative overflow-hidden glow-accent">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Prevent Unplanned Breakdowns?
            </h3>
            <p className="text-slate-300 text-base">
              Experience the power of proactive AI telemetry assessment. Begin testing your vehicle parameters on our dedicated monitoring console.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/vehicle-monitoring"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all group"
            >
              <span>Start Monitoring Your Vehicle</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
