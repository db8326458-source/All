import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Phone, 
  MessageSquare,
  Check, 
  X, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { PartnerVerificationBanner } from './PartnerVerificationBanner';
import { Booking } from '../../types';
import { StarRating } from '../common/StarRating';

interface PartnerDashboardProps {
  onSelectBooking: (booking: Booking) => void;
  onOpenChat: (booking: Booking) => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ onSelectBooking, onOpenChat }) => {
  const { 
    currentPartner, 
    togglePartnerAvailability, 
    bookings, 
    updateBookingStatus, 
    currentCountry,
    reviews
  } = useApp();

  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Partner's specific bookings
  const myBookings = bookings.filter(b => b.professionalId === currentPartner.id);
  const pendingRequests = myBookings.filter(b => b.status === 'pending');
  const activeJobs = myBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress');
  const completedJobs = myBookings.filter(b => b.status === 'completed');

  // Total earnings calculated from completed bookings + base
  const totalEarnings = completedJobs.reduce((acc, curr) => {
    return acc + (curr.finalCharges?.total || curr.estimatedCharges.totalEstimate);
  }, 1280);

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(
      bookingId,
      'accepted',
      `${currentPartner.fullName} confirmed availability and accepted your booking.`
    );
  };

  const handleConfirmReject = (bookingId: string) => {
    updateBookingStatus(
      bookingId,
      'rejected',
      `Booking declined by technician: ${rejectReason || 'Schedule conflict'}`,
      { rejectionReason: rejectReason || 'Schedule conflict' }
    );
    setRejectingBookingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-5 pb-14 px-4 pt-4">
      
      {/* Top Bar: Profile & Availability Toggle */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={currentPartner.avatarUrl}
              alt={currentPartner.fullName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base text-white">{currentPartner.fullName}</h1>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {currentPartner.categoryName} • {currentPartner.city}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={currentPartner.rating} reviewCount={currentPartner.reviewCount} size="sm" />
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Duty Status
            </div>
            <button
              onClick={() => togglePartnerAvailability(currentPartner.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                currentPartner.isAvailable
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentPartner.isAvailable ? 'bg-slate-950' : 'bg-slate-500'}`} />
              <span>{currentPartner.isAvailable ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <PartnerVerificationBanner partner={currentPartner} />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            {currentCountry.currencySymbol}{totalEarnings.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+18% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Jobs</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            {activeJobs.length}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            {pendingRequests.length} pending requests
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            {currentPartner.completedJobsCount}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            100% on-time rate
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            {currentPartner.rating.toFixed(1)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            From {currentPartner.reviewCount} customer reviews
          </div>
        </div>
      </div>

      {/* New Booking Requests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Incoming Job Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-bounce">
                {pendingRequests.length} New
              </span>
            )}
          </h2>
        </div>

        {pendingRequests.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {booking.referenceNumber}
              </span>
              <span className="text-xs font-extrabold text-slate-900">
                {currentCountry.currencySymbol}{booking.estimatedCharges.totalEstimate} Est.
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900 text-sm">{booking.specificIssue}</div>
              <p className="text-slate-600">{booking.serviceDescription}</p>
              <div className="text-slate-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.customerAddress}</span>
              </div>
              <div className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.scheduledDate} ({booking.scheduledTimeSlot})</span>
              </div>
            </div>

            {/* Accept / Reject Buttons */}
            {rejectingBookingId === booking.id ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-rose-900">Decline Request Reason:</div>
                <input
                  type="text"
                  placeholder="e.g. Schedule already full, outside range..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2 bg-white border border-rose-200 rounded-lg text-slate-800 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmReject(booking.id)}
                    className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                  >
                    Confirm Decline
                  </button>
                  <button
                    onClick={() => setRejectingBookingId(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAcceptBooking(booking.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Job</span>
                </button>
                <button
                  onClick={() => setRejectingBookingId(booking.id)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Decline</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {pendingRequests.length === 0 && (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No pending booking requests right now. Keep your duty status Online to receive requests.
          </div>
        )}
      </div>

      {/* Active Jobs in Progress */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Active Jobs ({activeJobs.length})
        </h2>

        {activeJobs.map((booking) => (
          <div
            key={booking.id}
            onClick={() => onSelectBooking(booking)}
            className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {booking.referenceNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                booking.status === 'in_progress' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>

            <div className="text-xs">
              <div className="font-bold text-slate-900 text-sm">{booking.specificIssue}</div>
              <div className="text-slate-600 mt-0.5">Customer: {booking.customerName} ({booking.customerPhone})</div>
              <div className="text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.customerAddress}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChat(booking);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Customer</span>
              </button>

              <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                <span>Update Progress</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
