import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { 
  PlusCircle, 
  Menu, 
  X, 
  RotateCcw,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, resetAllDemoData } = useCivic();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_2px_16px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Apple-style Refined Brand Wordmark */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs tracking-tight shadow-[0_4px_12px_rgba(37,99,235,0.3)] ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-200">
            CM
          </div>
          <span className="font-extrabold text-slate-950 text-base">
            CIVIC<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MIND</span>
          </span>
        </Link>

        {/* Zone 2: Apple-style Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100/60 p-1 rounded-full border border-slate-200/50 backdrop-blur-md">
          <Link 
            to="/" 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
              isActive('/') && location.pathname === '/' 
                ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            Overview
          </Link>
          <Link 
            to="/citizen" 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
              isActive('/citizen') 
                ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            Citizen Portal
          </Link>
          <Link 
            to="/report" 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
              isActive('/report') 
                ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            Report Issue
          </Link>
          <Link 
            to="/authority" 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
              isActive('/authority') || isActive('/management') 
                ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            Authority Console
          </Link>
          <Link 
            to="/intelligence" 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
              isActive('/intelligence') 
                ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold' 
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            AI Intelligence
          </Link>
        </nav>

        {/* Zone 3: Apple Glass Role Switcher & Primary Action */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* macOS Style Segmented Control */}
          <div className="flex items-center p-1 bg-slate-200/50 rounded-full border border-slate-300/40 backdrop-blur-md text-xs">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                role === 'citizen'
                  ? 'bg-white text-slate-900 shadow-[0_2px_6px_rgba(0,0,0,0.08)]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setRole('authority')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                role === 'authority'
                  ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.3)]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Authority
            </button>
          </div>

          {/* Quick Demo Reset */}
          <button
            type="button"
            onClick={resetAllDemoData}
            title="Reset demo data to initial baseline"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Apple Electric Blue Action Button */}
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.35)] ring-1 ring-white/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center p-0.5 bg-slate-200/60 rounded-full border border-slate-300/40 text-xs">
            <button
              onClick={() => setRole(role === 'citizen' ? 'authority' : 'citizen')}
              className="px-2.5 py-1 text-slate-800 font-semibold text-[11px]"
            >
              {role === 'citizen' ? 'Citizen' : 'Authority'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Perspective</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-full">
              <button
                onClick={() => { setRole('citizen'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${role === 'citizen' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
              >
                Citizen
              </button>
              <button
                onClick={() => { setRole('authority'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${role === 'authority' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'}`}
              >
                Authority
              </button>
            </div>
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/60"
          >
            Overview
          </Link>
          <Link
            to="/citizen"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/60"
          >
            Citizen Dashboard
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50/60"
          >
            Report an Issue
          </Link>
          <Link
            to="/authority"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/60"
          >
            Authority Console
          </Link>
          <Link
            to="/management"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/60"
          >
            Complaint Management
          </Link>
          <Link
            to="/intelligence"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/60"
          >
            AI Intelligence & Duplicates
          </Link>
        </div>
      )}
    </header>
  );
};
