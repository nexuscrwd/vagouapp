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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 🪟 CONTAINER COM ZERO ESPAÇAMENTO LATERAL (FULL RESPONSIVE) */}
      <div className="w-full h-[100dvh] sm:w-full sm:max-w-xl sm:h-[720px] sm:max-h-[95vh] bg-slate-950 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col m-0 p-0">
        <iframe
          src={srcUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="clipboard-write; geolocation"
          className="w-full h-full flex-1 border-0 bg-slate-950 m-0 p-0"
          title="Formulário Oficial VagouApp"
        />
      </div>
    </div>
  );
};

export default VagouRegisterModal;
