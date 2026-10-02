import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('demo@vehicledata.ai');
  const [password, setPassword] = useState('password123');
  const [notice, setNotice] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setNotice(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4">
      <div className="p-8 rounded-3xl automotive-card border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Access VHM AI</h1>
          <p className="text-xs text-slate-400">
            Log in to monitor vehicle telemetry and inspect diagnostics.
          </p>
        </div>

        {notice && (
          <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Demo authentication authorized. Redirecting to Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo mode: Password reset feature will be configured in production."); }} className="text-xs text-blue-400 hover:text-blue-300">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
