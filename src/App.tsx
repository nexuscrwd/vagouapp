import React, { useState, useEffect } from 'react';
import { VagouGatewayHub } from './components/VagouGatewayHub';
import { AdminMasterSuite } from './components/AdminMasterSuite';

export const App: React.FC = () => {
  // Default to gateway or admin based on current hostname or query parameter
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
    // Update document title dynamically based on active view
    if (currentView === 'admin') {
      document.title = 'Painel de Admin Master — VagouApp (adm.vagouapp.com)';
    } else {
      document.title = 'VagouApp — O Ecossistema de Vagas Imediatas e Gestão de Salões';
    }
  }, [currentView]);

  if (currentView === 'admin') {
    return <AdminMasterSuite onBackToGateway={() => setCurrentView('gateway')} />;
  }

  return <VagouGatewayHub />;
};

export default App;
