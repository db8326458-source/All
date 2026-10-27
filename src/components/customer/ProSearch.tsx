import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Star, 
  ShieldCheck, 
  Map, 
  List, 
  X, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { ProfessionalProfile } from '../../types';
import { StarRating } from '../common/StarRating';
import { VerifiedBadge } from '../common/Badge';

interface ProSearchProps {
  initialCategorySlug?: string;
  onSelectPro: (pro: ProfessionalProfile) => void;
}

export const ProSearch: React.FC<ProSearchProps> = ({ initialCategorySlug, onSelectPro }) => {
  const { professionals, categories, currentCountry, currentCity } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(150);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'experience'>('rating');
  const [viewType, setViewType] = useState<'list' | 'map'>('list');
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [selectedMapPinPro, setSelectedMapPinPro] = useState<ProfessionalProfile | null>(null);

  // Filter ONLY approved pros (rejected/pending pros are hidden from customer search as required!)
  const filteredPros = useMemo(() => {
    return professionals
      .filter(p => {
        // Enforce approved and non-suspended requirement
        if (p.verificationStatus !== 'approved' || p.isSuspended) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.fullName.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchSkills = p.skills.some(s => s.toLowerCase().includes(q));
          const matchBio = p.bio.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchSkills && !matchBio) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
          return false;
        }

        // Rating
        if (selectedRating > 0 && p.rating < selectedRating) {
          return false;
        }

        // Price
        if (p.hourlyRate > maxHourlyRate) {
          return false;
        }

        // Availability
        if (onlyAvailable && !p.isAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.hourlyRate - b.hourlyRate;
        if (sortBy === 'price_desc') return b.hourlyRate - a.hourlyRate;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        return 0;
      });
  }, [professionals, searchQuery, selectedCategory, selectedRating, maxHourlyRate, onlyAvailable, sortBy]);

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + 
                            (selectedRating > 0 ? 1 : 0) + 
                            (maxHourlyRate < 150 ? 1 : 0) + 
                            (onlyAvailable ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedRating(0);
    setMaxHourlyRate(150);
    setOnlyAvailable(false);
    setSortBy('rating');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Search Header */}
      <div className="bg-white p-4 border-b border-slate-200 sticky top-12 z-20 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by specialty, skill, or name..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-800"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.filter(c => c.active).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Controls row: view toggle, filter button, active counts */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiltersModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-semibold transition-colors ${
                activeFilterCount > 0 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1.5 text-xs font-medium focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-semibold transition-colors ${
                viewType === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewType('map')}
              className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-semibold transition-colors ${
                viewType === 'map' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="text-xs font-semibold text-slate-500 mb-2">
          Found {filteredPros.length} verified {filteredPros.length === 1 ? 'professional' : 'professionals'} in {currentCity}
        </div>

        {/* List View */}
        {viewType === 'list' ? (
          <div className="space-y-3">
            {filteredPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => onSelectPro(pro)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={pro.avatarUrl}
                      alt={pro.fullName}
                      className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <VerifiedBadge size="sm" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">
                        {pro.fullName}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-slate-900">
                          {currentCountry.currencySymbol}{pro.hourlyRate}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {pro.categoryName}
                      </span>
                      <StarRating rating={pro.rating} reviewCount={pro.reviewCount} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {pro.headline}
                    </p>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {pro.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                      {pro.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{pro.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Within {pro.serviceRadiusKm} km</span>
                        </span>
                        <span>•</span>
                        <span>Visit Fee: {currentCountry.currencySymbol}{pro.visitFee}</span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-blue-600 text-xs">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredPros.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No verified professionals match your filters</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try broadening your price range, clearing specific filters, or selecting "All Categories".
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Map View Simulation */
          <div className="space-y-3">
            <div className="w-full h-[400px] bg-slate-800 rounded-2xl relative overflow-hidden shadow-inner border border-slate-300">
              
              {/* Simulated Map Background */}
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center"
                style={{
                  backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#1e293b 1px, #0f172a 1px)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px'
                }}
              />

              {/* Grid Roads Simulator */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-700/50" strokeWidth="2">
                <line x1="10%" y1="0" x2="10%" y2="100%" />
                <line x1="35%" y1="0" x2="35%" y2="100%" />
                <line x1="65%" y1="0" x2="65%" y2="100%" />
                <line x1="90%" y1="0" x2="90%" y2="100%" />
                <line x1="0" y1="25%" x2="100%" y2="25%" />
                <line x1="0" y1="60%" x2="100%" y2="60%" />
                <line x1="0" y1="85%" x2="100%" y2="85%" strokeWidth="4" className="stroke-slate-600/70" />
              </svg>

              {/* Map Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentCity} Service Grid</span>
              </div>

              {/* Interactive Pro Pins */}
              {filteredPros.map((pro, index) => {
                const positions = [
                  { top: '30%', left: '25%' },
                  { top: '45%', left: '70%' },
                  { top: '65%', left: '40%' },
                  { top: '20%', left: '60%' },
                  { top: '75%', left: '75%' },
                  { top: '40%', left: '20%' },
                ];
                const pos = positions[index % positions.length];
                const isSelected = selectedMapPinPro?.id === pro.id;

                return (
                  <div
                    key={pro.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    onClick={() => setSelectedMapPinPro(pro)}
                  >
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-lg transition-transform ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110 z-20'
                        : 'bg-white text-slate-900 hover:scale-105'
                    }`}>
                      <img 
                        src={pro.avatarUrl} 
                        alt={pro.fullName} 
                        className="w-5 h-5 rounded-full object-cover" 
                      />
                      <span className="text-[11px] font-bold">
                        {currentCountry.currencySymbol}{pro.hourlyRate}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* User Current Location Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/40 animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-blue-600 ring-2 ring-white shadow-md z-10" />
                <span className="text-[10px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 shadow-sm">
                  You
                </span>
              </div>
            </div>

            {/* Selected Map Card */}
            {selectedMapPinPro && (
              <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMapPinPro.avatarUrl}
                    alt={selectedMapPinPro.fullName}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{selectedMapPinPro.fullName}</h4>
                      <VerifiedBadge size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {selectedMapPinPro.categoryName} • {currentCountry.currencySymbol}{selectedMapPinPro.hourlyRate}/hr
                    </div>
                    <div className="mt-0.5">
                      <StarRating rating={selectedMapPinPro.rating} size="sm" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPro(selectedMapPinPro)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  View Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-over / Modal for Advanced Filters */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filter Professionals
              </h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                <span>Maximum Hourly Rate</span>
                <span className="text-blue-600 font-extrabold text-sm">
                  {currentCountry.currencySymbol}{maxHourlyRate}/hr
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                step="5"
                value={maxHourlyRate}
                onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{currentCountry.currencySymbol}30</span>
                <span>{currentCountry.currencySymbol}90</span>
                <span>{currentCountry.currencySymbol}150</span>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Minimum Customer Rating</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRating(r)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedRating === r
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r} ★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Online Now Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-800">Available Immediately</div>
                <div className="text-[11px] text-slate-500">Only show technicians currently on-duty</div>
              </div>
              <button
                type="button"
                onClick={() => setOnlyAvailable(!onlyAvailable)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  onlyAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    onlyAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/30"
              >
                Apply Filters ({filteredPros.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
