import React, { useState } from 'react';
import {
  Building2,
  CalendarCheck2,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Store,
  Sparkles,
} from 'lucide-react';
import { VagouOfficialLogo } from './VagouOfficialLogo';
// Importação do Formulário Mestre OFICIAL da Tríade:
import { TriadeEstablishmentMasterForm } from './TriadeEstablishmentMasterForm';

export const VagouGatewayHub: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-['Poppins'] flex flex-col justify-between selection:bg-[#20C933] selection:text-white">
      {/* 🧭 BARRA SUPERIOR */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VagouOfficialLogo size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg tracking-tight">VagouApp</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  Gateway Oficial
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                O ecossistema inteligente de vagas imediatas & gestão
              </p>
            </div>
          </div>

          <a
            href="https://seunegocio.vagouapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-[4px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Já é parceiro?</span>
            <span>Entrar no Salão</span>
          </a>
        </div>
      </header>

      {/* 🚀 CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        <div className="text-center space-y-3 mb-10 sm:mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bem-vindo ao VagouApp</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Para onde você deseja ir hoje?
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Escolha seu objetivo abaixo para ser direcionado ao ambiente ideal.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* CARD 1: CLIENTES */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-[4px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition">
                  <CalendarCheck2 className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-[4px] text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Consumidor / Cliente
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Quero Agendar um Horário
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Encontre salões, barbearias e clínicas perto de você com vagas imediatas ou agende para os próximos dias.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Radar de vagas imediatas para hoje</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Busca inteligente por proximidade no mapa</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="https://portal.vagouapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98"
              >
                <span className="text-white font-bold">Portal de Vagas</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* CARD 2: ESTABELECIMENTOS (ABRE O FORMULÁRIO MESTRE OFICIAL DA TRÍADE) */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-[4px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition">
                  <Building2 className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-[4px] text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Salão / Profissional
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Cadastrar Meu Estabelecimento
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Preencha horários ociosos, receba novos clientes pelo Radar e modernize a gestão do seu salão ou barbearia.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Publique vagas ociosas e aumente seu faturamento</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ficha cadastral 100% digital com suporte oficial</span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-2">
              {/* BOTAO QUE ABRE O FORMULARIO MESTRE OFICIAL DA TRIADE */}
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3.5 px-5 rounded-[4px] bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                <span>Criar Meu Negócio</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="text-center">
                <a
                  href="https://seunegocio.vagouapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-emerald-400 transition inline-flex items-center gap-1"
                >
                  <span>Já possui cadastro? Entrar no Meu Negócio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🏢 OVERLAY QUE RENDERIZA EXCLUSIVAMENTE O TRIADE_ESTABLISHMENT_MASTER_FORM */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <TriadeEstablishmentMasterForm
            onClose={() => setIsRegisterModalOpen(false)}
            onSuccess={() => {
              window.location.href = 'https://seunegocio.vagouapp.com';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VagouGatewayHub;
