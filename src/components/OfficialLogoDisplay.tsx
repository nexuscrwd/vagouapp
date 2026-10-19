import React, { useState, useEffect } from 'react';
import officialLogoImg from '../assets/logo.png';
import { fetchActiveSupabaseLogoUrl } from '../lib/supabase';

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

/**
 * Componente dedicado à exibição do logo oficial VagouApp.
 * Carrega instantaneamente sem piscadas (sem flicker de 404s) e transiciona suavemente.
 */
export const OfficialLogoDisplay: React.FC<OfficialLogoDisplayProps> = ({
  src,
  className = '',
  frameClassName = '',
  altText = 'Logo Oficial VagouApp',
  onOpenConfig,
  children,
}) => {
  // Inicia com o logo local oficial por padrão para carregamento instantâneo de 0ms (zero piscadas)
  const [currentSrc, setCurrentSrc] = useState<string>(src || officialLogoImg);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Limpa eventuais caches locais antigos
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vagou_official_logo_custom');
    }

    if (src) {
      setCurrentSrc(src);
      return;
    }

    let active = true;

    // Busca assíncrona no Supabase Storage: pré-carrega em memória antes de aplicar ao DOM
    // Evita qualquer piscada ou troca de imagem quebrada na tela
    fetchActiveSupabaseLogoUrl().then((discoveredUrl) => {
      if (active && discoveredUrl && discoveredUrl !== officialLogoImg) {
        const preloader = new Image();
        preloader.src = discoveredUrl;
        preloader.onload = () => {
          if (active) {
            setCurrentSrc(discoveredUrl);
          }
        };
      }
    });

    return () => {
      active = false;
    };
  }, [src]);

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
        onLoad={() => setIsLoaded(true)}
        className={`official-logo-raw block select-none pointer-events-none h-14 sm:h-16 w-auto max-w-[260px] sm:max-w-[300px] object-contain transition-opacity duration-700 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
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

