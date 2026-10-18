import React, { useState, useEffect } from 'react';
import officialLogoImg from '../assets/logo.png';
import {
  getSupabaseLogoCandidates,
  fetchActiveSupabaseLogoUrl,
} from '../lib/supabase';

export interface VagouOfficialLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  variant?: 'icon' | 'full' | 'hero';
  className?: string;
  onClick?: () => void;
  title?: string;
  framed?: boolean;
}

const SUPABASE_LOGO_CANDIDATES = [
  ...getSupabaseLogoCandidates(),
  officialLogoImg,
];

export const VagouOfficialLogo: React.FC<VagouOfficialLogoProps> = ({
  variant = 'icon',
  className = '',
  onClick,
  title = 'VagouApp Oficial',
  framed = false,
}) => {
  const [candidates, setCandidates] = useState<string[]>(SUPABASE_LOGO_CANDIDATES);
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [logoSrc, setLogoSrc] = useState<string>(
    SUPABASE_LOGO_CANDIDATES[0] || officialLogoImg
  );

  useEffect(() => {
    let active = true;
    fetchActiveSupabaseLogoUrl().then((discoveredUrl) => {
      if (active && discoveredUrl) {
        setCandidates((prev) => [
          discoveredUrl,
          ...prev.filter((item) => item !== discoveredUrl),
        ]);
        setCandidateIndex(0);
        setLogoSrc(discoveredUrl);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleImageError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidates.length) {
      setCandidateIndex(nextIndex);
      setLogoSrc(candidates[nextIndex]);
    } else {
      setLogoSrc(officialLogoImg);
    }
  };

  // Variante HERO: Exibição no Gateway Hub Central
  if (variant === 'hero') {
    const content = (
      <img
        src={logoSrc}
        alt="VagouApp Oficial"
        onError={handleImageError}
        className="h-14 sm:h-16 w-auto max-w-[280px] sm:max-w-[340px] object-contain select-none pointer-events-none"
        loading="eager"
        decoding="async"
      />
    );

    if (framed) {
      return (
        <div
          onClick={onClick}
          title={title}
          className={`inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-emerald-950/20 backdrop-blur-xs ring-1 ring-slate-800/50 ${
            onClick ? 'cursor-pointer hover:border-slate-700 transition' : ''
          } ${className}`}
        >
          {content}
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        title={title}
        className={`inline-flex items-center justify-center select-none ${
          onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition' : ''
        } ${className}`}
      >
        {content}
      </div>
    );
  }

  // Variante FULL: Logo completo padrão
  if (variant === 'full') {
    const content = (
      <img
        src={logoSrc}
        alt="VagouApp Oficial"
        onError={handleImageError}
        className="h-8 sm:h-9 w-auto max-w-[220px] object-contain select-none pointer-events-none"
        loading="eager"
        decoding="async"
      />
    );

    if (framed) {
      return (
        <div
          onClick={onClick}
          title={title}
          className={`inline-flex items-center justify-center p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg ${
            onClick ? 'cursor-pointer hover:border-slate-700 transition' : ''
          } ${className}`}
        >
          {content}
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        title={title}
        className={`inline-flex items-center justify-center select-none shrink-0 ${
          onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition' : ''
        } ${className}`}
      >
        {content}
      </div>
    );
  }

  // Variante ICON: Ícone / Símbolo V Oficial
  return (
    <div
      onClick={onClick}
      title={title}
      className={`w-10 h-10 rounded-[4px] overflow-hidden flex items-center justify-center shrink-0 bg-slate-900/90 border border-slate-800 shadow-md shadow-emerald-500/10 p-1.5 select-none ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition' : ''
      } ${className}`}
    >
      <img
        src="/icon.svg"
        alt="VagouApp Símbolo Oficial"
        className="w-full h-full object-contain pointer-events-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default VagouOfficialLogo;
export { OfficialLogoDisplay } from './OfficialLogoDisplay';
