import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  XCircle,
  FileText
} from 'lucide-react';
import { BookingStatus, Booking } from '../../types';
import { StatusBadge } from '../common/Badge';

interface MyBookingsProps {
  onSelectBooking: (booking: Booking) => void;
  onOpenChat: (booking: Booking) => void;
  onWriteReview: (booking: Booking) => void;
  onFileComplaint: (booking: Booking) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  onSelectBooking,
  onOpenChat,
  onWriteReview,
  onFileComplaint
}) => {
  const { bookings, currentCustomer, updateBookingStatus, reviews } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Customer's bookings
  const myBookings = bookings.filter(b => b.customerId === currentCustomer.id);

  const filtered = myBookings.filter(b => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  const filterTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const handleConfirmCancel = (bookingId: string) => {
    updateBookingStatus(
      bookingId,
      'cancelled',
      `Customer cancelled: ${cancelReason || 'Customer requested cancellation'}`,
      { cancellationReason: cancelReason || 'Customer schedule change' }
    );
    setCancellingBookingId(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-4 pb-12 px-4 pt-3">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          My Service Bookings
        </h1>
        <p className="text-xs text-slate-500">Track technician dispatch, invoices, and completed jobs</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {filterTabs.map((tab) => {
          const count = tab.id === 'all' 
            ? myBookings.length 
            : myBookings.filter(b => b.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filtered.map((booking) => {
          const hasReviewed = reviews.some(r => r.bookingId === booking.id);

          return (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              {/* Header: Reference and Status */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {booking.referenceNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StatusBadge status={booking.status} size="sm" />
              </div>

              {/* Pro and service info */}
              <div 
                onClick={() => onSelectBooking(booking)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <img
                  src={booking.professionalAvatar}
                  alt={booking.professionalName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {booking.professionalName}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {booking.professionalCategory} • {booking.specificIssue}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.scheduledDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.scheduledTimeSlot}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Total charges info */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs">
                <span className="text-slate-500 font-medium">
                  {booking.status === 'completed' && booking.finalCharges ? 'Final Amount Paid' : 'Estimated Charges'}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {booking.estimatedCharges.currency} {booking.finalCharges?.total || booking.estimatedCharges.totalEstimate}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  onClick={() => onSelectBooking(booking)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Timeline & Details</span>
                </button>

                {/* Chat button */}
                <button
                  onClick={() => onOpenChat(booking)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>

                {/* Cancel button if pending or accepted */}
                {(booking.status === 'pending' || booking.status === 'accepted') && (
                  <button
                    onClick={() => setCancellingBookingId(booking.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Write Review button if completed */}
                {booking.status === 'completed' && (
                  <button
                    onClick={() => onWriteReview(booking)}
                    disabled={hasReviewed}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      hasReviewed 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hasReviewed ? 'Reviewed' : 'Rate & Review'}</span>
                  </button>
                )}

                {/* Complaint option */}
                <button
                  onClick={() => onFileComplaint(booking)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 ml-auto"
                >
                  Report issue
                </button>
              </div>

              {/* Cancel confirmation prompt */}
              {cancellingBookingId === booking.id && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-2">
                  <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Confirm Cancellation</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-rose-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmCancel(booking.id)}
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setCancellingBookingId(null)}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      Keep Booking
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No bookings found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You do not have any {activeFilter === 'all' ? '' : activeFilter} bookings. Browse verified professionals to book help today.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
