import React, { useEffect } from 'react';

export type TriadeFormType =
  | 'estabelecimento'
  | 'usuario'
  | 'usuario_login'
  | 'mnv_cadastro'
  | 'mnv_login';

export interface VagouRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType?: TriadeFormType;
  salonId?: string;
  salonName?: string;
  onSuccess?: (payload: any) => void;
}

export const VagouRegisterModal: React.FC<VagouRegisterModalProps> = ({
  isOpen,
  onClose,
  formType = 'estabelecimento',
  salonId,
  salonName,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleMessage = (event: MessageEvent) => {
      let data = event.data;
      if (!data) return;

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          // ignore
        }
      }

      if (data?.source === 'VAGOUAPP_EMBED' || data?.source === 'VAGOUAPP_FORM' || data?.type === 'VAGOU_MODAL_CLOSE' || data?.type === 'CLOSE_MODAL') {
        if (data.event === 'CLOSE' || data.action === 'CLOSE' || data?.type === 'VAGOU_MODAL_CLOSE' || data?.type === 'CLOSE_MODAL') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const srcUrl = `https://adm.vagouapp.com/embed?form=${formType}${salonId ? `&salonId=${salonId}` : ''}${salonName ? `&salonName=${encodeURIComponent(salonName)}` : ''}`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 🪟 APENAS O IFRAME INTERNO DO FORMULÁRIO (SEM CAIXAS EXTERNAS, SEM BOTÕES DUPLICADOS) */}
      <iframe
        src={srcUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="clipboard-write; geolocation"
        className="w-full max-w-lg h-[560px] sm:h-[640px] lg:h-[700px] max-h-[92vh] border-0 bg-transparent rounded-3xl"
        title="Formulário Oficial VagouApp"
      />
    </div>
  );
};

export default VagouRegisterModal;
