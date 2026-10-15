import React from 'react';

export interface VagouOfficialLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'full';
  className?: string;
  onClick?: () => void;
  title?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
  '2xl': 'w-14 h-14',
};

export const VagouOfficialLogo: React.FC<VagouOfficialLogoProps> = ({
  size = 'md',
  variant = 'icon',
  className = '',
  onClick,
  title = 'VagouApp Oficial',
}) => {
  const containerSize = sizeClasses[size] || sizeClasses.md;

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        title={title}
        className={`inline-flex items-center gap-2 select-none shrink-0 ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition' : ''} ${className}`}
      >
        <div className="w-8 h-8 rounded-[4px] bg-slate-900/90 flex items-center justify-center p-1 shadow-md shadow-emerald-500/10">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="vGradFullSymbol" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#087A2A" />
                <stop offset="50%" stopColor="#20C933" />
                <stop offset="100%" stopColor="#38E54B" />
              </linearGradient>
            </defs>
            <path
              d="M 25 72 C 15 60, 30 42, 46 52 L 72 82 C 80 90, 92 88, 100 78 L 142 22 C 152 8, 168 22, 158 36 L 98 126 C 86 142, 64 142, 52 126 Z"
              fill="url(#vGradFullSymbol)"
            />
          </svg>
        </div>
        <div className="flex items-baseline">
          <span className="text-xl font-black italic tracking-tight text-white">agou</span>
          <span className="text-xs font-black italic text-[#20C933] ml-0.5">app</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      title={title}
      className={`${containerSize} rounded-[4px] overflow-hidden flex items-center justify-center shrink-0 bg-slate-900/90 shadow-md shadow-emerald-500/10 p-1.5 select-none ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition' : ''
      } ${className}`}
    >
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full shrink-0">
        <defs>
          <linearGradient id="vGradIconEntry" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087A2A" />
            <stop offset="50%" stopColor="#20C933" />
            <stop offset="100%" stopColor="#38E54B" />
          </linearGradient>
        </defs>
        <path
          d="M 25 72 C 15 60, 30 42, 46 52 L 72 82 C 80 90, 92 88, 100 78 L 142 22 C 152 8, 168 22, 158 36 L 98 126 C 86 142, 64 142, 52 126 Z"
          fill="url(#vGradIconEntry)"
        />
      </svg>
    </div>
  );
};
