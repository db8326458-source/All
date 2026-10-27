import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Smartphone, 
  Database, 
  Globe, 
  MapPin, 
  Check, 
  ChevronDown,
  Monitor
} from 'lucide-react';
import { SUPPORTED_COUNTRIES } from '../../lib/mockData';

export const ProductSwitcher: React.FC = () => {
  const { 
    activeProduct, 
    setActiveProduct, 
    viewMode, 
    setViewMode, 
    currentCountry, 
    setCurrentCountry, 
    currentCity, 
    setCurrentCity,
    professionals,
    bookings
  } = useApp();

  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const pendingVerificationCount = professionals.filter(p => p.verificationStatus === 'pending_review').length;
  const pendingBookingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black tracking-wider text-white shadow-sm shadow-blue-500/40">
              HW
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5 leading-none">
                HELP WORLD
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Find Trusted Help, Anywhere.</p>
            </div>
          </div>

          {/* Product Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5" aria-label="Product Switcher">
            <button
              onClick={() => setActiveProduct('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeProduct === 'customer'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer App</span>
            </button>

            <button
              onClick={() => setActiveProduct('partner')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeProduct === 'partner'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Partner App</span>
              {pendingBookingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveProduct('admin')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeProduct === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
              {pendingVerificationCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold ml-0.5">
                  {pendingVerificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveProduct('apk_guide')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeProduct === 'apk_guide'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              title="Android Cloud Build (Capacitor)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Build APK</span>
            </button>

            <button
              onClick={() => setActiveProduct('database_schema')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeProduct === 'database_schema'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              title="Supabase Schema & RLS"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">SQL Schema</span>
            </button>
          </nav>

          {/* Location & Frame Toggle */}
          <div className="flex items-center gap-2">
            {/* Global Country & City selector */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:bg-slate-750"
              >
                <span className="text-sm">{currentCountry.flag}</span>
                <span className="font-semibold text-white">{currentCity}</span>
                <span className="text-slate-400 text-[11px] font-normal hidden sm:inline">({currentCountry.currencySymbol})</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {showLocationPicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLocationPicker(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        Select Global Market
                      </div>
                      <span className="text-[10px] text-slate-400">{SUPPORTED_COUNTRIES.length} Countries</span>
                    </div>

                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                      {SUPPORTED_COUNTRIES.map((country) => (
                        <div key={country.code} className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                          <button
                            onClick={() => {
                              setCurrentCountry(country);
                              setCurrentCity(country.cities[0]);
                            }}
                            className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800"
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="text-base">{country.flag}</span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {country.currency}
                            </span>
                          </button>

                          {/* Cities sub-pills if country matches */}
                          {currentCountry.code === country.code && (
                            <div className="flex flex-wrap gap-1 mt-1.5 pl-6">
                              {country.cities.map((city) => (
                                <button
                                  key={city}
                                  onClick={() => {
                                    setCurrentCity(city);
                                    setShowLocationPicker(false);
                                  }}
                                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                                    currentCity === city
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Viewport Frame Mode Toggle (only visible on screen widths > 640px) */}
            <div className="hidden lg:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('responsive')}
                title="Full Responsive"
                className={`p-1.5 rounded ${viewMode === 'responsive' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('mobile_frame')}
                title="Simulate Android Mobile Viewport"
                className={`p-1.5 rounded ${viewMode === 'mobile_frame' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
