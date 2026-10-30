/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { ComplaintManagementPage } from './pages/ComplaintManagementPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { CivicAiBot } from './components/common/CivicAiBot';
import { CheckCircle2, Shield, Info } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useCivic();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

const RolePerspectiveBanner: React.FC = () => {
  const { role, setRole } = useCivic();
  const location = useLocation();

  // Hide on landing page to maintain pristine hero aesthetics
  if (location.pathname === '/') return null;

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-slate-300 text-[11px]">
            Perspective: <strong className="text-white font-semibold">{role === 'authority' ? 'Municipal Authority / City Dispatch' : 'Citizen / Public Reporter'}</strong>
          </span>
          <span className="hidden sm:inline text-slate-500">· Live Demo Environment</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden md:inline">Switch view:</span>
          <button
            type="button"
            onClick={() => setRole(role === 'citizen' ? 'authority' : 'citizen')}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Switch to {role === 'citizen' ? 'Authority Console' : 'Citizen Portal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CivicProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
          <RolePerspectiveBanner />
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
              <Route path="/authority" element={<AuthorityDashboard />} />
              <Route path="/management" element={<ComplaintManagementPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <CivicAiBot />
          <ToastNotification />
        </div>
      </BrowserRouter>
    </CivicProvider>
  );
}
