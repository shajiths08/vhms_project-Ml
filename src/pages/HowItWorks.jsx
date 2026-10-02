import React from 'react';
import { 
  Database, 
  Sliders, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Wrench, 
  ArrowDown, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Vehicle Data Ingestion',
      subtitle: 'Real-time OBD-II Telemetry Collection',
      desc: 'Vehicle onboard diagnostic ports supply continuous numerical telemetry, including engine RPM, vehicle speed, coolant temperature, manifold absolute pressure (MAP), throttle position, and battery voltage.',
      icon: Database,
    },
    {
      step: '02',
      title: 'Data Preprocessing',
      subtitle: 'Cleaning, Calibration & Feature Scaling',
      desc: 'Raw streams undergo statistical cleansing. Sensor jitter and missing packets are handled, values are normalized into standard ranges, and domain-engineered features (e.g., thermal rate of rise, electrical delta) are extracted.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Machine Learning Classification',
      subtitle: 'Pattern Recognition & Multivariable Analysis',
      desc: 'Supervised classification models analyze multi-parameter correlation shifts. The model evaluates whether current operating conditions represent nominal mechanical tolerances or developing anomalies.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Health Classification',
      subtitle: 'Deterministic Categorization',
      desc: 'The inferencing engine calculates probability distributions across defined vehicle operational states, categorizing the vehicle status as Healthy, Warning, or Critical.',
      icon: Activity,
    },
    {
      step: '05',
      title: 'Risk Analysis',
      subtitle: 'Impact & Urgency Assessment',
      desc: 'Identifies which specific sensor inputs breached safe operating corridors, isolates the affected subsystem (cooling, ignition, charging, lubrication), and assesses operational risk severity.',
      icon: ShieldAlert,
    },
    {
      step: '06',
      title: 'Maintenance Recommendation',
      subtitle: 'Actionable Automotive Directives',
      desc: 'The platform generates contextual advice: owner-friendly summaries for immediate safety, and technical inspection check-lists for automotive workshop personnel.',
      icon: Wrench,
    },
  ];

  const statusCategories = [
    {
      status: 'Healthy',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      desc: 'All monitored parameters operate within manufacturer-calibrated nominal ranges. Engine thermal curve is stabilized, alternator charging potential is steady, and combustion cycle metrics indicate optimal efficiency.',
      action: 'Routine scheduled servicing; no immediate mechanical inspection required.'
    },
    {
      status: 'Warning',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      desc: 'Telemetry reveals moderate deviations from typical baselines, such as elevated coolant temperature during idle, transient voltage drops, or abnormal vibration signatures under acceleration.',
      action: 'Inspection recommended within 500-1,000 km to prevent accelerated component wear.'
    },
    {
      status: 'Critical',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: XCircle,
      desc: 'Severe anomaly detected indicating imminent component breakdown or serious thermal/electrical hazard (e.g., persistent coolant overtemp > 108°C or charging system failure).',
      action: 'Immediate vehicle pull-over or emergency workshop visit to avoid catastrophic engine damage.'
    }
  ];

  return (
    <div className="py-12 sm:py-16 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
          Architecture &amp; Methodology
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How the Diagnostic System Works
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          An AI-assisted telemetry assessment pipeline engineered to translate raw OBD-II data into transparent diagnostic intelligence.
        </p>
      </div>

      {/* Academic Disclaimer Notice */}
      <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-slate-300">
          <p className="font-semibold text-white">Academic Advisory &amp; Diagnostic Scope Notice:</p>
          <p className="leading-relaxed text-slate-400">
            This platform delivers <strong className="text-blue-300">AI-assisted prediction</strong> based on sensor telemetry patterns. 
            It is designed to supplement preventive awareness and does not claim guaranteed mechanical diagnosis or replace physical inspections conducted by certified automotive service engineers.
          </p>
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Diagnostic Execution Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">Structured 6-phase analytical journey from sensor to actionable repair directive</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === steps.length - 1;
            return (
              <React.Fragment key={item.step}>
                <div className="p-6 rounded-2xl automotive-card border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-1 md:mt-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">Step {item.step}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400 font-medium">{item.subtitle}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">{item.desc}</p>
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center py-0.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shadow-md">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Health Status Classification Criteria */}
      <div className="space-y-8 pt-8 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-blue-400 tracking-widest uppercase">Diagnostic States</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Health Classification Criteria</h3>
          <p className="text-sm text-slate-400">
            How our AI model segments operational data into clear, tiered severity classifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.status}
                className={`p-7 rounded-2xl border ${cat.color} space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-6 h-6" />
                      <h4 className="text-xl font-bold text-white">{cat.status}</h4>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      Level
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-1">
                  <p className="text-[11px] uppercase font-bold text-slate-400">Recommended Protocol:</p>
                  <p className="text-xs font-medium text-slate-200">{cat.action}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
