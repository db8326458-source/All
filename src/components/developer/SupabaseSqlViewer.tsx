import React, { useState } from 'react';
import { Database, Copy, Check, ShieldCheck, CheckCircle2, AlertCircle, Key, Server } from 'lucide-react';
import { getSupabaseStatus } from '../../lib/supabase';

export const SupabaseSqlViewer: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSqlTab, setActiveSqlTab] = useState<'schema' | 'storage'>('schema');
  const status = getSupabaseStatus();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const schemaPreview = `-- ==============================================================================
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

-- 3. TABLES: 17 Structured Relational Tables
-- supported_countries, service_areas, service_categories, profiles, customer_addresses,
-- professional_profiles, professional_skills, verification_documents, bookings,
-- booking_status_history, reviews, complaints, notifications, conversations,
-- messages, featured_listings, admin_audit_logs...

-- 4. ROW LEVEL SECURITY (RLS) ENFORCEMENT:
-- Only approved pros visible to customers:
CREATE POLICY "Approved pros visible in customer searches"
ON public.professional_profiles FOR SELECT
TO authenticated, anon
USING ((verification_status = 'approved' AND is_suspended = false) OR id = auth.uid() OR public.is_admin());

-- Partner cannot self-approve verification_status:
CREATE POLICY "Partners can update own professional profile"
ON public.professional_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    AND verification_status = (SELECT verification_status FROM public.professional_profiles WHERE id = auth.uid())
);

-- Bookings restricted strictly to customer, assigned pro, or admin:
CREATE POLICY "Parties can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (customer_id = auth.uid() OR professional_id = auth.uid() OR public.is_admin());
`;

  const storagePreview = `-- ==============================================================================
-- HELP WORLD - SUPABASE STORAGE BUCKETS & POLICIES
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('verification_documents', 'verification_documents', false),
    ('profile_photos', 'profile_photos', true),
    ('job_photos', 'job_photos', false)
ON CONFLICT (id) DO NOTHING;

-- Verification docs private to partner & admin
CREATE POLICY "Partners and Admins can view verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'verification_documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
`;

  return (
    <div className="space-y-6 pb-16 px-4 pt-4 max-w-4xl mx-auto text-xs text-slate-800">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[11px]">
          <Database className="w-4 h-4 text-blue-400" />
          <span>PostgreSQL & Supabase Architecture</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Production Database & Security Rules
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Help World is engineered to use PostgreSQL on Supabase with strict Row Level Security (RLS) policies. While developing in the browser, an in-memory reactive engine mirrors every table and state change. When you connect your live Supabase project, all data seamlessly syncs.
        </p>

        {/* Live Status indicator */}
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white text-xs">
                {status.isConfigured ? 'Connected to Live Supabase Project' : 'Running in Local Reactive Mode'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {status.url}
              </div>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            status.isConfigured ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {status.isConfigured ? 'Live Backend Active' : 'Zero-Config Local Mode'}
          </span>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSqlTab('schema')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                activeSqlTab === 'schema'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              schema.sql (17 Tables & RLS)
            </button>
            <button
              onClick={() => setActiveSqlTab('storage')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                activeSqlTab === 'storage'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              storage.sql (Buckets & Policies)
            </button>
          </div>

          <button
            onClick={() => handleCopy(activeSqlTab === 'schema' ? schemaPreview : storagePreview, activeSqlTab)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            {copied === activeSqlTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === activeSqlTab ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96 shadow-inner">
            {activeSqlTab === 'schema' ? schemaPreview : storagePreview}
          </pre>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Key Security Protections Enforced by This Schema</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Self-Approval Prevention:</strong> Partner update policies forbid updating their own <code className="bg-white px-1 rounded text-slate-800">verification_status</code> or approval state.</li>
            <li><strong>Strict Privacy:</strong> Customer addresses and phone numbers are hidden from public queries; only shared with the assigned technician upon booking acceptance.</li>
            <li><strong>Audit Logging:</strong> All administrative approvals, account suspensions, and category edits are written to an immutable audit table.</li>
            <li><strong>Review Authenticity:</strong> Customer reviews can only be submitted if an eligible booking has been marked completed in the database.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
