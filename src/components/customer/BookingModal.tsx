import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Camera,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProfessionalProfile, Booking } from '../../types';

interface BookingModalProps {
  pro: ProfessionalProfile;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ pro, onClose, onSuccess }) => {
  const { 
    currentCountry, 
    currentCustomer, 
    addresses, 
    addCustomerAddress, 
    createBooking 
  } = useApp();

  const [specificIssue, setSpecificIssue] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || 'custom');
  const [customAddress, setCustomAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-27');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Suggested issues based on category
  const commonIssues: Record<string, string[]> = {
    electrician: ['Short circuit & tripping breaker', 'Ceiling fan install', 'EV Charger outlet', 'Light fixtures replacement'],
    plumber: ['Kitchen sink pipe leak', 'Blocked toilet drain', 'Water heater malfunction', 'Low water pressure'],
    'ac-repair': ['AC blowing warm air', 'Refrigerant leak & refilling', 'Noisy condenser unit', 'Thermostat replacement'],
    mechanic: ['Brake pad squeal & replacement', 'Engine battery dead', 'Check engine diagnostics', 'Alternator replacement'],
    cleaner: ['Deep apartment move-out clean', 'Post-renovation sanitization', 'Weekly standard cleaning'],
    carpenter: ['Door latch & hinge repair', 'Custom shelving installation', 'Cabinet alignment', 'Furniture repair']
  };

  const issuesList = commonIssues[pro.categorySlug] || [
    'Emergency diagnosis',
    'General inspection & repair',
    'New installation or assembly'
  ];

  const estimatedLaborHours = 2;
  const estimatedLabor = pro.hourlyRate * estimatedLaborHours;
  const totalEstimate = pro.visitFee + estimatedLabor;

  const handleSimulatePhotoUpload = () => {
    // Add sample job photo
    const samplePhotos = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
    ];
    setUploadedPhotos(prev => [...prev, samplePhotos[prev.length % samplePhotos.length]]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specificIssue) {
      alert('Please specify the issue or service needed.');
      return;
    }

    setIsSubmitting(true);

    const addressText = selectedAddressId === 'custom'
      ? customAddress || `${currentCustomer.selectedCity}, ${currentCountry.name}`
      : `${addresses.find(a => a.id === selectedAddressId)?.street}, ${addresses.find(a => a.id === selectedAddressId)?.city}`;

    const newBooking = createBooking({
      customerId: currentCustomer.id,
      customerName: currentCustomer.fullName,
      customerPhone: currentCustomer.phoneNumber,
      customerAddress: addressText,
      professionalId: pro.id,
      professionalName: pro.fullName,
      professionalCategory: pro.categoryName,
      professionalAvatar: pro.avatarUrl,
      professionalPhone: pro.phoneNumber,
      specificIssue,
      serviceDescription: description || `Standard service request for ${specificIssue}`,
      scheduledDate: selectedDate,
      scheduledTimeSlot: selectedTimeSlot,
      status: 'pending',
      estimatedCharges: {
        visitFee: pro.visitFee,
        laborEstimate: estimatedLabor,
        totalEstimate: totalEstimate,
        currency: currentCountry.currency
      },
      jobPhotos: uploadedPhotos
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback if confetti isn't supported
    }

    setConfirmedBooking(newBooking);
    setIsSubmitting(false);
  };

  // If booking is confirmed, show celebratory modal
  if (confirmedBooking) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">
            Booking Request Placed!
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-blue-600 text-sm">
                {confirmedBooking.referenceNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Professional:</span>
              <span className="font-bold text-slate-800">{confirmedBooking.professionalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-800">{confirmedBooking.specificIssue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled:</span>
              <span className="font-bold text-slate-800">{confirmedBooking.scheduledDate} ({confirmedBooking.scheduledTimeSlot})</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Estimated Total:</span>
              <span className="text-blue-600">{currentCountry.currencySymbol}{confirmedBooking.estimatedCharges.totalEstimate}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {pro.fullName} has received your request and will confirm availability shortly. You can track live status in "My Bookings".
          </p>

          <button
            onClick={() => {
              onSuccess(confirmedBooking.id);
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Request Service Booking
            </h2>
            <p className="text-xs text-slate-500">with {pro.fullName} ({pro.categoryName})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Quick Problem Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2">
              Select or Enter Specific Issue *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {issuesList.map((issue) => (
                <button
                  type="button"
                  key={issue}
                  onClick={() => setSpecificIssue(issue)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition-colors text-left ${
                    specificIssue === issue
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>

            <input
              type="text"
              required
              placeholder="Or type what you need fixed..."
              value={specificIssue}
              onChange={(e) => setSpecificIssue(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Service Address Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Service Address *</span>
              </label>
            </div>

            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedAddressId === addr.id
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="addressSelection"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 mr-2">{addr.label}</span>
                    <span className="text-slate-600">{addr.street}, {addr.city}</span>
                  </div>
                </label>
              ))}

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedAddressId === 'custom'
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="addressSelection"
                  checked={selectedAddressId === 'custom'}
                  onChange={() => setSelectedAddressId('custom')}
                  className="mt-0.5 accent-blue-600"
                />
                <div className="text-xs font-bold text-slate-900">
                  Different address in {pro.city}
                </div>
              </label>

              {selectedAddressId === 'custom' && (
                <input
                  type="text"
                  placeholder="Street address, apartment, city, zip code"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 mt-1"
                />
              )}
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Preferred Date *</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Time Window *</span>
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="08:00 AM - 10:00 AM">Morning: 08:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 12:00 PM">Morning: 10:00 AM - 12:00 PM</option>
                <option value="01:00 PM - 03:00 PM">Afternoon: 01:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 05:00 PM">Afternoon: 03:00 PM - 05:00 PM</option>
                <option value="05:00 PM - 07:00 PM">Evening: 05:00 PM - 07:00 PM</option>
              </select>
            </div>
          </div>

          {/* Job Description & Photos */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Job Details & Description</span>
            </label>
            <textarea
              rows={2}
              placeholder="Provide any details about brand, model, parking instructions, or urgency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulatePhotoUpload}
                className="px-3 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Attach Problem Photo</span>
              </button>

              {uploadedPhotos.map((p, idx) => (
                <div key={idx} className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 relative">
                  <img src={p} alt="Attached" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-900 pb-1 border-b border-slate-200/80">
              Estimated Price Breakdown
            </div>
            <div className="flex justify-between text-slate-600">
              <span>On-Site Visit & Diagnosis Fee</span>
              <span className="font-medium">{currentCountry.currencySymbol}{pro.visitFee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Est. Labor (~2 hours @ {currentCountry.currencySymbol}{pro.hourlyRate}/hr)</span>
              <span className="font-medium">{currentCountry.currencySymbol}{estimatedLabor}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
              <span>Estimated Total</span>
              <span className="text-blue-600">{currentCountry.currencySymbol}{totalEstimate}</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight pt-1">
              * Visit fee is guaranteed. Final labor and replacement parts are authorized by you before the pro begins work.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Request...</span>
            ) : (
              <>
                <span>Submit Booking Request</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
