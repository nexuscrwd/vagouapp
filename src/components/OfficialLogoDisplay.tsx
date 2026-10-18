import React, { useState, useEffect } from 'react';
import officialLogoIconImg from '../assets/logo-icon.png';

export interface OfficialLogoDisplayProps {
  /** Fonte da imagem (opcional, prioriza Supabase Storage se não especificado) */
  src?: string;
  /** Classes CSS adicionais para a tag <img> do logo */
  className?: string;
  /** Classes CSS adicionais para o container/moldura (frame) */
  frameClassName?: string;
  /** Texto alternativo para acessibilidade */
  altText?: string;
  /** Callback para abrir o modal de configuração da URL do Supabase */
  onOpenConfig?: () => void;
  /** Elementos filhos opcionais dentro da moldura */
  children?: React.ReactNode;
}

// URL padrão do logo original no Supabase Storage
const DEFAULT_SUPABASE_LOGO_URL =
  import.meta.env.VITE_SUPABASE_LOGO_URL ||
  (import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/vagou_logo_transparente_texto_branco.png`
    : '');

/**
 * Componente dedicado à exibição do logo oficial VagouApp.
 * 
 * Exibe a imagem EXATA hospedada no bucket do Supabase Storage ou inserida pelo usuário,
 * sem qualquer alteração, vetorização ou recriação por IA.
 */
export const OfficialLogoDisplay: React.FC<OfficialLogoDisplayProps> = ({
  src,
  className = '',
  frameClassName = '',
  altText = 'Logo Oficial VagouApp',
  onOpenConfig,
  children,
}) => {
  const getInitialSrc = () => {
    if (src) return src;
    if (typeof window !== 'undefined') {
      const custom =
        localStorage.getItem('vagou_supabase_logo_url') ||
        localStorage.getItem('vagou_official_logo_custom');
      if (custom) return custom;
    }
    return DEFAULT_SUPABASE_LOGO_URL;
  };

  const [currentSrc, setCurrentSrc] = useState<string>(getInitialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const updated =
        localStorage.getItem('vagou_supabase_logo_url') ||
        localStorage.getItem('vagou_official_logo_custom');
      if (updated) {
        setCurrentSrc(updated);
        setHasError(false);
      }
    };

    window.addEventListener('vagou_logo_updated', handleUpdate);
    return () => window.removeEventListener('vagou_logo_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
    }
  }, [src]);

  const handleImageError = () => {
    console.warn('[VagouApp] URL do Supabase Storage não respondeu. Aguardando URL pública oficial.');
    setHasError(true);
  };

  return (
    <div
      className={`official-logo-frame relative inline-flex items-center justify-center p-2 bg-transparent border-0 shadow-none select-none ${frameClassName}`}
    >
      {currentSrc && !hasError ? (
        <img
          src={currentSrc}
          alt={altText}
          onError={handleImageError}
          className={`official-logo-raw block select-none pointer-events-none max-h-16 w-auto ${className}`}
          style={{
            filter: 'none',
            WebkitFilter: 'none',
            transform: 'none',
            imageRendering: 'auto',
          }}
          loading="eager"
          decoding="async"
        />
      ) : (
        /* Estado limpo oficial exibindo somente a logo sobre fundo transparente */
        <div
          onClick={onOpenConfig}
          className="flex items-center gap-2.5 cursor-pointer select-none"
          title="VagouApp Oficial"
        >
          <img
            src={officialLogoIconImg}
            alt="VagouApp Checkmark Oficial"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0"
          />
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Vagou<span className="text-[#20C933] font-extrabold">app</span>
          </span>
        </div>
      )}

      {children}
    </div>
  );
};

export default OfficialLogoDisplay;
