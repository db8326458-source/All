import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Save, Plus, X, Check, MapPin, DollarSign, Shield } from 'lucide-react';

export const PartnerServices: React.FC = () => {
  const { currentPartner, updatePartnerProfile, currentCountry } = useApp();

  const [hourlyRate, setHourlyRate] = useState(currentPartner.hourlyRate);
  const [visitFee, setVisitFee] = useState(currentPartner.visitFee);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(currentPartner.serviceRadiusKm);
  const [headline, setHeadline] = useState(currentPartner.headline);
  const [bio, setBio] = useState(currentPartner.bio);
  const [skills, setSkills] = useState<string[]>(currentPartner.skills);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSkills(prev => [...prev, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePartnerProfile(currentPartner.id, {
      hourlyRate: Number(hourlyRate),
      visitFee: Number(visitFee),
      serviceRadiusKm: Number(serviceRadiusKm),
      headline,
      bio,
      skills
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 pb-14 px-4 pt-4 max-w-2xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Rates & Service Coverage
        </h1>
        <p className="text-xs text-slate-500">Configure your transparent pricing and covered service areas</p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile & service charges updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Pricing Cards */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Service Charges & Fees</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Standard Hourly Rate ({currentCountry.currencySymbol}/hr)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Displayed to customers on your public profile</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                On-Site Visit & Inspection Fee ({currentCountry.currencySymbol})
              </label>
              <input
                type="number"
                min="5"
                max="150"
                value={visitFee}
                onChange={(e) => setVisitFee(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Guaranteed minimum charge upon arrival</span>
            </div>
          </div>
        </div>

        {/* Coverage Radius */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Service Radius Coverage</span>
            </h2>
            <span className="font-extrabold text-blue-600 text-sm">{serviceRadiusKm} km radius</span>
          </div>

          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={serviceRadiusKm}
            onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>5 km (Local neighborhood)</span>
            <span>30 km (Metropolitan)</span>
            <span>60 km (Regional)</span>
          </div>
        </div>

        {/* Professional Headline & Bio */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h2 className="font-extrabold text-slate-900 text-sm">Professional Profile Summary</h2>
          
          <div>
            <label className="font-bold text-slate-700 block mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Detailed Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* Verified Skills Management */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h2 className="font-extrabold text-slate-900 text-sm">Skills & Capabilities</h2>
          
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-200/60"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Tankless water heaters)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 text-sm flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
