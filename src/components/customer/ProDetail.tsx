import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Award, 
  Clock, 
  CheckCircle, 
  Share2, 
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { ProfessionalProfile } from '../../types';
import { StarRating } from '../common/StarRating';
import { VerifiedBadge } from '../common/Badge';

interface ProDetailProps {
  pro: ProfessionalProfile;
  onClose: () => void;
  onBook: () => void;
}

export const ProDetail: React.FC<ProDetailProps> = ({ pro, onClose, onBook }) => {
  const { currentCountry, reviews } = useApp();
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<string | null>(null);
  const [showContactAlert, setShowContactAlert] = useState<string | null>(null);

  // Filter reviews for this pro
  const proReviews = reviews.filter(r => r.professionalId === pro.id);

  const handleCall = () => {
    setShowContactAlert(`Dialing ${pro.phoneNumber}... (Simulated phone dispatch)`);
    setTimeout(() => setShowContactAlert(null), 3000);
  };

  const handleWhatsApp = () => {
    setShowContactAlert(`Opening WhatsApp chat with ${pro.fullName} at ${pro.whatsappNumber}...`);
    setTimeout(() => setShowContactAlert(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden relative">
        
        {/* Sticky Header with Close & Share */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {pro.categoryName} Profile
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  setShowContactAlert('Professional profile link copied to clipboard!');
                  setTimeout(() => setShowContactAlert(null), 2500);
                }
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Alert Notification Toast */}
          {showContactAlert && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between">
              <span>{showContactAlert}</span>
              <button onClick={() => setShowContactAlert(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          {/* Profile Hero Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={pro.avatarUrl}
                alt={pro.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-slate-200 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1">
                <VerifiedBadge size="md" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {pro.fullName}
                </h2>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  pro.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pro.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {pro.isAvailable ? 'Available Now' : 'Offline'}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <StarRating rating={pro.rating} reviewCount={pro.reviewCount} size="md" />
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-semibold">{pro.completedJobsCount} jobs completed</span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{pro.city}, {currentCountry.name} ({pro.serviceRadiusKm} km coverage)</span>
              </div>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Hourly Rate</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {currentCountry.currencySymbol}{pro.hourlyRate}
              </div>
              <div className="text-[10px] text-slate-400">Standard labor</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Visit Fee</div>
              <div className="text-base font-extrabold text-blue-600 mt-0.5">
                {currentCountry.currencySymbol}{pro.visitFee}
              </div>
              <div className="text-[10px] text-slate-400">Diagnosis on site</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Experience</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {pro.experienceYears}+ Yrs
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">Licensed Pro</div>
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About the Professional</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xs">
              {pro.bio}
            </p>
          </div>

          {/* Verified Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Skills & Tools</h3>
            <div className="flex flex-wrap gap-1.5">
              {pro.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200/60"
                >
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Gallery */}
          {pro.workGallery.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recent Work Gallery
                </h3>
                <span className="text-[11px] text-slate-500">{pro.workGallery.length} verified photos</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {pro.workGallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedGalleryPhoto(imgUrl)}
                    className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 cursor-pointer group"
                  >
                    <img src={imgUrl} alt="Work photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Reviews ({proReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{pro.rating.toFixed(1)} out of 5.0</span>
              </div>
            </div>

            <div className="space-y-3">
              {proReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={rev.customerName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                    </div>
                    <StarRating rating={rev.rating} size="sm" showNumber={false} />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rev.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {rev.responseFromPartner && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-500 bg-blue-50/50 p-2 rounded-r-lg text-[11px] text-blue-900">
                      <span className="font-bold block mb-0.5">{pro.fullName} (Partner response):</span>
                      {rev.responseFromPartner}
                    </div>
                  )}
                </div>
              ))}

              {proReviews.length === 0 && (
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No verified customer reviews written yet for this professional.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions (Direct Call, WhatsApp, Book Now) */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex items-center gap-2.5 z-20">
          <button
            onClick={handleCall}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            title="Call Professional"
          >
            <Phone className="w-5 h-5 text-slate-700" />
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
            title="WhatsApp Professional"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </button>

          <button
            onClick={onBook}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Service ({currentCountry.currencySymbol}{pro.visitFee} Visit)</span>
          </button>
        </div>

        {/* Lightbox for gallery images */}
        {selectedGalleryPhoto && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedGalleryPhoto(null)}>
            <div className="relative max-w-2xl max-h-[85vh]">
              <img src={selectedGalleryPhoto} alt="Gallery expanded" className="w-full h-full object-contain rounded-xl" />
              <button className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
