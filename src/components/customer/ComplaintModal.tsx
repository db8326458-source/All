import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Booking } from '../../types';

interface ComplaintModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ booking, onClose, onSuccess }) => {
  const { submitComplaint } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const subjects = [
    'Technician did not arrive on time',
    'Incorrect charges or overbilling dispute',
    'Work quality does not meet standards',
    'Property damage or mess left behind',
    'Unprofessional conduct'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    submitComplaint(booking.id, title, description);
    alert('Your complaint has been logged and submitted to the Help World trust & safety admin team. We will review it within 24 hours.');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">File a Formal Complaint</h3>
              <p className="text-[11px] text-slate-500">Booking Ref: {booking.referenceNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Issue Topic *</label>
            <div className="space-y-1 mb-2">
              {subjects.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setTitle(s)}
                  className={`w-full text-left p-2 rounded-lg border text-xs transition-colors ${
                    title === s ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              placeholder="Or write specific subject..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Detailed Explanation *</label>
            <textarea
              required
              rows={4}
              placeholder="Please provide full facts: what occurred, any photos taken, and what resolution you are requesting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
            Our dispute team will contact both you and the professional. If overbilled or damaged, Help World escrow protection safeguards your payment.
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/30"
          >
            Submit Complaint for Resolution
          </button>
        </form>

      </div>
    </div>
  );
};
