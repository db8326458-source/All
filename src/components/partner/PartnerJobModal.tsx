import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  DollarSign, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../../types';
import { StatusBadge } from '../common/Badge';

interface PartnerJobModalProps {
  booking: Booking;
  onClose: () => void;
  onOpenChat: () => void;
}

export const PartnerJobModal: React.FC<PartnerJobModalProps> = ({ booking, onClose, onOpenChat }) => {
  const { updateBookingStatus, currentCountry } = useApp();

  const [laborCharge, setLaborCharge] = useState<number>(booking.estimatedCharges.laborEstimate);
  const [partsCharge, setPartsCharge] = useState<number>(0);
  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalFinal = booking.estimatedCharges.visitFee + Number(laborCharge) + Number(partsCharge);

  const handleStartJob = () => {
    updateBookingStatus(
      booking.id,
      'in_progress',
      'Technician arrived on site and started diagnosis / repair work.'
    );
  };

  const handleCompleteJob = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateBookingStatus(
      booking.id,
      'completed',
      'Technician finished all repairs and verified proper operation.',
      {
        finalCharges: {
          visitFee: booking.estimatedCharges.visitFee,
          labor: Number(laborCharge),
          parts: Number(partsCharge),
          total: totalFinal
        },
        completionNotes: completionNotes || 'All requested repairs inspected and successfully completed.'
      }
    );

    setIsSubmitting(false);
  };

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
              Job Dispatch Details
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">

          {/* Customer info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer</div>
              <h3 className="font-bold text-slate-900 text-sm">{booking.customerName}</h3>
              <p className="text-slate-600">{booking.customerPhone}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenChat}
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center gap-1.5 font-bold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {/* Service details */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <div>
              <span className="font-bold text-slate-900 block text-sm">{booking.specificIssue}</span>
              <p className="text-slate-600 leading-relaxed mt-0.5">{booking.serviceDescription}</p>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium">{booking.customerAddress}</span>
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

          {/* Stepper Actions based on status */}
          {booking.status === 'accepted' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
              <div className="font-bold text-blue-950 text-sm">Next Step: Arrive on Site</div>
              <p className="text-blue-900">
                When you reach the customer's property, click below to notify the customer that work has started.
              </p>
              <button
                onClick={handleStartJob}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Mark Arrived & Start Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {booking.status === 'in_progress' && (
            <form onSubmit={handleCompleteJob} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="font-bold text-emerald-950 text-sm">Complete Job & Final Invoice</div>
              <p className="text-emerald-900 text-[11px]">
                Input actual labor and any replacement materials purchased before finalizing.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="font-semibold text-emerald-950 block mb-1">Labor Charge ({currentCountry.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={laborCharge}
                    onChange={(e) => setLaborCharge(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-emerald-950 block mb-1">Parts & Materials ({currentCountry.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={partsCharge}
                    onChange={(e) => setPartsCharge(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-emerald-950 block mb-1">Technician Repair Notes *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Replaced faulty 20A breaker with new Eaton unit, tested voltage at all receptacles..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex justify-between font-extrabold text-sm text-emerald-950 pt-2 border-t border-emerald-200">
                <span>Final Invoice Total:</span>
                <span className="text-emerald-700">{currentCountry.currencySymbol}{totalFinal}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalize Job & Submit Invoice</span>
              </button>
            </form>
          )}

          {booking.status === 'completed' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Job Completed Successfully</span>
              </div>
              <p className="text-slate-600">{booking.completionNotes}</p>
              <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                <span>Total Amount Earned:</span>
                <span className="text-emerald-600">{currentCountry.currencySymbol}{booking.finalCharges?.total || booking.estimatedCharges.totalEstimate}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
