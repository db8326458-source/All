export type UserRole = 'customer' | 'partner' | 'admin';

export type ActiveProduct = 'customer' | 'partner' | 'admin' | 'apk_guide' | 'database_schema';

export type VerificationStatus = 'not_submitted' | 'pending_review' | 'approved' | 'rejected';

export type BookingStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface SupportedCountry {
  code: string; // US, UK, CA, AU, AE, DE, IN
  name: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  flag: string;
  cities: string[];
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  description: string;
  startingPrice: number;
  currency: string;
  isPopular: boolean;
  active: boolean;
}

export interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  selectedCountry: string;
  selectedCity: string;
  preferredLanguage: string;
  preferredCurrency: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  apartment?: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface VerificationDocument {
  id: string;
  partnerId: string;
  documentType: 'national_id' | 'trade_license' | 'insurance_policy' | 'address_proof';
  documentNumber: string;
  documentUrl: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface ProfessionalProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  categorySlug: string;
  categoryName: string;
  headline: string;
  bio: string;
  experienceYears: number;
  hourlyRate: number;
  visitFee: number;
  currency: string;
  currencySymbol: string;
  country: string;
  city: string;
  serviceRadiusKm: number;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  isAvailable: boolean; // toggle online/offline
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  isFeatured: boolean;
  isSuspended: boolean;
  skills: string[];
  workGallery: string[];
  whatsappNumber: string;
  documents: VerificationDocument[];
  createdAt: string;
}

export interface Booking {
  id: string;
  referenceNumber: string; // e.g. HW-892401
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  professionalId: string;
  professionalName: string;
  professionalCategory: string;
  professionalAvatar: string;
  professionalPhone: string;
  serviceDescription: string;
  specificIssue: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string; // e.g. "10:00 AM - 12:00 PM"
  status: BookingStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  estimatedCharges: {
    visitFee: number;
    laborEstimate: number;
    totalEstimate: number;
    currency: string;
  };
  finalCharges?: {
    visitFee: number;
    labor: number;
    parts: number;
    total: number;
  };
  completionNotes?: string;
  completionPhoto?: string;
  jobPhotos?: string[];
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: BookingStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface Review {
  id: string;
  bookingId: string;
  professionalId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  responseFromPartner?: string;
  createdAt: string;
  isModerated?: boolean;
}

export interface Complaint {
  id: string;
  bookingId: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  professionalId: string;
  professionalName: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: 'customer' | 'partner';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'verification' | 'system' | 'message';
  bookingId?: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetType: 'partner' | 'customer' | 'booking' | 'category' | 'complaint';
  targetId: string;
  details: string;
  timestamp: string;
}
