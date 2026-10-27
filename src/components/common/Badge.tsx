import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { BookingStatus, VerificationStatus } from '../../types';

interface BadgeProps {
  status: BookingStatus | VerificationStatus | 'open' | 'resolved' | 'investigating' | 'dismissed' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  switch (status) {
    case 'approved':
    case 'completed':
    case 'resolved':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </span>
      );

    case 'accepted':
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 animate-pulse" />
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </span>
      );

    case 'pending':
    case 'pending_review':
    case 'investigating':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{status === 'pending_review' ? 'Pending Review' : 'Pending'}</span>
        </span>
      );

    case 'rejected':
    case 'cancelled':
    case 'dismissed':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </span>
      );

    case 'not_submitted':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Not Submitted</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 font-medium ${sizeClasses}`}>
          <span className="capitalize">{status}</span>
        </span>
      );
  }
};

export const VerifiedBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white font-semibold ${
      size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
    }`}>
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
      <span>Verified Pro</span>
    </span>
  );
};
