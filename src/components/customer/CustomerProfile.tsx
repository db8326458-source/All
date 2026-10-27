import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  MapPin, 
  Globe, 
  Bell, 
  Shield, 
  Plus, 
  Check, 
  Trash2, 
  LogOut, 
  Edit3,
  CreditCard,
  Save
} from 'lucide-react';
import { CustomerAddress } from '../../types';

export const CustomerProfile: React.FC = () => {
  const { 
    currentCustomer, 
    setCurrentCustomer, 
    addresses, 
    addCustomerAddress, 
    resetToDefaultData 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentCustomer.fullName);
  const [phoneNumber, setPhoneNumber] = useState(currentCustomer.phoneNumber);
  const [email, setEmail] = useState(currentCustomer.email);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New address form state
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState(currentCustomer.selectedCity);
  const [newPostal, setNewPostal] = useState('10001');

  // Preferences
  const [language, setLanguage] = useState(currentCustomer.preferredLanguage || 'English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentCustomer({
      ...currentCustomer,
      fullName,
      phoneNumber,
      email,
      preferredLanguage: language
    });
    setIsEditing(false);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;

    addCustomerAddress({
      customerId: currentCustomer.id,
      label: newLabel,
      street: newStreet,
      apartment: newApartment,
      city: newCity,
      country: currentCustomer.selectedCountry,
      postalCode: newPostal,
      isDefault: false
    });

    setShowAddAddress(false);
    setNewStreet('');
    setNewApartment('');
  };

  return (
    <div className="space-y-6 pb-14 px-4 pt-4 max-w-2xl mx-auto">
      
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentCustomer.avatarUrl}
              alt={currentCustomer.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md"
            />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {currentCustomer.fullName}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{currentCustomer.email}</p>
            <p className="text-xs text-slate-500">{currentCustomer.phoneNumber}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Edit Profile"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Form Modal/Inline */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3 text-xs">
          <div className="font-bold text-slate-900 text-sm">Edit Personal Details</div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Manage Addresses */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Saved Service Addresses</h3>
          </div>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        <div className="space-y-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 mr-2">
                  {addr.label}
                </span>
                <span className="text-slate-700">{addr.street}</span>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {addr.city}, {addr.postalCode}
                </div>
              </div>
              {addr.isDefault && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <form onSubmit={handleAddNewAddress} className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Add New Address</div>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map(lbl => (
                <button
                  type="button"
                  key={lbl}
                  onClick={() => setNewLabel(lbl)}
                  className={`px-3 py-1 rounded-lg font-semibold border ${
                    newLabel === lbl ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              placeholder="Street Address..."
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Apartment / Suite..."
                value={newApartment}
                onChange={(e) => setNewApartment(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Postal Code..."
                value={newPostal}
                onChange={(e) => setNewPostal(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddAddress(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Preferences & Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="font-extrabold text-sm text-slate-900">App Preferences</div>

        {/* Language selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">Display Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="English">English</option>
            <option value="Español">Español</option>
            <option value="Français">Français</option>
            <option value="Deutsch">Deutsch</option>
            <option value="العربية">العربية</option>
            <option value="हिन्दी">हिन्दी</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-700">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">Push & In-App Alerts</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Privacy */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-700">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">Two-Factor Authentication</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Active
          </span>
        </div>
      </div>

      {/* Danger / Reset zone */}
      <div className="pt-2 text-center space-y-2">
        <button
          onClick={() => {
            if (confirm('Reset demo state to pristine initial database data?')) {
              resetToDefaultData();
              alert('Platform state reset to initial demo data.');
            }
          }}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Reset Demo Data to Initial State
        </button>
      </div>

    </div>
  );
};
