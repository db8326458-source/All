import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, ArrowUpRight, TrendingUp, Calendar, Download, CheckCircle2 } from 'lucide-react';

export const PartnerEarnings: React.FC = () => {
  const { currentPartner, bookings, currentCountry } = useApp();
  const [payoutRequested, setPayoutRequested] = useState(false);

  const completed = bookings.filter(b => b.professionalId === currentPartner.id && b.status === 'completed');

  const totalRevenue = completed.reduce((sum, b) => {
    return sum + (b.finalCharges?.total || b.estimatedCharges.totalEstimate);
  }, 1280);

  const platformFee = Math.round(totalRevenue * 0.10); // 10% platform fee
  const netEarnings = totalRevenue - platformFee;

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
      alert(`Payout of ${currentCountry.currencySymbol}${netEarnings} initiated to your registered bank account!`);
    }, 1500);
  };

  return (
    <div className="space-y-5 pb-14 px-4 pt-4 max-w-2xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="text-xs text-slate-500">Track job invoices and instant bank payouts</p>
      </div>

      {/* Hero Balance Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Available Balance</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Escrow Protected
          </span>
        </div>

        <div className="text-3xl font-black tracking-tight text-white">
          {currentCountry.currencySymbol}{netEarnings.toLocaleString()}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 block">Gross Billing:</span>
            <span className="font-bold text-slate-200">{currentCountry.currencySymbol}{totalRevenue}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Platform Commission (10%):</span>
            <span className="font-bold text-slate-400">-{currentCountry.currencySymbol}{platformFee}</span>
          </div>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={payoutRequested || netEarnings <= 0}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-xs"
        >
          {payoutRequested ? (
            <span>Processing Bank Transfer...</span>
          ) : (
            <>
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw to Bank Account</span>
            </>
          )}
        </button>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Completed Jobs Invoices</h2>
          <span className="text-slate-400 text-[11px]">{completed.length} paid jobs</span>
        </div>

        <div className="space-y-2">
          {completed.map((b) => (
            <div key={b.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{b.customerName}</span>
                  <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                    {b.referenceNumber}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">{b.specificIssue}</div>
                <div className="text-slate-400 text-[10px]">{b.scheduledDate}</div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-sm text-emerald-700">
                  +{currentCountry.currencySymbol}{b.finalCharges?.total || b.estimatedCharges.totalEstimate}
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">Settled</span>
              </div>
            </div>
          ))}

          {completed.length === 0 && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              No completed job settlements yet. Complete your accepted jobs to see revenue appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
