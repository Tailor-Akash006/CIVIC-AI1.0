import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUpRight, Heart, Sparkles, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#070B14]/90 text-slate-400 border-t border-white/10 backdrop-blur-2xl text-xs overflow-hidden">
      {/* Specular Ambient Light in Footer */}
      <div className="absolute top-0 left-1/3 w-96 h-28 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shadow-[0_2px_12px_rgba(37,99,235,0.4)]">
                CM
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                CIVIC<span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">MIND</span>
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200">
              Every complaint matters. Every action counts.
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              An intelligent, responsive civic complaint triage and resolution ecosystem, connecting active citizens with municipal public works crews through transparent AI-driven prioritization.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Full-Stack NestJS REST Architecture with Gemini Vision & Text Triage</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3.5">
              Citizen Access
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/report" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  <span>Report a Civic Issue</span>
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  <span>Track Existing Reports</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  <span>Interactive Resolution Workflow</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Authority Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3.5">
              Municipal Operations
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/authority" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Authority Dashboard</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/management" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Complaint Dispatch Grid</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/intelligence" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>AI Hotspots & Duplicates</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <span>© 2026 CIVICMIND Civic-Tech Platform</span>
            <span>·</span>
            <span className="text-blue-400">Enterprise Edition</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">React + TypeScript + Tailwind + NestJS + Prisma</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="API Ready" />
          </div>
        </div>
      </div>
    </footer>
  );
};
