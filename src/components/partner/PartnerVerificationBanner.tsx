import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  AlertCircle, 
  XCircle, 
  UploadCloud, 
  FileCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ProfessionalProfile } from '../../types';

interface VerificationBannerProps {
  partner: ProfessionalProfile;
}

export const PartnerVerificationBanner: React.FC<VerificationBannerProps> = ({ partner }) => {
  const { submitPartnerVerification } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docType, setDocType] = useState('trade_license');
  const [docNumber, setDocNumber] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) return;

    submitPartnerVerification(
      partner.id,
      docType,
      docNumber,
      docUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
    );
    setShowUploadModal(false);
    setDocNumber('');
  };

  if (partner.verificationStatus === 'approved') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
              <span>Account Verified & Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-emerald-800 text-[11px]">
              You appear in customer searches in {partner.city}.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
          Tier 1 Verified
        </span>
      </div>
    );
  }

  if (partner.verificationStatus === 'pending_review') {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-amber-950">
              Verification In Review (Admin Queue)
            </div>
            <p className="text-amber-900 text-[11px]">
              Your documents are being checked by the Help World trust team. You will be notified once approved.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-1 rounded-md border border-amber-200 shadow-2xs">
          Pending
        </span>
      </div>
    );
  }

  if (partner.verificationStatus === 'rejected') {
    return (
      <>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-rose-950">
                  Verification Application Rejected
                </div>
                <p className="text-rose-800 text-[11px]">
                  Reason: {partner.verificationNotes || 'Expired or illegible document.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-sm"
            >
              Re-submit
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && renderUploadModal()}
      </>
    );
  }

  // Not Submitted
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-blue-950 text-sm">
              Complete Professional Verification
            </div>
            <p className="text-blue-800 text-xs">
              Upload your trade license or government ID to start receiving customer bookings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
        >
          <span>Submit Documents</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showUploadModal && renderUploadModal()}
    </>
  );

  function renderUploadModal() {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Submit Verification</h3>
            </div>
            <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Document Type *</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="trade_license">State / National Trade License</option>
                <option value="national_id">Government Photo ID / Passport</option>
                <option value="insurance_policy">General Liability Insurance</option>
                <option value="address_proof">Utility Bill / Address Proof</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Document / License Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. LIC-NY-99214-ELEC"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Document Image URL (or use simulated file)</label>
              <input
                type="text"
                placeholder="https://... (Leave blank for official certificate scan)"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
              Note: Help World administrators securely review licenses against municipal registries. Self-approval is strictly forbidden.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-xs shadow-md shadow-blue-600/30"
              >
                Submit for Admin Review
              </button>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
