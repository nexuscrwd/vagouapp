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
    if (currentView === 'admin') {
      document.title = 'Painel de Admin Master — VagouApp (adm.vagouapp.com)';
    } else {
      document.title = 'VagouApp — O Ecossistema de Vagas Imediatas e Gestão de Salões';
    }
  }, [currentView]);

  const isEmbed =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/embed') ||
      new URLSearchParams(window.location.search).get('embed') === 'true');

  if (isEmbed) {
    const search = window.location.search || '?form=estabelecimento';
    return (
      <div className="w-screen h-screen bg-slate-950 overflow-hidden">
        <iframe
          src={`https://adm.vagouapp.com/embed${search}`}
          className="w-full h-full border-0 bg-transparent"
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
