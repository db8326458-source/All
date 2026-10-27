import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PhoneCall,
  SlidersHorizontal,
  Star
} from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { StarRating } from '../common/StarRating';
import { VerifiedBadge } from '../common/Badge';
import { ProfessionalProfile } from '../../types';

interface CustomerHomeProps {
  onSelectCategory: (categorySlug: string) => void;
  onSelectPro: (pro: ProfessionalProfile) => void;
  onOpenSearch: () => void;
  onViewBooking: (bookingId: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectCategory,
  onSelectPro,
  onOpenSearch,
  onViewBooking
}) => {
  const { 
    currentCountry, 
    currentCity, 
    categories, 
    professionals, 
    bookings, 
    currentCustomer 
  } = useApp();

  const [hasLocationPermission, setHasLocationPermission] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter approved, active pros in current country
  // ONLY approved pros appear in customer search and home!
  const approvedPros = professionals.filter(
    p => p.verificationStatus === 'approved' && !p.isSuspended
  );

  const topRatedPros = [...approvedPros].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const featuredPros = approvedPros.filter(p => p.isFeatured);

  // Active user booking
  const activeBooking = bookings.find(
    b => b.customerId === currentCustomer.id && (b.status === 'accepted' || b.status === 'in_progress' || b.status === 'pending')
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch();
  };

  return (
    <div className="space-y-5 pb-8">
      
      {/* Top Welcome & City bar */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white p-4 sm:p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Current Service Area</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-1.5 tracking-tight text-white mt-0.5">
              <span>{currentCity}, {currentCountry.name}</span>
              <span className="text-base">{currentCountry.flag}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{currentCustomer.fullName}</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live GPS Active
              </div>
            </div>
            <img 
              src={currentCustomer.avatarUrl} 
              alt={currentCustomer.fullName} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
          </div>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-xl text-slate-900">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search electrician, plumber, AC repair..."
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none py-1.5"
            />
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
              title="Search Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Location Notice banner */}
        {!hasLocationPermission && (
          <div className="mt-3 bg-amber-500/20 border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Enable GPS for precise 5km distance dispatch.</span>
            </div>
            <button 
              onClick={() => setHasLocationPermission(true)}
              className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px]"
            >
              Allow
            </button>
          </div>
        )}
      </div>

      <div className="px-4 space-y-6">

        {/* Active Booking Live Shortcut (if any) */}
        {activeBooking && (
          <div 
            onClick={() => onViewBooking(activeBooking.id)}
            className="cursor-pointer bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-md border border-blue-700/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Active Booking • {activeBooking.referenceNumber}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                activeBooking.status === 'in_progress' ? 'bg-amber-400 text-slate-950' : 'bg-blue-500 text-white'
              }`}>
                {activeBooking.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={activeBooking.professionalAvatar} 
                  alt={activeBooking.professionalName} 
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <div className="text-sm font-bold text-white">{activeBooking.professionalName}</div>
                  <div className="text-xs text-blue-200">{activeBooking.specificIssue}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-blue-300">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* Service Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Service Categories
              </h2>
              <p className="text-xs text-slate-500">Certified local professionals on-demand</p>
            </div>
            <button 
              onClick={onOpenSearch}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {categories.filter(c => c.active).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group active:scale-95"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <CategoryIcon name={cat.slug} className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  from {currentCountry.currencySymbol}{cat.startingPrice}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Top-Rated Professionals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Top Rated Near You</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500">Highest rated & background verified</p>
            </div>
            <button 
              onClick={onOpenSearch}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              See More
            </button>
          </div>

          <div className="space-y-3">
            {topRatedPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => onSelectPro(pro)}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img 
                      src={pro.avatarUrl} 
                      alt={pro.fullName} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <VerifiedBadge size="sm" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                        {pro.fullName}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {pro.categoryName}
                      </span>
                    </div>

                    <div className="mt-1">
                      <StarRating rating={pro.rating} reviewCount={pro.reviewCount} size="sm" />
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                      {pro.headline}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{pro.city} • {pro.serviceRadiusKm} km</span>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">
                        {currentCountry.currencySymbol}{pro.hourlyRate}/hr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    Visit fee: <span className="font-bold text-slate-800">{currentCountry.currencySymbol}{pro.visitFee}</span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPro(pro);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-600/30 transition-all flex items-center gap-1"
                  >
                    <span>Book Pro</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200/80 p-4 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-950">
              The HELP WORLD Safety & Trust Guarantee
            </h4>
            <p className="text-xs text-blue-900/80 mt-0.5 leading-relaxed">
              Every professional undergoes trade certification verification, national ID validation, and criminal record screening before receiving approval.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
