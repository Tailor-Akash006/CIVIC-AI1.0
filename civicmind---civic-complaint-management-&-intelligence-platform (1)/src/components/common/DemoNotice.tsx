import React from 'react';
import { Sparkles, Database } from 'lucide-react';

interface DemoNoticeProps {
  type?: 'ai' | 'analytics' | 'general';
  text?: string;
  className?: string;
}

export const DemoNotice: React.FC<DemoNoticeProps> = ({
  type = 'general',
  text,
  className = ''
}) => {
  const defaultText = 
    type === 'ai' 
      ? 'Demo Simulation: AI triage, duplicate scoring & reasoning generated client-side until NestJS connection'
      : type === 'analytics'
      ? 'Demo Metrics: Real database aggregation with spatial clustering for municipal evaluation'
      : 'Demo Mode: All actions update real-time reactive storage layer';

  const icon = type === 'ai' 
    ? <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
    : <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)] text-[11px] font-semibold text-slate-600 ${className}`}>
      {icon}
      <span>{text || defaultText}</span>
    </div>
  );
};
