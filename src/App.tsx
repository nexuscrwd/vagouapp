import React, { useState, useEffect } from 'react';
import { VagouGatewayHub } from './components/VagouGatewayHub';
import { AdminMasterSuite } from './components/AdminMasterSuite';
import { SovereignEmbedForm } from './components/SovereignEmbedForm';

export const App: React.FC = () => {
  // Define a view ativa com base na rota, hostname ou parâmetros de consulta
  const [currentView, setCurrentView] = useState<'gateway' | 'admin' | 'embed'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      // Rota oficial de embed da Central Soberana (adm.vagouapp.com/embed?form=estabelecimento)
      if (
        window.location.pathname.startsWith('/embed') ||
        urlParams.get('form') === 'estabelecimento' ||
        urlParams.get('embed') === 'true'
      ) {
        return 'embed';
      }

      if (urlParams.get('view') === 'admin' || window.location.hostname.startsWith('adm.')) {
        return 'admin';
      }
    }
    return 'gateway';
  });

  useEffect(() => {
    // Atualiza o título dinamicamente conforme a visualização
    if (currentView === 'embed') {
      document.title = 'Cadastro Oficial de Estabelecimento — Central VagouApp (adm.vagouapp.com)';
    } else if (currentView === 'admin') {
      document.title = 'Painel de Admin Master — VagouApp (adm.vagouapp.com)';
    } else {
      document.title = 'VagouApp — O Ecossistema de Vagas Imediatas e Gestão de Salões';
    }
  }, [currentView]);

  if (currentView === 'embed') {
    return <SovereignEmbedForm />;
  }

  if (currentView === 'admin') {
    return <AdminMasterSuite onBackToGateway={() => setCurrentView('gateway')} />;
  }

  return <VagouGatewayHub />;
};

export default App;
