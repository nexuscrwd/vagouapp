import React, { useState, useEffect } from 'react';
import officialLogoImg from '../assets/logo.png';
import {
  getSupabaseLogoCandidates,
  fetchActiveSupabaseLogoUrl,
} from '../lib/supabase';

export interface OfficialLogoDisplayProps {
  /** Fonte da imagem (opcional, prioriza Supabase Storage se não especificado) */
  src?: string;
  /** Classes CSS adicionais para a tag <img> do logo */
  className?: string;
  /** Classes CSS adicionais para o container/moldura (frame) */
  frameClassName?: string;
  /** Texto alternativo para acessibilidade */
  altText?: string;
  /** Callback opcional ao clicar no logo */
  onOpenConfig?: () => void;
  /** Elementos filhos opcionais dentro da moldura */
  children?: React.ReactNode;
}

const SUPABASE_LOGO_CANDIDATES = [
  ...getSupabaseLogoCandidates(),
  officialLogoImg,
];

/**
 * Componente dedicado à exibição do logo oficial VagouApp puxando diretamente do Supabase Storage.
 */
export const OfficialLogoDisplay: React.FC<OfficialLogoDisplayProps> = ({
  src,
  className = '',
  frameClassName = '',
  altText = 'Logo Oficial VagouApp',
  onOpenConfig,
  children,
}) => {
  const [candidates, setCandidates] = useState<string[]>(SUPABASE_LOGO_CANDIDATES);
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [currentSrc, setCurrentSrc] = useState<string>(
    src || SUPABASE_LOGO_CANDIDATES[0] || officialLogoImg
  );

  useEffect(() => {
    // Limpa eventuais caches locais antigos que sobrescreviam o logo do Supabase
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vagou_official_logo_custom');
    }

    let active = true;
    fetchActiveSupabaseLogoUrl().then((discoveredUrl) => {
      if (active && discoveredUrl && !src) {
        setCandidates((prev) => [
          discoveredUrl,
          ...prev.filter((item) => item !== discoveredUrl),
        ]);
        setCandidateIndex(0);
        setCurrentSrc(discoveredUrl);
      }
    });

    return () => {
      active = false;
    };
  }, [src]);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
    }
  }, [src]);

  const handleImageError = () => {
    const nextIndex = candidateIndex + 1;
    if (!src && nextIndex < candidates.length) {
      setCandidateIndex(nextIndex);
      setCurrentSrc(candidates[nextIndex]);
      return;
    }
    setCurrentSrc(officialLogoImg);
  };

  return (
    <div
      onClick={onOpenConfig}
      className={`official-logo-frame relative inline-flex items-center justify-center p-2 bg-transparent border-0 shadow-none select-none ${
        onOpenConfig ? 'cursor-pointer' : ''
      } ${frameClassName}`}
    >
      <img
        src={currentSrc}
        alt={altText}
        onError={handleImageError}
        className={`official-logo-raw block select-none pointer-events-none h-14 sm:h-16 w-auto max-w-[260px] sm:max-w-[300px] object-contain ${className}`}
        style={{
          filter: 'none',
          WebkitFilter: 'none',
          transform: 'none',
          imageRendering: 'auto',
        }}
        loading="eager"
        decoding="async"
      />
      {children}
    </div>
  );
};

export default OfficialLogoDisplay;
