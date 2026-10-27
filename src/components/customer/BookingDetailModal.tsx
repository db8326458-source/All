import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { Booking } from '../../types';
import { StatusBadge } from '../common/Badge';

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onOpenChat: () => void;
  onFileComplaint: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onOpenChat,
  onFileComplaint
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {booking.referenceNumber}
              </span>
              <StatusBadge status={booking.status} size="sm" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">
              Booking Details
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">

          {/* Pro Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={booking.professionalAvatar}
                alt={booking.professionalName}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{booking.professionalName}</h3>
                <p className="text-slate-500 font-medium">{booking.professionalCategory}</p>
                <p className="text-slate-400 text-[11px]">{booking.professionalPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenChat}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                title="Open Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Service & Location */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Service Information
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">{booking.specificIssue}</span>
                  <span className="text-slate-600 leading-relaxed">{booking.serviceDescription}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">{booking.customerAddress}</span>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{booking.scheduledDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{booking.scheduledTimeSlot}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Status Timeline
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              {booking.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx < booking.timeline.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-blue-200" />
                  )}
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 z-10 text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 capitalize">{step.status.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoicing Breakdown */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Charges & Invoicing
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Visit & Inspection Fee:</span>
                <span>{booking.estimatedCharges.currency} {booking.finalCharges?.visitFee || booking.estimatedCharges.visitFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Labor Charges:</span>
                <span>{booking.estimatedCharges.currency} {booking.finalCharges?.labor || booking.estimatedCharges.laborEstimate}</span>
              </div>
              {booking.finalCharges?.parts && (
                <div className="flex justify-between text-slate-600">
                  <span>Replacement Parts & Materials:</span>
                  <span>{booking.estimatedCharges.currency} {booking.finalCharges.parts}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
                <span>Total Amount:</span>
                <span className="text-blue-600">
                  {booking.estimatedCharges.currency} {booking.finalCharges?.total || booking.estimatedCharges.totalEstimate}
                </span>
              </div>
            </div>
          </div>

          {/* Completion Notes & Photos if available */}
          {booking.completionNotes && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block">Technician Completion Notes:</span>
              <p className="text-emerald-800 leading-relaxed">{booking.completionNotes}</p>
            </div>
          )}

          {/* Cancellation rules */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Cancellation Policy</span>
            <p>Free cancellation up to 2 hours prior to scheduled appointment. Once technician is dispatched, a standard visit fee applies.</p>
          </div>

          {/* Dispute / Complaint trigger */}
          <div className="pt-2 text-center">
            <button
              onClick={onFileComplaint}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
            >
              Have an issue with this service? File a formal complaint
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
