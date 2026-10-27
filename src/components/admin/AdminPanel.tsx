import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  CalendarCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Lock, 
  Search, 
  Sliders, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserCheck,
  UserX,
  ExternalLink,
  Plus
} from 'lucide-react';
import { VerificationStatus, ServiceCategory } from '../../types';
import { StatusBadge } from '../common/Badge';

export const AdminPanel: React.FC = () => {
  const { 
    professionals, 
    bookings, 
    complaints, 
    categories, 
    auditLogs, 
    adminReviewPartner, 
    adminToggleSuspendUser, 
    adminResolveComplaint,
    adminToggleCategory,
    adminAddCategory,
    currentCountry
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'verifications' | 'partners' | 'customers' | 'complaints' | 'categories' | 'logs'>('dashboard');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [reviewModalPartnerId, setReviewModalPartnerId] = useState<string | null>(null);
  const [reviewDecision, setReviewDecision] = useState<boolean>(true);
  const [reviewNotes, setReviewNotes] = useState<string>('');

  // Complaint resolution modal
  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<string>('');

  // New category modal
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatPrice, setNewCatPrice] = useState(50);
  const [newCatDesc, setNewCatDesc] = useState('');

  // Dashboard Aggregates
  const totalPros = professionals.length;
  const approvedPros = professionals.filter(p => p.verificationStatus === 'approved').length;
  const pendingPros = professionals.filter(p => p.verificationStatus === 'pending_review');
  const rejectedPros = professionals.filter(p => p.verificationStatus === 'rejected').length;

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const openComplaints = complaints.filter(c => c.status === 'open');

  const totalGMV = bookings.reduce((sum, b) => {
    return sum + (b.finalCharges?.total || b.estimatedCharges.totalEstimate);
  }, 4850);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalPartnerId) return;

    adminReviewPartner(reviewModalPartnerId, reviewDecision, reviewNotes || (reviewDecision ? 'Verified trade license valid and in good standing.' : 'Documentation does not meet platform requirements.'));
    setReviewModalPartnerId(null);
    setReviewNotes('');
  };

  const handleComplaintResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaintId) return;

    adminResolveComplaint(resolvingComplaintId, resolutionText || 'Issue investigated and resolved by operations admin.');
    setResolvingComplaintId(null);
    setResolutionText('');
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;

    adminAddCategory({
      name: newCatName,
      slug: newCatSlug.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Wrench',
      description: newCatDesc,
      startingPrice: newCatPrice,
      currency: '$',
      isPopular: false,
      active: true
    });

    setShowAddCatModal(false);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Admin Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md">
            HW
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              HELP WORLD • OPERATIONS CONSOLE
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
                Super Admin
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Database connected • Row Level Security Enforced</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold hidden sm:inline">admin@helpworld.com</span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/70 border-b border-slate-800 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 py-2 text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Metrics & Overview', count: undefined },
            { id: 'verifications', label: 'Verification Queue', count: pendingPros.length, alert: pendingPros.length > 0 },
            { id: 'partners', label: 'Service Partners', count: totalPros },
            { id: 'complaints', label: 'Disputes & Complaints', count: openComplaints.length, alert: openComplaints.length > 0 },
            { id: 'categories', label: 'Service Categories', count: categories.length },
            { id: 'logs', label: 'Audit Trail', count: auditLogs.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab.alert ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 text-xs">

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Gross Marketplace GMV</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  ${totalGMV.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                  100% Escrow Protected
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Pending Verifications</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {pendingPros.length}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold mt-1">
                  Requires Admin Approval
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Total Bookings</span>
                  <CalendarCheck2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {totalBookings}
                </div>
                <div className="text-[10px] text-blue-300 font-semibold mt-1">
                  {completedBookings} completed • {cancelledBookings} cancelled
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Open Disputes</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-rose-400">
                  {openComplaints.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Customer trust queue
                </div>
              </div>
            </div>

            {/* Quick Action Queue Banners */}
            {pendingPros.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {pendingPros.length} Professional Application{pendingPros.length > 1 ? 's' : ''} Awaiting Review
                    </h3>
                    <p className="text-amber-200/80 text-[11px]">
                      Technicians cannot appear in customer search until their trade license is approved.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('verifications')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Review Applications
                </button>
              </div>
            )}

            {/* Recent Global Platform Bookings */}
            <div className="bg-slate-800/60 rounded-3xl p-5 border border-slate-700/60 space-y-3">
              <h2 className="font-extrabold text-white text-sm">Recent Marketplace Bookings</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="pb-2">Reference</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Professional</th>
                      <th className="pb-2">Service</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono text-blue-400 font-bold">{b.referenceNumber}</td>
                        <td className="py-2.5 text-slate-200">{b.customerName}</td>
                        <td className="py-2.5 text-slate-200">{b.professionalName}</td>
                        <td className="py-2.5 text-slate-400">{b.specificIssue}</td>
                        <td className="py-2.5 font-bold text-white">${b.finalCharges?.total || b.estimatedCharges.totalEstimate}</td>
                        <td className="py-2.5"><StatusBadge status={b.status} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. VERIFICATION QUEUE */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Partner Verification Queue</h2>
              <p className="text-slate-400 text-xs">Verify trade licenses, government IDs, and ensure safety standards before activating accounts.</p>
            </div>

            <div className="space-y-3">
              {pendingPros.map((pro) => (
                <div key={pro.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={pro.avatarUrl} alt={pro.fullName} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{pro.fullName}</h3>
                          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                            {pro.categoryName}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{pro.city}, {pro.country} • Experience: {pro.experienceYears} Years</p>
                        <p className="text-slate-400 text-[11px]">Email: {pro.email} • Phone: {pro.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReviewModalPartnerId(pro.id);
                          setReviewDecision(true);
                          setReviewNotes('State electrical license verified and insurance policy active through 2027.');
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Application</span>
                      </button>

                      <button
                        onClick={() => {
                          setReviewModalPartnerId(pro.id);
                          setReviewDecision(false);
                          setReviewNotes('Trade license number could not be verified in state registry.');
                        }}
                        className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Submitted Documents Inspection */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60 space-y-2">
                    <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Submitted Verification Documents ({pro.documents.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pro.documents.map((doc) => (
                        <div key={doc.id} className="p-2.5 bg-slate-800 rounded-lg flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-bold text-white block capitalize">{doc.documentType.replace('_', ' ')}</span>
                            <span className="font-mono text-slate-400">{doc.documentNumber}</span>
                          </div>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-blue-400"
                            title="Inspect Document File"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {pendingPros.length === 0 && (
                <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700/60 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="font-bold text-white text-sm">Verification Queue Clear</div>
                  <p className="text-xs text-slate-400 mt-1">All partner applications have been reviewed.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. PARTNERS LIST */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-white">All Platform Professionals</h2>
                <p className="text-slate-400 text-xs">Total registered technicians: {professionals.length}</p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name, trade or city..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto bg-slate-800/70 rounded-2xl border border-slate-700">
              <table className="w-full text-left">
                <thead className="text-[11px] text-slate-400 border-b border-slate-700 bg-slate-900/60">
                  <tr>
                    <th className="p-3">Professional</th>
                    <th className="p-3">Trade</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Rate</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {professionals
                    .filter(p => p.fullName.toLowerCase().includes(partnerSearch.toLowerCase()) || p.categoryName.toLowerCase().includes(partnerSearch.toLowerCase()))
                    .map((pro) => (
                      <tr key={pro.id} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={pro.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <div className="font-bold text-white">{pro.fullName}</div>
                              <div className="text-[10px] text-slate-400">{pro.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-300">{pro.categoryName}</td>
                        <td className="p-3 text-slate-300">{pro.city}</td>
                        <td className="p-3">
                          {pro.isSuspended ? (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                              Suspended
                            </span>
                          ) : (
                            <StatusBadge status={pro.verificationStatus} size="sm" />
                          )}
                        </td>
                        <td className="p-3 font-bold text-white">${pro.hourlyRate}/hr</td>
                        <td className="p-3 text-amber-400 font-semibold">{pro.rating.toFixed(1)} ★ ({pro.reviewCount})</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => adminToggleSuspendUser(pro.id, 'partner', !pro.isSuspended)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              pro.isSuspended 
                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50' 
                                : 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30'
                            }`}
                          >
                            {pro.isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. DISPUTES & COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Disputes & Complaints Queue</h2>
              <p className="text-slate-400 text-xs">Customer protection, charge disputes, and safety incident management.</p>
            </div>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {c.bookingRef}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm">{c.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{c.description}</p>
                  
                  <div className="text-[11px] text-slate-400 pt-1">
                    Customer: <span className="text-white font-semibold">{c.customerName}</span> • Technician: <span className="text-white font-semibold">{c.professionalName}</span>
                  </div>

                  {c.status === 'open' && (
                    <div className="pt-2">
                      {resolvingComplaintId === c.id ? (
                        <div className="p-3 bg-slate-900 rounded-xl space-y-2">
                          <input
                            type="text"
                            placeholder="Resolution notes (e.g. Refund issued, technician reprimanded)..."
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleComplaintResolveSubmit}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                            >
                              Confirm Resolution
                            </button>
                            <button
                              onClick={() => setResolvingComplaintId(null)}
                              className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingComplaintId(c.id)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                        >
                          Resolve Complaint
                        </button>
                      )}
                    </div>
                  )}

                  {c.resolutionNotes && (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                      <span className="font-bold block">Resolution:</span>
                      {c.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}

              {complaints.length === 0 && (
                <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700/60 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="font-bold text-white text-sm">No Open Complaints</div>
                  <p className="text-xs text-slate-400 mt-1">Platform operations running smoothly with zero active disputes.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. SERVICE CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">Marketplace Service Categories</h2>
                <p className="text-slate-400 text-xs">Configure trade offerings, base pricing and category active toggles.</p>
              </div>

              <button
                onClick={() => setShowAddCatModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{cat.name}</span>
                    <button
                      onClick={() => adminToggleCategory(cat.id, !cat.active)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{cat.description}</p>
                  <div className="text-[11px] text-slate-300 font-semibold pt-1">
                    Base Visit Starting: <span className="text-emerald-400">${cat.startingPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Administrative Audit Trail</h2>
              <p className="text-slate-400 text-xs">Immutable audit log of all admin approvals, suspensions, and dispute resolutions.</p>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">{log.action}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{log.adminEmail}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Review Partner Modal */}
      {reviewModalPartnerId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-4 text-xs text-white">
            <h3 className="text-base font-extrabold">
              {reviewDecision ? 'Approve Professional Account' : 'Reject Professional Account'}
            </h3>

            <p className="text-slate-300">
              {reviewDecision
                ? 'Approving will immediately unlock customer search visibility and grant verified status.'
                : 'Rejecting will hide the professional from customer search and notify them of needed changes.'}
            </p>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Administrative Notes & Reason *</label>
              <textarea
                rows={3}
                required
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReviewSubmit}
                className={`flex-1 py-2.5 rounded-xl font-bold ${
                  reviewDecision ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirm {reviewDecision ? 'Approval' : 'Rejection'}
              </button>
              <button
                onClick={() => setReviewModalPartnerId(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-3.5 text-xs text-white">
            <h3 className="text-base font-extrabold">Add New Service Category</h3>

            <div>
              <label className="font-bold block mb-1">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Pest Control"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">URL Slug</label>
              <input
                type="text"
                required
                placeholder="e.g. pest-control"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Starting Price ($)</label>
              <input
                type="number"
                value={newCatPrice}
                onChange={(e) => setNewCatPrice(Number(e.target.value))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Description</label>
              <textarea
                rows={2}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddCategorySubmit}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl"
              >
                Add Category
              </button>
              <button
                onClick={() => setShowAddCatModal(false)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
