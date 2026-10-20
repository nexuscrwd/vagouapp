import React, { useState, useEffect } from 'react';
import { VagouGatewayHub } from './components/VagouGatewayHub';
import { AdminMasterSuite } from './components/AdminMasterSuite';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'gateway' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'admin' || window.location.hostname.startsWith('adm.')) {
        return 'admin';
      }
    }
    return 'gateway';
  });

  useEffect(() => {
    document.title = 'VagouApp';
  }, []);

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const isEmbed =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/embed') ||
      new URLSearchParams(window.location.search).get('embed') === 'true');

  if (isEmbed) {
    const search = window.location.search || '?form=estabelecimento';
    return (
      <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
        {!isIframeLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-950 animate-pulse">
            <div className="w-full max-w-md space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-28 h-8 bg-slate-900 rounded-[4px]" />
                <div className="w-64 h-4 bg-slate-900 rounded-[4px]" />
                <div className="w-48 h-3 bg-slate-900/70 rounded-[4px]" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-24 bg-slate-900 rounded-[4px]" />
                <div className="h-24 bg-slate-900 rounded-[4px]" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="h-11 bg-slate-900 rounded-[4px]" />
                <div className="h-11 bg-slate-900 rounded-[4px]" />
                <div className="h-11 bg-[#20C933]/20 rounded-[4px]" />
              </div>
            </div>
          </div>
        )}
        <iframe
          src={`https://adm.vagouapp.com/embed${search}`}
          onLoad={() => setIsIframeLoaded(true)}
          className={`w-full h-full border-0 bg-transparent transition-opacity duration-300 ${
            isIframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          title="Formulário Oficial VagouApp — Central Admin Master"
          allow="clipboard-write; geolocation"
        />
      </div>
    );
  }

  if (currentView === 'admin') {
    return <AdminMasterSuite onBackToGateway={() => setCurrentView('gateway')} />;
  }

  return <VagouGatewayHub />;
};

export default App;
