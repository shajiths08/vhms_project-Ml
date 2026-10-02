import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Activity, ShieldCheck, Mail, ExternalLink, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/90 bg-[#070A12] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/20">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg text-white">VHM</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Vehicle Health Monitor</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Intelligent Vehicle Health Monitoring &amp; Maintenance Prediction — an AI-powered diagnostic platform engineered to detect telemetry anomalies and forecast proactive service requirements.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Cpu className="w-3.5 h-3.5" />
                2nd-Year AI &amp; Data Science College Project
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Application Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Vehicle Applications
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vehicle-monitoring" className="hover:text-blue-400 transition-colors">Vehicle Monitoring</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Health Dashboard</Link>
              </li>
              <li>
                <Link to="/maintenance" className="hover:text-blue-400 transition-colors">Maintenance Prediction</Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-blue-400 transition-colors">Fleet Dashboard</Link>
              </li>
              <li>
                <Link to="/federated-learning" className="hover:text-blue-400 transition-colors">Federated Learning</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-blue-400 transition-colors">Reports</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VHM AI Platform. Academic Research Prototype.</p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-400">Department of AI &amp; Data Science</span>
            <span>•</span>
            <span className="text-slate-400">AI-Assisted Prediction Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
