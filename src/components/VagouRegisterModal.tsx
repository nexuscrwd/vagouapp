import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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

// URL da Central Soberana de Formulários (admvapp - adm.vagouapp.com)
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
    const handleMessage = (event: MessageEvent) => {
      let data = event.data;
      if (!data) return;

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          // não é JSON string
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onSuccess]);

  if (!isOpen) return null;

  const params = new URLSearchParams({
    embed: 'true',
    form: formType,
    bg: 'transparent',
  });
  if (salonId) params.set('salonId', salonId);
  if (salonName) params.set('salonName', salonName);

  const formSrc = `${ADMIN_FORMS_BASE_URL}/embed?${params.toString()}`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[880px] bg-slate-900 border border-slate-800 rounded-[4px] shadow-2xl overflow-hidden flex flex-col">
        {/* Barra superior de controle do embed */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[4px] bg-[#20C933] inline-block animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-wide">
              {formType === 'estabelecimento'
                ? 'Cadastro Oficial de Estabelecimento'
                : formType === 'usuario'
                ? 'Cadastro de Usuário (Cliente)'
                : formType === 'usuario_login'
                ? 'Acesso de Cliente (Login)'
                : 'Central de Parceiros (Meu Negócio)'}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              admvapp embed
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-xs"
            title="Fechar Formulário (Esc)"
          >
            <span className="hidden sm:inline text-[11px] font-medium">Fechar</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Frame com formulário oficial do admvapp */}
        <div className="w-full flex-1 relative bg-slate-950">
          <iframe
            src={formSrc}
            title="Formulário Oficial VagouApp — Central Admin Master"
            className="w-full h-full border-0 bg-transparent"
            allow="clipboard-write; geolocation"
          />
        </div>
      </div>
    </div>
  );
};

export default VagouRegisterModal;
