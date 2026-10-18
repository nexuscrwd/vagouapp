import React, { useState, useRef, useEffect } from 'react';
import { Search, Scissors, ArrowRight, Store, MapPin, X } from 'lucide-react';
import { initialSalons } from '../data/mockDatabase';
import { Salon } from '../types/admin';
import { fetchClientSalons } from '../lib/supabase';

interface QuickSalonLauncherProps {
  onSelectSalon?: (salon: Salon) => void;
  className?: string;
  targetApp?: 'portal' | 'seunegocio';
  placeholder?: string;
  actionLabel?: string;
}

export const QuickSalonLauncher: React.FC<QuickSalonLauncherProps> = ({
  onSelectSalon,
  className = '',
  targetApp = 'seunegocio',
  placeholder,
  actionLabel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [salonsList, setSalonsList] = useState<Salon[]>(initialSalons);
  const containerRef = useRef<HTMLDivElement>(null);

  // Busca dados diretamente do Supabase (tabela salons) com fallback para initialSalons
  useEffect(() => {
    let isMounted = true;
    fetchClientSalons()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          // Mapeia colunas do Supabase para o tipo Salon se necessário
          const mapped: Salon[] = data.map((s: any) => ({
            id: s.id,
            name: s.trade_name || s.name || 'Estabelecimento',
            tradeName: s.trade_name || s.name || '',
            cnpjCpf: s.cnpj_cpf || '',
            slug: s.slug || '',
            phone: s.phone || '',
            city: s.city || 'São Paulo',
            state: s.state || 'SP',
            address: s.address || '',
            category: s.category || 'salao',
            status: s.status || 'active',
            isVerified: s.is_verified || false,
            rating: s.rating_avg || 5.0,
            activeSlotsCount: 2,
            totalAppointments: 10,
            createdAt: s.created_at || new Date().toISOString(),
            logo_url: s.logo_url,
            branding: s.branding,
          }));
          setSalonsList(mapped);
        }
      })
      .catch((err) => {
        console.warn('Usando base local de mock para salões:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtra por nome ou slug do estabelecimento
  const filteredSalons = searchTerm.trim()
    ? salonsList.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.tradeName && s.tradeName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRedirect = (salon: Salon) => {
    if (onSelectSalon) {
      onSelectSalon(salon);
    }
    const baseUrl =
      targetApp === 'portal'
        ? 'https://portal.vagouapp.com'
        : 'https://seunegocio.vagouapp.com';
    window.location.href = `${baseUrl}?salon=${salon.slug}&source=gateway`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSalons.length > 0) {
        handleRedirect(filteredSalons[0]);
      } else if (searchTerm.trim().length > 0) {
        const sanitizedSlug = searchTerm
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        const baseUrl =
          targetApp === 'portal'
            ? 'https://portal.vagouapp.com'
            : 'https://seunegocio.vagouapp.com';
        window.location.href = `${baseUrl}?salon=${sanitizedSlug}&source=gateway`;
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl mx-auto ${className}`}>
      {/* Campo de Busca Rápida */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            (targetApp === 'portal'
              ? 'Digite o nome do salão (ex: dom-cavalcanti)...'
              : 'Digite o nome ou slug do seu salão (ex: dom-cavalcanti, bella-vita)...')
          }
          className="w-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 focus:border-[#20C933] rounded-[4px] pl-10 pr-20 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition shadow-xl"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (filteredSalons.length > 0) {
                handleRedirect(filteredSalons[0]);
              } else if (searchTerm.trim()) {
                handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any);
              }
            }}
            className="px-2.5 py-1.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-500/20"
            title="Ir para o salão"
          >
            <span className="hidden sm:inline">{actionLabel || (targetApp === 'portal' ? 'Ver vagas' : 'Entrar')}</span>
            <ArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Lista Suspensa com Autocompletar */}
      {isOpen && searchTerm.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-[4px] shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/70 max-h-72 overflow-y-auto animate-fadeIn">
          {filteredSalons.length === 0 ? (
            <div className="p-3.5 text-center text-xs text-slate-400">
              <p>Nenhum salão encontrado com o termo "{searchTerm}".</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Pressione <strong>Enter</strong> para tentar acessar diretamente via slug <span className="text-emerald-400 font-mono">/{searchTerm}</span>
              </p>
            </div>
          ) : (
            filteredSalons.map((salon: any) => (
              <div
                key={salon.id}
                onClick={() => handleRedirect(salon)}
                className="p-3 hover:bg-slate-800/80 transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  {salon.logo_url || salon.branding?.logo_url ? (
                    <img
                      src={salon.logo_url || salon.branding?.logo_url}
                      alt={salon.tradeName || salon.name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      <Scissors className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition">
                        {salon.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-slate-800 text-slate-300">
                        /{salon.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {salon.city} - {salon.state}
                      </span>
                      <span>·</span>
                      <span className="capitalize text-emerald-400/90">{salon.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold shrink-0 opacity-80 group-hover:opacity-100 transition">
                  <span className="hidden sm:inline">{actionLabel || (targetApp === 'portal' ? 'Ver vagas' : 'Acessar')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QuickSalonLauncher;
