import React from 'react';
import { ComplaintPriority } from '../../types';
import { AlertTriangle, AlertOctagon, Info, ShieldAlert } from 'lucide-react';

interface PriorityMeterProps {
  priority: ComplaintPriority;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityMeter: React.FC<PriorityMeterProps> = ({
  priority,
  score,
  showScore = true,
  size = 'md'
}) => {
  const configs: Record<
    ComplaintPriority,
    { label: string; bg: string; text: string; bar: string; icon: React.ReactNode }
  > = {
    critical: {
      label: 'Critical',
      bg: 'bg-rose-500/10 border-rose-500/20 backdrop-blur-md',
      text: 'text-rose-700',
      bar: 'bg-rose-500',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
    },
    high: {
      label: 'High',
      bg: 'bg-amber-500/10 border-amber-500/20 backdrop-blur-md',
      text: 'text-amber-800',
      bar: 'bg-amber-500',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
    },
    medium: {
      label: 'Standard',
      bg: 'bg-sky-500/10 border-sky-500/20 backdrop-blur-md',
      text: 'text-sky-800',
      bar: 'bg-sky-500',
      icon: <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
    },
    low: {
      label: 'Routine',
      bg: 'bg-slate-500/10 border-slate-500/20 backdrop-blur-md',
      text: 'text-slate-700',
      bar: 'bg-slate-400',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
    }
  };

  const item = configs[priority] || configs.medium;
  const isCompact = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-1.5 ${isCompact ? 'text-xs' : 'text-xs font-semibold'}`}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${item.bg} ${item.text} shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}>
        {item.icon}
        <span>{item.label}</span>
      </span>
      {showScore && score !== undefined && (
        <span className="font-mono tabular-nums text-slate-600 font-bold text-xs bg-slate-100/60 px-1.5 py-0.5 rounded-md border border-slate-200/50">
          {score}<span className="text-slate-400 font-normal">/100</span>
        </span>
      )}
    </div>
  );
};
