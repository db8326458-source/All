-- ==============================================================================
-- HELP WORLD - SUPABASE STORAGE CONFIGURATION & BUCKET POLICIES
-- ==============================================================================

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('verification_documents', 'verification_documents', false),
    ('profile_photos', 'profile_photos', true),
    ('job_photos', 'job_photos', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for verification_documents (Private & Protected)
-- Partners can upload their own verification documents
CREATE POLICY "Partners can upload verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'verification_documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Partners can view their own documents, Admins can view all documents
CREATE POLICY "Partners and Admins can view verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'verification_documents'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
);

-- 3. Storage Policies for profile_photos (Public readable)
CREATE POLICY "Public profile photos are viewable by all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile_photos');

CREATE POLICY "Users can upload their own profile photo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile_photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Storage Policies for job_photos (Related to bookings)
CREATE POLICY "Booking participants can upload job photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'job_photos'
);

CREATE POLICY "Booking participants can view job photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'job_photos'
);
