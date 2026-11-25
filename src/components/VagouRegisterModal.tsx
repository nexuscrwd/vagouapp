import React, { useEffect } from 'react';
import { TriadeUserRegisterForm } from './auth/TriadeUserRegisterForm';

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
  slug?: string;
  origin?: 'mnvapp' | 'admvapp' | 'pvapp';
  bypassAntifraud?: boolean;
  onSuccess?: (payload: any) => void;
}

const ADMIN_EMBED_ORIGIN = 'https://adm.vagouapp.com';

const isSafeVagouRedirectUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'vagouapp.com' || parsed.hostname.endsWith('.vagouapp.com'))
    );
  } catch {
    return false;
  }
};

export const VagouRegisterModal: React.FC<VagouRegisterModalProps> = ({
  isOpen,
  onClose,
  formType = 'estabelecimento',
  salonId,
  salonName,
  slug,
  origin = 'admvapp',
  bypassAntifraud = false,
  onSuccess,
}) => {
  const isNativeUserRegister = formType === 'usuario' || formType === 'mnv_cadastro';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (isNativeUserRegister) return;
      if (event.origin !== ADMIN_EMBED_ORIGIN) return;

      let data = event.data;
      if (!data) return;

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      const eventType = data?.event || data?.action || data?.type;

      if (eventType === 'VAGOU_REDIRECT') {
        const targetUrl = data?.url || data?.payload?.url || data?.redirectUrl;
        if (typeof targetUrl === 'string' && isSafeVagouRedirectUrl(targetUrl)) {
          window.location.href = targetUrl;
        }
        return;
      }

      if (
        eventType === 'SALON_MASTER_SUCCESS' ||
        eventType === 'USER_REGISTER_SUCCESS' ||
        eventType === 'REGISTER_SUCCESS' ||
        eventType === 'LOGIN_SUCCESS' ||
        eventType === 'SALON_REGISTERED'
      ) {
        onSuccess?.(data?.payload ?? data);
        const redirectUrl = data?.url || data?.payload?.url || data?.payload?.redirectUrl;
        if (typeof redirectUrl === 'string' && isSafeVagouRedirectUrl(redirectUrl)) {
          window.location.href = redirectUrl;
        }
        return;
      }

      if (
        eventType === 'CLOSE' ||
        eventType === 'VAGOU_MODAL_CLOSE' ||
        eventType === 'CLOSE_MODAL'
      ) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, [isNativeUserRegister, onClose, onSuccess]);

  if (!isOpen) return null;

  if (isNativeUserRegister) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto animate-fadeIn"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="w-full max-w-md my-auto max-h-[100dvh] sm:max-h-[95vh] overflow-y-auto">
          <TriadeUserRegisterForm
            origin={origin}
            bypassAntifraud={bypassAntifraud}
            salonId={salonId}
            salonName={salonName}
            salonSlug={slug}
            onClose={onClose}
            onSuccess={(userData) => onSuccess?.(userData)}
            variant="card"
          />
        </div>
      </div>
    );
  }

  const params = new URLSearchParams({ form: formType });
  if (slug) params.set('slug', slug);
  if (salonId) params.set('salonId', salonId);
  if (salonName) params.set('salonName', salonName);

  const srcUrl = `${ADMIN_EMBED_ORIGIN}/embed?${params.toString()}`;

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

