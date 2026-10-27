import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActiveProduct, 
  ProfessionalProfile, 
  Booking, 
  Review, 
  Complaint, 
  ServiceCategory, 
  SupportedCountry, 
  CustomerProfile,
  CustomerAddress,
  AdminAuditLog,
  NotificationItem,
  BookingStatus,
  ChatMessage,
  VerificationStatus
} from '../types';
import { 
  SUPPORTED_COUNTRIES, 
  SERVICE_CATEGORIES, 
  INITIAL_PROFESSIONALS, 
  INITIAL_BOOKINGS, 
  INITIAL_REVIEWS, 
  INITIAL_CUSTOMERS,
  INITIAL_ADDRESSES,
  INITIAL_ADMIN_LOGS 
} from '../lib/mockData';

interface AppContextType {
  // Navigation & Product Mode
  activeProduct: ActiveProduct;
  setActiveProduct: (prod: ActiveProduct) => void;
  viewMode: 'responsive' | 'mobile_frame';
  setViewMode: (mode: 'responsive' | 'mobile_frame') => void;
  
  // Location
  currentCountry: SupportedCountry;
  setCurrentCountry: (c: SupportedCountry) => void;
  currentCity: string;
  setCurrentCity: (city: string) => void;
  
  // Data
  categories: ServiceCategory[];
  professionals: ProfessionalProfile[];
  bookings: Booking[];
  reviews: Review[];
  complaints: Complaint[];
  addresses: CustomerAddress[];
  notifications: NotificationItem[];
  auditLogs: AdminAuditLog[];
  
  // Active Accounts
  currentCustomer: CustomerProfile;
  setCurrentCustomer: (c: CustomerProfile) => void;
  currentPartner: ProfessionalProfile;
  setCurrentPartner: (p: ProfessionalProfile) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  
  // Actions: Booking Lifecycle
  createBooking: (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'timeline'>) => Booking;
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus, note?: string, extras?: { rejectionReason?: string; cancellationReason?: string; finalCharges?: Booking['finalCharges']; completionNotes?: string }) => void;
  
  // Actions: Partner Operations
  registerPartner: (partnerData: Partial<ProfessionalProfile>) => ProfessionalProfile;
  updatePartnerProfile: (partnerId: string, updates: Partial<ProfessionalProfile>) => void;
  togglePartnerAvailability: (partnerId: string) => void;
  submitPartnerVerification: (partnerId: string, docType: string, docNumber: string, docUrl: string) => void;
  
  // Actions: Customer Operations
  addCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  submitReview: (bookingId: string, rating: number, comment: string, tags?: string[]) => void;
  submitComplaint: (bookingId: string, title: string, description: string) => void;
  
  // Actions: Admin Operations
  adminReviewPartner: (partnerId: string, approve: boolean, notes: string) => void;
  adminToggleSuspendUser: (userId: string, role: 'partner' | 'customer', isSuspended: boolean) => void;
  adminResolveComplaint: (complaintId: string, resolutionNotes: string) => void;
  adminToggleCategory: (categoryId: string, active: boolean) => void;
  adminAddCategory: (category: Omit<ServiceCategory, 'id'>) => void;
  
  // Chat
  messages: ChatMessage[];
  sendMessage: (bookingId: string, senderRole: 'customer' | 'partner', senderId: string, senderName: string, text: string) => void;
  
  // Reset demo data
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PROS = 'hw_pros_v1';
const STORAGE_KEY_BOOKINGS = 'hw_bookings_v1';
const STORAGE_KEY_REVIEWS = 'hw_reviews_v1';
const STORAGE_KEY_CATEGORIES = 'hw_categories_v1';
const STORAGE_KEY_LOGS = 'hw_audit_logs_v1';
const STORAGE_KEY_COMPLAINTS = 'hw_complaints_v1';
const STORAGE_KEY_MESSAGES = 'hw_messages_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Frame
  const [activeProduct, setActiveProduct] = useState<ActiveProduct>('customer');
  const [viewMode, setViewMode] = useState<'responsive' | 'mobile_frame'>('responsive');

  // Location
  const [currentCountry, setCurrentCountry] = useState<SupportedCountry>(SUPPORTED_COUNTRIES[0]);
  const [currentCity, setCurrentCity] = useState<string>(SUPPORTED_COUNTRIES[0].cities[0]);

  // Data states with localStorage persistence
  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    return saved ? JSON.parse(saved) : SERVICE_CATEGORIES;
  });

  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROS);
    return saved ? JSON.parse(saved) : INITIAL_PROFESSIONALS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LOGS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        bookingId: 'book-1',
        senderId: 'pro-1',
        senderRole: 'partner',
        senderName: 'Marcus Vance',
        text: 'Hello Elena! I have accepted your booking. I will bring extra 20A tandem breakers just in case. See you tomorrow at 10 AM.',
        timestamp: '2026-10-25T15:15:00Z',
        read: true
      },
      {
        id: 'msg-2',
        bookingId: 'book-1',
        senderId: 'cust-1',
        senderRole: 'customer',
        senderName: 'Elena Rostova',
        text: 'Thank you Marcus! The breaker box is in the basement right near the laundry room door.',
        timestamp: '2026-10-25T15:20:00Z',
        read: true
      }
    ];
  });

  const [addresses, setAddresses] = useState<CustomerAddress[]>(INITIAL_ADDRESSES);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerProfile>(INITIAL_CUSTOMERS[0]);
  const [currentPartner, setCurrentPartner] = useState<ProfessionalProfile>(professionals[0] || INITIAL_PROFESSIONALS[0]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      recipientId: 'cust-1',
      recipientRole: 'customer',
      title: 'Booking Confirmed',
      message: 'Marcus Vance has accepted your electrical booking HW-849201 for Oct 27.',
      timestamp: '2026-10-25T15:10:00Z',
      read: false,
      type: 'booking',
      bookingId: 'book-1'
    },
    {
      id: 'notif-2',
      recipientId: 'pro-1',
      recipientRole: 'partner',
      title: 'New Service Request',
      message: 'Elena Rostova requested an electrical inspection in New York.',
      timestamp: '2026-10-25T14:30:00Z',
      read: true,
      type: 'booking',
      bookingId: 'book-1'
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROS, JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Booking actions
  const createBooking = (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Booking => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const refNum = `HW-${randomDigits}`;
    const nowIso = new Date().toISOString();
    
    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      referenceNumber: refNum,
      status: 'pending',
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          status: 'pending',
          timestamp: nowIso,
          note: 'Booking request placed by customer'
        }
      ]
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send notifications to pro and customer
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}-1`,
        recipientId: bookingData.professionalId,
        recipientRole: 'partner',
        title: 'New Booking Request',
        message: `${bookingData.customerName} requested ${bookingData.specificIssue}.`,
        timestamp: nowIso,
        read: false,
        type: 'booking',
        bookingId: newBooking.id
      },
      {
        id: `notif-${Date.now()}-2`,
        recipientId: bookingData.customerId,
        recipientRole: 'customer',
        title: 'Booking Sent',
        message: `Your booking request ${refNum} was sent to ${bookingData.professionalName}.`,
        timestamp: nowIso,
        read: false,
        type: 'booking',
        bookingId: newBooking.id
      },
      ...prev
    ]);

    return newBooking;
  };

  const updateBookingStatus = (
    bookingId: string, 
    newStatus: BookingStatus, 
    note?: string,
    extras?: { 
      rejectionReason?: string; 
      cancellationReason?: string; 
      finalCharges?: Booking['finalCharges']; 
      completionNotes?: string;
    }
  ) => {
    const nowIso = new Date().toISOString();

    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;

      const newTimeline = [
        ...b.timeline,
        {
          status: newStatus,
          timestamp: nowIso,
          note: note || `Status changed to ${newStatus.replace('_', ' ')}`
        }
      ];

      return {
        ...b,
        status: newStatus,
        updatedAt: nowIso,
        rejectionReason: extras?.rejectionReason || b.rejectionReason,
        cancellationReason: extras?.cancellationReason || b.cancellationReason,
        finalCharges: extras?.finalCharges || b.finalCharges,
        completionNotes: extras?.completionNotes || b.completionNotes,
        timeline: newTimeline
      };
    }));

    // If completed, increment professional completed jobs count
    if (newStatus === 'completed') {
      const target = bookings.find(b => b.id === bookingId);
      if (target) {
        setProfessionals(prev => prev.map(p => {
          if (p.id === target.professionalId) {
            return { ...p, completedJobsCount: p.completedJobsCount + 1 };
          }
          return p;
        }));
      }
    }
  };

  // Partner actions
  const registerPartner = (partnerData: Partial<ProfessionalProfile>): ProfessionalProfile => {
    const newId = `pro-${Date.now()}`;
    const newPro: ProfessionalProfile = {
      id: newId,
      email: partnerData.email || 'partner@example.com',
      fullName: partnerData.fullName || 'New Service Professional',
      phoneNumber: partnerData.phoneNumber || '+1 555-0100',
      avatarUrl: partnerData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      categorySlug: partnerData.categorySlug || 'electrician',
      categoryName: partnerData.categoryName || 'Electrician',
      headline: partnerData.headline || 'Certified Service Professional',
      bio: partnerData.bio || 'Experienced technician dedicated to top quality work.',
      experienceYears: partnerData.experienceYears || 3,
      hourlyRate: partnerData.hourlyRate || 50,
      visitFee: partnerData.visitFee || 25,
      currency: currentCountry.currency,
      currencySymbol: currentCountry.currencySymbol,
      country: currentCountry.code,
      city: currentCity,
      serviceRadiusKm: partnerData.serviceRadiusKm || 20,
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      isAvailable: true,
      verificationStatus: 'not_submitted', // Must submit docs & be approved by admin
      isFeatured: false,
      isSuspended: false,
      skills: partnerData.skills || ['General Service'],
      workGallery: [],
      whatsappNumber: partnerData.phoneNumber?.replace(/[^0-9+]/g, '') || '',
      documents: [],
      createdAt: new Date().toISOString()
    };

    setProfessionals(prev => [newPro, ...prev]);
    setCurrentPartner(newPro);
    return newPro;
  };

  const updatePartnerProfile = (partnerId: string, updates: Partial<ProfessionalProfile>) => {
    // Security check: partner cannot self-approve verificationStatus
    const sanitized = { ...updates };
    delete sanitized.verificationStatus;
    delete sanitized.isSuspended;

    setProfessionals(prev => prev.map(p => {
      if (p.id === partnerId) {
        const updated = { ...p, ...sanitized };
        if (currentPartner.id === partnerId) {
          setCurrentPartner(updated);
        }
        return updated;
      }
      return p;
    }));
  };

  const togglePartnerAvailability = (partnerId: string) => {
    setProfessionals(prev => prev.map(p => {
      if (p.id === partnerId) {
        const next = !p.isAvailable;
        const updated = { ...p, isAvailable: next };
        if (currentPartner.id === partnerId) {
          setCurrentPartner(updated);
        }
        return updated;
      }
      return p;
    }));
  };

  const submitPartnerVerification = (partnerId: string, docType: string, docNumber: string, docUrl: string) => {
    const docId = `doc-${Date.now()}`;
    const newDoc = {
      id: docId,
      partnerId,
      documentType: docType as any,
      documentNumber: docNumber,
      documentUrl: docUrl,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const
    };

    setProfessionals(prev => prev.map(p => {
      if (p.id === partnerId) {
        const updatedDocs = [...(p.documents || []), newDoc];
        const updated: ProfessionalProfile = {
          ...p,
          verificationStatus: 'pending_review',
          verificationNotes: 'Verification documents submitted and under admin review.',
          documents: updatedDocs
        };
        if (currentPartner.id === partnerId) {
          setCurrentPartner(updated);
        }
        return updated;
      }
      return p;
    }));

    // Notification to admin
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        adminEmail: 'system',
        action: 'VERIFICATION_SUBMITTED',
        targetType: 'partner',
        targetId: partnerId,
        details: `Partner submitted document ${docType} (${docNumber}) for review.`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Customer actions
  const addCustomerAddress = (address: Omit<CustomerAddress, 'id'>) => {
    const newAddr: CustomerAddress = {
      ...address,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => [newAddr, ...prev]);
  };

  const submitReview = (bookingId: string, rating: number, comment: string, tags?: string[]) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      bookingId,
      professionalId: booking.professionalId,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerAvatar: currentCustomer.avatarUrl,
      rating,
      comment,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      isModerated: true
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate partner rating
    setProfessionals(prev => prev.map(p => {
      if (p.id === booking.professionalId) {
        const total = (p.rating * p.reviewCount) + rating;
        const newCount = p.reviewCount + 1;
        const newAvg = Number((total / newCount).toFixed(2));
        return { ...p, rating: newAvg, reviewCount: newCount };
      }
      return p;
    }));
  };

  const submitComplaint = (bookingId: string, title: string, description: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      bookingId,
      bookingRef: booking.referenceNumber,
      customerId: booking.customerId,
      customerName: booking.customerName,
      professionalId: booking.professionalId,
      professionalName: booking.professionalName,
      title,
      description,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setComplaints(prev => [newComplaint, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        adminEmail: 'system',
        action: 'COMPLAINT_FILED',
        targetType: 'complaint',
        targetId: newComplaint.id,
        details: `Customer ${booking.customerName} filed complaint regarding booking ${booking.referenceNumber}: "${title}"`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Admin actions
  const adminReviewPartner = (partnerId: string, approve: boolean, notes: string) => {
    const status: VerificationStatus = approve ? 'approved' : 'rejected';
    
    setProfessionals(prev => prev.map(p => {
      if (p.id === partnerId) {
        const updated = {
          ...p,
          verificationStatus: status,
          verificationNotes: notes,
          isAvailable: approve ? true : p.isAvailable
        };
        if (currentPartner.id === partnerId) {
          setCurrentPartner(updated);
        }
        return updated;
      }
      return p;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        adminEmail: 'admin@helpworld.com',
        action: approve ? 'APPROVED_PARTNER' : 'REJECTED_PARTNER',
        targetType: 'partner',
        targetId: partnerId,
        details: `Status set to ${status}. Notes: ${notes}`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const adminToggleSuspendUser = (userId: string, role: 'partner' | 'customer', isSuspended: boolean) => {
    if (role === 'partner') {
      setProfessionals(prev => prev.map(p => p.id === userId ? { ...p, isSuspended } : p));
    }
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        adminEmail: 'admin@helpworld.com',
        action: isSuspended ? 'SUSPENDED_USER' : 'REACTIVATED_USER',
        targetType: role,
        targetId: userId,
        details: `${role} account ${isSuspended ? 'suspended' : 'reactivated'}.`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const adminResolveComplaint = (complaintId: string, resolutionNotes: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'resolved',
          resolutionNotes,
          resolvedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        adminEmail: 'admin@helpworld.com',
        action: 'RESOLVED_COMPLAINT',
        targetType: 'complaint',
        targetId: complaintId,
        details: `Resolution note: ${resolutionNotes}`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const adminToggleCategory = (categoryId: string, active: boolean) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, active } : c));
  };

  const adminAddCategory = (category: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...category,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  // Chat
  const sendMessage = (bookingId: string, senderRole: 'customer' | 'partner', senderId: string, senderName: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId,
      senderRole,
      senderName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY_PROS);
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    localStorage.removeItem(STORAGE_KEY_REVIEWS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    setProfessionals(INITIAL_PROFESSIONALS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setCategories(SERVICE_CATEGORIES);
    setAuditLogs(INITIAL_ADMIN_LOGS);
    setComplaints([]);
    setCurrentPartner(INITIAL_PROFESSIONALS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        activeProduct,
        setActiveProduct,
        viewMode,
        setViewMode,
        currentCountry,
        setCurrentCountry,
        currentCity,
        setCurrentCity,
        categories,
        professionals,
        bookings,
        reviews,
        complaints,
        addresses,
        notifications,
        auditLogs,
        currentCustomer,
        setCurrentCustomer,
        currentPartner,
        setCurrentPartner,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        createBooking,
        updateBookingStatus,
        registerPartner,
        updatePartnerProfile,
        togglePartnerAvailability,
        submitPartnerVerification,
        addCustomerAddress,
        submitReview,
        submitComplaint,
        adminReviewPartner,
        adminToggleSuspendUser,
        adminResolveComplaint,
        adminToggleCategory,
        adminAddCategory,
        messages,
        sendMessage,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
