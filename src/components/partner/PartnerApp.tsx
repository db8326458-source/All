import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PartnerBottomNav, PartnerTab } from './PartnerBottomNav';
import { PartnerDashboard } from './PartnerDashboard';
import { PartnerEarnings } from './PartnerEarnings';
import { PartnerServices } from './PartnerServices';
import { PartnerJobModal } from './PartnerJobModal';
import { CustomerChatModal } from '../customer/CustomerChatModal';
import { Booking } from '../../types';
import { Briefcase, Bell, CheckCircle2, User, RefreshCw } from 'lucide-react';

export const PartnerApp: React.FC = () => {
  const { currentPartner, setCurrentPartner, professionals, notifications } = useApp();
  const [activeTab, setActiveTab] = useState<PartnerTab>('dashboard');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  const partnerNotifs = notifications.filter(n => n.recipientId === currentPartner.id);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      
      {/* Partner Brand Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
            P
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            HELP WORLD <span className="text-emerald-400 font-semibold text-xs">PARTNER</span>
          </span>
        </div>

        {/* Demo Account Switcher to test Approved vs Pending vs Rejected states */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden sm:inline">Active Pro:</span>
          <select
            value={currentPartner.id}
            onChange={(e) => {
              const target = professionals.find(p => p.id === e.target.value);
              if (target) setCurrentPartner(target);
            }}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
          >
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.verificationStatus.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <PartnerDashboard
            onSelectBooking={(b) => setSelectedBooking(b)}
            onOpenChat={(b) => setChatBooking(b)}
          />
        )}

        {activeTab === 'bookings' && (
          <PartnerDashboard
            onSelectBooking={(b) => setSelectedBooking(b)}
            onOpenChat={(b) => setChatBooking(b)}
          />
        )}

        {activeTab === 'earnings' && <PartnerEarnings />}

        {activeTab === 'services' && <PartnerServices />}

        {activeTab === 'notifications' && (
          <div className="p-4 space-y-3 max-w-xl mx-auto">
            <h2 className="font-extrabold text-slate-900 text-base">Partner Notification Center</h2>
            <div className="space-y-2">
              {partnerNotifs.map((n) => (
                <div key={n.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600">{n.message}</p>
                </div>
              ))}
              {partnerNotifs.length === 0 && (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  No notifications yet. You will receive alerts when new bookings arrive or when admin verifies documents.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Partner Bottom Navigation */}
      <PartnerBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Modals */}
      {selectedBooking && (
        <PartnerJobModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onOpenChat={() => {
            setChatBooking(selectedBooking);
            setSelectedBooking(null);
          }}
        />
      )}

      {chatBooking && (
        <CustomerChatModal
          booking={chatBooking}
          currentRole="partner"
          onClose={() => setChatBooking(null)}
        />
      )}

    </div>
  );
};
