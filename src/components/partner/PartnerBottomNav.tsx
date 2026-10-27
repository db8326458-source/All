import React from 'react';
import { LayoutDashboard, CalendarCheck, DollarSign, Sliders, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type PartnerTab = 'dashboard' | 'bookings' | 'earnings' | 'services' | 'notifications';

interface PartnerBottomNavProps {
  activeTab: PartnerTab;
  onSelectTab: (tab: PartnerTab) => void;
}

export const PartnerBottomNav: React.FC<PartnerBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { bookings, currentPartner, notifications } = useApp();

  const pendingRequests = bookings.filter(
    b => b.professionalId === currentPartner.id && b.status === 'pending'
  ).length;

  const partnerNotifs = notifications.filter(
    n => n.recipientId === currentPartner.id && !n.read
  ).length;

  const tabs: { id: PartnerTab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Jobs', icon: CalendarCheck, badge: pendingRequests },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'services', label: 'Rates & Skills', icon: Sliders },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: partnerNotifs },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-white select-none pb-safe" aria-label="Partner Navigation">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
