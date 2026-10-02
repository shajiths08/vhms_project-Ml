import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Car, 
  Menu, 
  X, 
  Activity, 
  ShieldAlert, 
  Wrench, 
  Cpu, 
  FileText, 
  PhoneCall, 
  LogIn, 
  UserPlus,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Monitoring', path: '/vehicle-monitoring' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Federated Learning', path: '/federated-learning' },
    { name: 'Reports', path: '/reports' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-600/25 border border-blue-400/30 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">VHM</span>
                <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">Vehicle Health Monitor</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 rounded-lg hover:bg-slate-800/60"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/25 transition-all duration-150 flex items-center gap-1.5 hover:shadow-blue-600/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-[#0E1524] px-4 pt-2 pb-6 space-y-2 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-1 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/15 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-center text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
