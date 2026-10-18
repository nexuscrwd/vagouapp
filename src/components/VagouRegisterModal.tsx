import React, { useEffect } from 'react';

export interface VagouRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (payload: any) => void;
}

export const VagouRegisterModal: React.FC<VagouRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      // Escuta mensagens emitidas pela Central Soberana (adm.vagouapp.com)
      if (data.source === 'VAGOUAPP_EMBED' || data.source === 'VAGOUAPP_FORM') {
        if (data.event === 'CLOSE' || data.action === 'CLOSE') {
          onClose();
        }
        if (data.event === 'SALON_MASTER_SUCCESS') {
          onSuccess?.(data.payload);
          onClose();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose, onSuccess]);

  if (!isOpen) return null;

  // Determina a URL do formulário oficial da Central Soberana:
  // Em ambiente local ou preview (AI Studio/localhost), utiliza a rota interna '/embed?form=estabelecimento'
  // para renderizar imediatamente a Central Soberana deste próprio applet e evitar conflitos com DNS legado.
  // Em produção, consome diretamente o endpoint canônico 'https://adm.vagouapp.com/embed?form=estabelecimento'.
  const isPreviewOrLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('run.app') ||
      window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('127.0.0.1'));

  const formSrc = isPreviewOrLocal
    ? '/embed?form=estabelecimento'
    : 'https://adm.vagouapp.com/embed?form=estabelecimento';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Iframe oficial que carrega o formulário de cadastro com etapas e validações */}
        <iframe
          src={formSrc}
          title="Cadastro Oficial de Estabelecimento"
          className="w-full h-full border-0 bg-transparent"
          allow="clipboard-write; geolocation"
        />
      </div>
    </div>
  );
};

export default VagouRegisterModal;
