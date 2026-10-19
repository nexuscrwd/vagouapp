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

// URL da Central Soberana de Formulários Oficial do admvapp (adm.vagouapp.com)
const ADMIN_FORMS_BASE_URL =
  import.meta.env.VITE_ADMIN_FORMS_URL || 'https://adm.vagouapp.com';

export const VagouRegisterModal: React.FC<VagouRegisterModalProps> = ({
  isOpen,
  onClose,
  formType = 'estabelecimento',
  salonId,
  salonName,
  onSuccess,
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

      if (data?.source === 'VAGOUAPP_EMBED' || data?.source === 'VAGOUAPP_FORM') {
        if (data.event === 'CLOSE' || data.action === 'CLOSE') {
          onClose();
        }
        if (
          data.event === 'SALON_MASTER_SUCCESS' ||
          data.event === 'USER_REGISTER_SUCCESS' ||
          data.event === 'REGISTER_SUCCESS' ||
          data.event === 'LOGIN_SUCCESS' ||
          data.type === 'SALON_REGISTERED'
        ) {
          onSuccess?.(data.payload || data);
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
  }, [onClose, onSuccess]);

  const [isIframeReady, setIsIframeReady] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsIframeReady(false);
    }
  }, [isOpen]);

  const params = new URLSearchParams({
    embed: 'true',
    form: formType,
    bg: 'transparent',
  });
  if (salonId) params.set('salonId', salonId);
  if (salonName) params.set('salonName', salonName);
  const formSrc = `/api/embed-form?${params.toString()}`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 🪟 CONTAINER ÚNICO EM VIDRO JATEADO (SEM BOX DUPLO, SEM DOIS 'X', E COM TRANSPARÊNCIA TOTAL) */}
      <div className="relative w-full max-w-lg h-[540px] sm:h-[620px] max-h-[90vh] bg-slate-950/45 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_16px_56px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col transition-all duration-300">
        {/* Placeholder suave enquanto o iframe inicializa (evita qualquer micro-flicker) */}
        {!isIframeReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 pointer-events-none z-10 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-[#20C933] animate-spin" />
            <span className="text-xs font-medium text-slate-300">Carregando ambiente seguro...</span>
          </div>
        )}

        <iframe
          src={formSrc}
          title="Formulário Oficial VagouApp — Central Admin Master"
          onLoad={() => setIsIframeReady(true)}
          className={`w-full h-full border-0 bg-transparent rounded-2xl sm:rounded-3xl transition-opacity duration-300 ${
            isIframeReady ? 'opacity-100' : 'opacity-0'
          }`}
          allow="clipboard-write; geolocation"
        />
      </div>
    </div>
  );
};

export default VagouRegisterModal;
