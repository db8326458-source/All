-- ==============================================================================
-- HELP WORLD - GLOBAL LOCAL SERVICES MARKETPLACE
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'partner', 'admin');
CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending_review', 'approved', 'rejected');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled');
CREATE TYPE complaint_status AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- 3. SUPPORTED COUNTRIES & CITIES
CREATE TABLE IF NOT EXISTS public.supported_countries (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    phone_code VARCHAR(10) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) REFERENCES public.supported_countries(code) ON DELETE CASCADE,
    city_name VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_codes TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(country_code, city_name)
);

-- 4. SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT,
    starting_price NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROFILES (EXTENDS SUPABASE AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30),
    avatar_url TEXT,
    country_code VARCHAR(2) REFERENCES public.supported_countries(code),
    city VARCHAR(100),
    preferred_language VARCHAR(20) DEFAULT 'en',
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label VARCHAR(30) NOT NULL DEFAULT 'Home',
    street TEXT NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    postal_code VARCHAR(30) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROFESSIONAL PROFILES
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    headline VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    visit_fee NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    service_radius_km INT NOT NULL DEFAULT 25,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    completed_jobs_count INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    verification_status verification_status NOT NULL DEFAULT 'not_submitted',
    verification_notes TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_number VARCHAR(30),
    work_gallery TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROFESSIONAL SKILLS
CREATE TABLE IF NOT EXISTS public.professional_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(professional_id, skill_name)
);

-- 9. VERIFICATION DOCUMENTS
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'trade_license', 'national_id', 'insurance'
    document_number VARCHAR(100) NOT NULL,
    document_file_url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, verified, rejected
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id),
    service_description TEXT NOT NULL,
    specific_issue VARCHAR(255) NOT NULL,
    service_address TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time_slot VARCHAR(50) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    cancellation_reason TEXT,
    visit_fee NUMERIC(10, 2) NOT NULL,
    labor_estimate NUMERIC(10, 2) NOT NULL,
    total_estimate NUMERIC(10, 2) NOT NULL,
    final_visit_fee NUMERIC(10, 2),
    final_labor NUMERIC(10, 2),
    final_parts NUMERIC(10, 2),
    final_total NUMERIC(10, 2),
    completion_notes TEXT,
    completion_photo_url TEXT,
    job_photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BOOKING STATUS HISTORY (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    old_status booking_status,
    new_status booking_status NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    response_from_partner TEXT,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COMPLAINTS & DISPUTES
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status complaint_status NOT NULL DEFAULT 'open',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- booking, verification, system
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. MESSAGES & CHAT
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FEATURED LISTINGS
CREATE TABLE IF NOT EXISTS public.featured_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    position INT NOT NULL DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_pro_category ON public.professional_profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_pro_status ON public.professional_profiles(verification_status, is_available);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pro ON public.bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles: Anyone can view professional profiles; users edit own profile; admins view/edit all.
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin());

-- 2. Service Categories: Viewable by all; manageable only by admins
CREATE POLICY "Categories viewable by everyone"
ON public.service_categories FOR SELECT
TO authenticated, anon
USING (is_active = true OR public.is_admin());

CREATE POLICY "Categories manageable by admins"
ON public.service_categories FOR ALL
TO authenticated
USING (public.is_admin());

-- 3. Professional Profiles:
-- Customers see ONLY approved and non-suspended pros.
-- The professional sees their own profile even if pending.
-- Admins see all.
CREATE POLICY "Approved pros visible in customer searches"
ON public.professional_profiles FOR SELECT
TO authenticated, anon
USING (
    (verification_status = 'approved' AND is_suspended = false) 
    OR id = auth.uid() 
    OR public.is_admin()
);

CREATE POLICY "Partners can update own professional profile"
ON public.professional_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    -- Prevent partner from modifying their own verification_status!
    AND verification_status = (SELECT verification_status FROM public.professional_profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can manage any professional profile"
ON public.professional_profiles FOR ALL
TO authenticated
USING (public.is_admin());

-- 4. Verification Documents:
-- Only the professional themselves or an admin can access.
CREATE POLICY "Partners can manage their own verification documents"
ON public.verification_documents FOR ALL
TO authenticated
USING (professional_id = auth.uid() OR public.is_admin());

-- 5. Bookings:
-- Only customer, assigned professional, or admin can access.
CREATE POLICY "Parties can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
    customer_id = auth.uid() 
    OR professional_id = auth.uid() 
    OR public.is_admin()
);

CREATE POLICY "Customers can create bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Assigned parties can update booking status"
ON public.bookings FOR UPDATE
TO authenticated
USING (
    customer_id = auth.uid() 
    OR professional_id = auth.uid() 
    OR public.is_admin()
);

-- 6. Reviews:
-- Viewable by all; Insertable only by the customer who completed that booking
CREATE POLICY "Reviews viewable by everyone"
ON public.reviews FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Customers can write review for completed bookings"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (
    customer_id = auth.uid() 
    AND EXISTS (
        SELECT 1 FROM public.bookings 
        WHERE id = booking_id AND customer_id = auth.uid() AND status = 'completed'
    )
);

-- 7. Messages:
-- Only conversation participants can view and send messages
CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = conversation_id 
        AND (c.customer_id = auth.uid() OR c.professional_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Participants can insert messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = conversation_id 
        AND (c.customer_id = auth.uid() OR c.professional_id = auth.uid())
    )
);
