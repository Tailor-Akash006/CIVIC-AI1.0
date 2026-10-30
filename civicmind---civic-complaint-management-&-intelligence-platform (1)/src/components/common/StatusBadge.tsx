import React from 'react';
import { ComplaintStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, Wrench, FileSearch, Check } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<
    ComplaintStatus, 
    { label: string; textClass: string; bgClass: string; borderClass: string; icon: React.ReactNode }
  > = {
    submitted: {
      label: 'Submitted',
      textClass: 'text-amber-800',
      bgClass: 'bg-amber-500/10 backdrop-blur-md',
      borderClass: 'border-amber-500/20',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
    },
    under_review: {
      label: 'Under Review',
      textClass: 'text-blue-800',
      bgClass: 'bg-blue-500/10 backdrop-blur-md',
      borderClass: 'border-blue-500/20',
      icon: <FileSearch className="w-3.5 h-3.5 text-blue-600 shrink-0" />
    },
    assigned: {
      label: 'Assigned',
      textClass: 'text-indigo-800',
      bgClass: 'bg-indigo-500/10 backdrop-blur-md',
      borderClass: 'border-indigo-500/20',
      icon: <AlertCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
    },
    in_progress: {
      label: 'In Progress',
      textClass: 'text-sky-800',
      bgClass: 'bg-sky-500/10 backdrop-blur-md',
      borderClass: 'border-sky-500/20',
      icon: <Wrench className="w-3.5 h-3.5 text-sky-600 shrink-0" />
    },
    resolved: {
      label: 'Resolved',
      textClass: 'text-emerald-800',
      bgClass: 'bg-emerald-500/10 backdrop-blur-md',
      borderClass: 'border-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
    },
    closed: {
      label: 'Closed / Merged',
      textClass: 'text-slate-700',
      bgClass: 'bg-slate-500/10 backdrop-blur-md',
      borderClass: 'border-slate-500/20',
      icon: <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
    }
  };

  const item = config[status] || config.submitted;
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs gap-1.5' : size === 'lg' ? 'px-3.5 py-1.5 text-sm gap-2' : 'px-3 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${item.bgClass} ${item.textClass} ${item.borderClass} ${sizeClasses} whitespace-nowrap shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
