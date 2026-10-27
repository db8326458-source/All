import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerBottomNav, CustomerTab } from './CustomerBottomNav';
import { CustomerHome } from './CustomerHome';
import { ProSearch } from './ProSearch';
import { MyBookings } from './MyBookings';
import { CustomerProfile } from './CustomerProfile';
import { CustomerSplash, CustomerOnboarding } from './CustomerSplash';
import { ProDetail } from './ProDetail';
import { BookingModal } from './BookingModal';
import { BookingDetailModal } from './BookingDetailModal';
import { CustomerChatModal } from './CustomerChatModal';
import { WriteReviewModal } from './WriteReviewModal';
import { ComplaintModal } from './ComplaintModal';
import { ProfessionalProfile, Booking } from '../../types';

export const CustomerApp: React.FC = () => {
  const { bookings } = useApp();

  // App flow states
  const [showSplash, setShowSplash] = useState(false); // set false by default for instant interactivity, but user can re-trigger
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');

  // Modals & Sub-screens
  const [selectedPro, setSelectedPro] = useState<ProfessionalProfile | null>(null);
  const [bookingPro, setBookingPro] = useState<ProfessionalProfile | null>(null);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);
  const [prefilteredCategory, setPrefilteredCategory] = useState<string>('all');

  if (showSplash) {
    return <CustomerSplash onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <CustomerOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      
      {/* Main Content by Tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <CustomerHome
            onSelectCategory={(slug) => {
              setPrefilteredCategory(slug);
              setActiveTab('search');
            }}
            onSelectPro={(pro) => setSelectedPro(pro)}
            onOpenSearch={() => {
              setPrefilteredCategory('all');
              setActiveTab('search');
            }}
            onViewBooking={(id) => {
              const b = bookings.find(item => item.id === id);
              if (b) setSelectedBookingDetail(b);
            }}
          />
        )}

        {activeTab === 'search' && (
          <ProSearch
            initialCategorySlug={prefilteredCategory}
            onSelectPro={(pro) => setSelectedPro(pro)}
          />
        )}

        {activeTab === 'bookings' && (
          <MyBookings
            onSelectBooking={(b) => setSelectedBookingDetail(b)}
            onOpenChat={(b) => setChatBooking(b)}
            onWriteReview={(b) => setReviewBooking(b)}
            onFileComplaint={(b) => setComplaintBooking(b)}
          />
        )}

        {activeTab === 'profile' && <CustomerProfile />}
      </div>

      {/* Android Bottom Navigation */}
      <CustomerBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Professional Profile Detail Modal */}
      {selectedPro && (
        <ProDetail
          pro={selectedPro}
          onClose={() => setSelectedPro(null)}
          onBook={() => {
            setBookingPro(selectedPro);
            setSelectedPro(null);
          }}
        />
      )}

      {/* Booking Flow Modal */}
      {bookingPro && (
        <BookingModal
          pro={bookingPro}
          onClose={() => setBookingPro(null)}
          onSuccess={() => {
            setBookingPro(null);
            setActiveTab('bookings');
          }}
        />
      )}

      {/* Booking Details & Timeline Modal */}
      {selectedBookingDetail && (
        <BookingDetailModal
          booking={selectedBookingDetail}
          onClose={() => setSelectedBookingDetail(null)}
          onOpenChat={() => {
            setChatBooking(selectedBookingDetail);
            setSelectedBookingDetail(null);
          }}
          onFileComplaint={() => {
            setComplaintBooking(selectedBookingDetail);
            setSelectedBookingDetail(null);
          }}
        />
      )}

      {/* Chat Modal */}
      {chatBooking && (
        <CustomerChatModal
          booking={chatBooking}
          currentRole="customer"
          onClose={() => setChatBooking(null)}
        />
      )}

      {/* Write Review Modal */}
      {reviewBooking && (
        <WriteReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => setReviewBooking(null)}
        />
      )}

      {/* Complaint Modal */}
      {complaintBooking && (
        <ComplaintModal
          booking={complaintBooking}
          onClose={() => setComplaintBooking(null)}
          onSuccess={() => setComplaintBooking(null)}
        />
      )}

    </div>
  );
};
