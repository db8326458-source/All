import React from 'react';
import { Home, Search, CalendarCheck2, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type CustomerTab = 'home' | 'search' | 'bookings' | 'profile';

interface CustomerBottomNavProps {
  activeTab: CustomerTab;
  onSelectTab: (tab: CustomerTab) => void;
}

export const CustomerBottomNav: React.FC<CustomerBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { bookings, currentCustomer } = useApp();

  const myBookingsCount = bookings.filter(
    b => b.customerId === currentCustomer.id && (b.status === 'pending' || b.status === 'accepted' || b.status === 'in_progress')
  ).length;

  const tabs: { id: CustomerTab; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck2, badge: myBookingsCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-white select-none pb-safe" aria-label="Customer Navigation">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-blue-400' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
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
