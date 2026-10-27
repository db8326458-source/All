import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ProductSwitcher } from './components/common/ProductSwitcher';
import { PhoneFrame } from './components/common/PhoneFrame';
import { CustomerApp } from './components/customer/CustomerApp';
import { PartnerApp } from './components/partner/PartnerApp';
import { AdminPanel } from './components/admin/AdminPanel';
import { ApkBuilderGuide } from './components/developer/ApkBuilderGuide';
import { SupabaseSqlViewer } from './components/developer/SupabaseSqlViewer';

const AppContent: React.FC = () => {
  const { activeProduct } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* Universal Top Bar & Location Selector */}
      <ProductSwitcher />

      {/* Main Product Canvas */}
      <div className="flex-1 flex flex-col">
        {activeProduct === 'customer' && (
          <PhoneFrame>
            <CustomerApp />
          </PhoneFrame>
        )}

        {activeProduct === 'partner' && (
          <PhoneFrame>
            <PartnerApp />
          </PhoneFrame>
        )}

        {activeProduct === 'admin' && (
          <AdminPanel />
        )}

        {activeProduct === 'apk_guide' && (
          <div className="min-h-screen bg-slate-100 flex-1">
            <ApkBuilderGuide />
          </div>
        )}

        {activeProduct === 'database_schema' && (
          <div className="min-h-screen bg-slate-100 flex-1">
            <SupabaseSqlViewer />
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
